import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import * as path from 'node:path';
import test from 'node:test';

interface MockUri { fsPath: string }

interface AppViewMeta {
  viewName: string;
  baseViewCategory: string;
  baseViewName: string;
  baseViewUUID: string;
  table: string;
  sampleControlUuid: string;
}

interface AppModuleMeta {
  moduleName: string;
  views: AppViewMeta[];
}

interface AppMeta {
  appName: string;
  appVersion: string;
  appProvider: string;
  modules: AppModuleMeta[];
}

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/content/ContentProvider.js');

const writtenFiles = new Map<string, string>();
const readFileMap = new Map<string, Uint8Array>();
const createdDirectories: string[] = [];
const copiedFiles: Array<{ from: string; to: string }> = [];
const loggedErrors: string[] = [];

let browserStartupFlags = '--flag-one --name="Dev Browser"';
let debugServerPort = 8082;
let webClientUrl = 'https://host.example/webx/index.html';

const extensionUri: MockUri = { fsPath: path.join(path.sep, 'extension-root') };

const mockVscode = {
  Uri: {
    joinPath: (base: MockUri, ...parts: string[]) => ({ fsPath: path.join(base.fsPath, ...parts) })
  },
  workspace: {
    fs: {
      writeFile: async (uri: MockUri, content: Uint8Array) => {
        writtenFiles.set(uri.fsPath, new TextDecoder().decode(content));
      },
      readFile: async (uri: MockUri) => {
        const content = readFileMap.get(uri.fsPath);
        if (!content) {
          throw new Error(`ENOENT: ${uri.fsPath}`);
        }
        return content;
      },
      createDirectory: async (uri: MockUri) => {
        createdDirectories.push(uri.fsPath);
      },
      copy: async (from: MockUri, to: MockUri) => {
        copiedFiles.push({ from: from.fsPath, to: to.fsPath });
      }
    }
  },
  window: {
    showErrorMessage: (_message: string) => undefined
  }
};

const mockLoggerWrapper = {
  getClassLogger: (_className: string) => ({
    debug: (_message: string) => undefined,
    info: (_message: string) => undefined,
    warn: (_message: string) => undefined,
    error: (message: string) => {
      loggedErrors.push(message);
    }
  })
};

const mockSettingItems = {
  DEV_SERVER_PORT_PROP: 'WebClientUIAPI.devServer.port',
  WEB_CLIENT_URL_PROP: 'WebClientUIAPI.webClient.url',
  getDebugServerPortSetting: () => debugServerPort,
  getWebClientUrlSetting: () => webClientUrl,
  getBrowserStartupFlagsSetting: () => browserStartupFlags
};

const mockUtils = {
  getCurrentExtension: () => ({ extensionUri }),
  linkFolder: async (_actual: string, _symlink: string) => undefined,
  tokenizeBrowserStartupFlags: (flags: string) => {
    if (!flags) {
      return [];
    }
    return ['--flag-one', '--name=Dev Browser'];
  }
};

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'vscode') {
    return mockVscode;
  }
  if (request === '../logger/LoggerWrapper') {
    return mockLoggerWrapper;
  }
  if (request === '../settings/SettingItems') {
    return mockSettingItems;
  }
  if (request === '../utils/Utils') {
    return mockUtils;
  }
  return originalLoad.call(this, request, parent, isMain);
};

function resetState(): void {
  writtenFiles.clear();
  readFileMap.clear();
  createdDirectories.length = 0;
  copiedFiles.length = 0;
  loggedErrors.length = 0;
  browserStartupFlags = '--flag-one --name="Dev Browser"';
  debugServerPort = 8082;
  webClientUrl = 'https://host.example/webx/index.html';
  delete requireForTest.cache[moduleId];
}

async function loadContentProviderModule(): Promise<typeof import('../src/content/ContentProvider.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/content/ContentProvider.js');
}

function getSampleAppMeta(): AppMeta {
  return {
    appName: 'SalesAddon',
    appVersion: '1.0.0',
    appProvider: 'Partner',
    modules: [
      {
        moduleName: 'MainModule',
        views: [
          {
            viewName: 'OrderDetailView',
            baseViewCategory: 'System',
            baseViewName: 'Sales Order Detail',
            baseViewUUID: 'guid-detail',
            table: '17',
            sampleControlUuid: 'c-1'
          },
          {
            viewName: 'BPListView',
            baseViewCategory: 'System',
            baseViewName: 'Business Partner List',
            baseViewUUID: 'guid-list',
            table: '2',
            sampleControlUuid: 'c-2'
          }
        ]
      }
    ]
  };
}

test('generateSettings writes expected extension settings payload', async () => {
  resetState();
  debugServerPort = 9191;
  webClientUrl = 'https://dev-host/webx/index.html';

  const moduleRef = await loadContentProviderModule();
  const provider = new moduleRef.ContentProvider() as unknown as { generateSettings: (uri: MockUri) => Promise<void> };
  const vscodeFolderUri = { fsPath: path.join(path.sep, 'workspace', '.vscode') };

  await provider.generateSettings(vscodeFolderUri);

  const settingsPath = path.join(vscodeFolderUri.fsPath, 'settings.json');
  const settingsRaw = writtenFiles.get(settingsPath);
  assert.ok(settingsRaw, 'settings.json should be written');

  const settings = JSON.parse(settingsRaw || '{}') as Record<string, unknown>;
  assert.equal(settings['json.validate.enable'], true);
});

test('generateLaunchJson creates list and detail routes and keeps runtime args only for chrome', async () => {
  resetState();

  const moduleRef = await loadContentProviderModule();
  const provider = new moduleRef.ContentProvider() as unknown as {
    generateLaunchJson: (appMeta: AppMeta, uri: MockUri) => Promise<void>
  };
  const vscodeFolderUri = { fsPath: path.join(path.sep, 'workspace', '.vscode') };

  await provider.generateLaunchJson(getSampleAppMeta(), vscodeFolderUri);

  const launchPath = path.join(vscodeFolderUri.fsPath, 'launch.json');
  const launchRaw = writtenFiles.get(launchPath);
  assert.ok(launchRaw, 'launch.json should be written');

  const launch = JSON.parse(launchRaw || '{}') as {
    configurations: Array<{ name: string; type: string; url: string; runtimeArgs?: string[] }>;
  };
  assert.equal(launch.configurations.length, 4, 'two views should produce four debug configurations');

  const detailChrome = launch.configurations.find((item) => item.type === 'chrome' && item.name.includes('OrderDetailView'));
  assert.ok(detailChrome, 'detail chrome configuration should exist');
  assert.ok(detailChrome?.url.includes('/Objects/17/Detail?view=17.detailView'));
  assert.deepEqual(detailChrome?.runtimeArgs, ['--flag-one', '--name=Dev Browser']);

  const listChrome = launch.configurations.find((item) => item.type === 'chrome' && item.name.includes('BPListView'));
  assert.ok(listChrome, 'list chrome configuration should exist');
  assert.ok(listChrome?.url.includes('/Objects/2/List'));

  const embeddedDetail = launch.configurations.find((item) => item.type === 'editor-browser' && item.name.includes('OrderDetailView'));
  assert.ok(embeddedDetail, 'embedded detail configuration should exist');
  assert.equal(embeddedDetail?.runtimeArgs, undefined, 'embedded configuration must not include runtimeArgs');
});

test('generateManifestJson composes namespace and bundle entries', async () => {
  resetState();

  const moduleRef = await loadContentProviderModule();
  const provider = new moduleRef.ContentProvider() as unknown as {
    generateManifestJson: (appMeta: AppMeta, module: AppModuleMeta) => string
  };
  const appMeta = getSampleAppMeta();
  const manifestRaw = provider.generateManifestJson(appMeta, appMeta.modules[0]);
  const manifest = JSON.parse(manifestRaw) as {
    name: string;
    'b1.bundles': Array<{ id: string; baseViewGuid: string; layout: string }>;
  };

  assert.equal(manifest.name, 'Partner.SalesAddon.MainModule');
  assert.equal(manifest['b1.bundles'].length, 2);
  assert.equal(manifest['b1.bundles'][0].id, 'OrderDetailView.layout');
  assert.equal(manifest['b1.bundles'][1].layout, 'layout/BPListView.layout.json');
});

test('generateMtaYaml throws when template misses modules anchor', async () => {
  resetState();
  const invalidTemplatePath = path.join(extensionUri.fsPath, 'template', 'mta.yaml.template');
  readFileMap.set(invalidTemplatePath, new TextEncoder().encode('ID: <%= ID %>\nversion: <%= version %>'));

  const moduleRef = await loadContentProviderModule();
  const provider = new moduleRef.ContentProvider() as unknown as {
    generateMtaYaml: (appMeta: AppMeta, appFolderUri: MockUri) => Promise<void>
  };

  await assert.rejects(
    async () => provider.generateMtaYaml(getSampleAppMeta(), { fsPath: path.join(path.sep, 'workspace', 'SalesAddon') }),
    /missing modules section/
  );
});

test('createApp throws when modules are empty', async () => {
  resetState();

  const moduleRef = await loadContentProviderModule();
  const provider = new moduleRef.ContentProvider();

  await assert.rejects(
    async () => provider.createApp({ appName: 'EmptyApp', appVersion: '1.0.0', appProvider: 'Partner', modules: [] }, { fsPath: path.join(path.sep, 'workspace') } as never),
    /modules cannot be empty/
  );
  assert.ok(loggedErrors.some((message) => message.includes('modules cannot be empty')));
});

test('addModuleToExistingApp appends module to mta.yaml', async () => {
  resetState();

  const appFolder = path.join(path.sep, 'workspace', 'HelloB1');
  const appJsonPath = path.join(appFolder, 'app.json');
  const mtaYamlPath = path.join(appFolder, 'mta.yaml');
  const launchJsonPath = path.join(appFolder, '.vscode', 'launch.json');
  const tsconfigTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'tsconfig.json.template');
  const controllerTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'controller.ts.template');
  const utilityTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'utility.ts.template');
  const modelsTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'models.ts.template');
  const i18nEnTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'i18n_en.properties.template');
  const i18nTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'i18n.properties.template');
  const layoutTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'layout.json.template');
  const mtaTemplatePath = path.join(extensionUri.fsPath, 'template', 'mta.yaml.template');

  readFileMap.set(appJsonPath, new TextEncoder().encode(JSON.stringify({
    applications: [
      {
        name: 'SapB1.HelloB1.Sales',
        path: 'HelloB1_1.0.0/Sales/webapp'
      }
    ]
  })));
  readFileMap.set(mtaYamlPath, new TextEncoder().encode(`_schema-version: 3.2.0\nID: HelloB1\nversion: 1.0.0\nprovider: SapB1\nmodules:\n- name: Sales\n  type: ui-extension\n  path: Sales\n`));
  readFileMap.set(launchJsonPath, new TextEncoder().encode(JSON.stringify({ version: '0.2.0', configurations: [] })));
  readFileMap.set(tsconfigTemplatePath, new TextEncoder().encode('{}'));
  readFileMap.set(controllerTemplatePath, new TextEncoder().encode('export default class <%= viewName %> {}'));
  readFileMap.set(utilityTemplatePath, new TextEncoder().encode('export const utility = true;'));
  readFileMap.set(modelsTemplatePath, new TextEncoder().encode('export interface Models {}'));
  readFileMap.set(i18nEnTemplatePath, new TextEncoder().encode('title=Title'));
  readFileMap.set(i18nTemplatePath, new TextEncoder().encode('title=Title'));
  readFileMap.set(layoutTemplatePath, new TextEncoder().encode('{"controller":"<%= namespace %>.controller.<%= viewName %>","guid":"<Add existing control\'s stable ID>"}'));
  readFileMap.set(mtaTemplatePath, new TextEncoder().encode(`_schema-version: 3.2.0\nID: <%= ID %>\nversion: <%= version %>\nprovider: <%= provider %>\nmodules:\n- name: <%= moduleName %>\n  type: <%= moduleType %>\n  path: <%= modulePath %>\n`));

  const moduleRef = await loadContentProviderModule();
  const provider = new moduleRef.ContentProvider();
  await provider.addModuleToExistingApp({
    appName: 'HelloB1',
    appVersion: '1.0.0',
    appProvider: 'SapB1',
    modules: [
      {
        moduleName: 'Service',
        views: [
          {
            viewName: 'ServiceCallDetail',
            baseViewCategory: 'System',
            baseViewName: 'Service Calls List',
            baseViewUUID: 'view-guid',
            table: 'OSCL',
            sampleControlUuid: 'control-guid'
          }
        ]
      }
    ]
  } as never, { fsPath: appFolder } as never);

  const updatedMta = writtenFiles.get(mtaYamlPath);
  assert.ok(updatedMta, 'mta.yaml should be updated');
  assert.ok(updatedMta?.includes('- name: Service'));
  assert.ok(updatedMta?.includes('path: Service'));
});

test('addModuleToExistingApp throws when mta.yaml is missing', async () => {
  resetState();

  const appFolder = path.join(path.sep, 'workspace', 'HelloB1');
  const appJsonPath = path.join(appFolder, 'app.json');
  const launchJsonPath = path.join(appFolder, '.vscode', 'launch.json');
  const tsconfigTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'tsconfig.json.template');
  const controllerTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'controller.ts.template');
  const utilityTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'utility.ts.template');
  const modelsTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'models.ts.template');
  const i18nEnTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'i18n_en.properties.template');
  const i18nTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'i18n.properties.template');
  const layoutTemplatePath = path.join(extensionUri.fsPath, 'template', 'module', 'layout.json.template');
  const mtaTemplatePath = path.join(extensionUri.fsPath, 'template', 'mta.yaml.template');

  readFileMap.set(appJsonPath, new TextEncoder().encode(JSON.stringify({
    applications: [
      {
        name: 'SapB1.HelloB1.Sales',
        path: 'HelloB1_1.0.0/Sales/webapp'
      }
    ]
  })));
  readFileMap.set(launchJsonPath, new TextEncoder().encode(JSON.stringify({ version: '0.2.0', configurations: [] })));
  readFileMap.set(tsconfigTemplatePath, new TextEncoder().encode('{}'));
  readFileMap.set(controllerTemplatePath, new TextEncoder().encode('export default class <%= viewName %> {}'));
  readFileMap.set(utilityTemplatePath, new TextEncoder().encode('export const utility = true;'));
  readFileMap.set(modelsTemplatePath, new TextEncoder().encode('export interface Models {}'));
  readFileMap.set(i18nEnTemplatePath, new TextEncoder().encode('title=Title'));
  readFileMap.set(i18nTemplatePath, new TextEncoder().encode('title=Title'));
  readFileMap.set(layoutTemplatePath, new TextEncoder().encode('{"controller":"<%= namespace %>.controller.<%= viewName %>","guid":"<Add existing control\'s stable ID>"}'));
  readFileMap.set(mtaTemplatePath, new TextEncoder().encode(`_schema-version: 3.2.0\nID: <%= ID %>\nversion: <%= version %>\nprovider: <%= provider %>\nmodules:\n- name: <%= moduleName %>\n  type: <%= moduleType %>\n  path: <%= modulePath %>\n`));

  const moduleRef = await loadContentProviderModule();
  const provider = new moduleRef.ContentProvider();

  await assert.rejects(
    async () => provider.addModuleToExistingApp({
      appName: 'HelloB1',
      appVersion: '1.0.0',
      appProvider: 'SapB1',
      modules: [
        {
          moduleName: 'Service',
          views: [
            {
              viewName: 'ServiceCallDetail',
              baseViewCategory: 'System',
              baseViewName: 'Service Calls List',
              baseViewUUID: 'view-guid',
              table: 'OSCL',
              sampleControlUuid: 'control-guid'
            }
          ]
        }
      ]
    } as never, { fsPath: appFolder } as never),
    /mta\.yaml not found/
  );
});
