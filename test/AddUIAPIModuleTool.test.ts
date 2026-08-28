import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import * as path from 'node:path';
import test from 'node:test';

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/tools/impl/AddUIAPIModuleTool.js');

let createdModuleArgs: unknown[] = [];
let viewsMeta = [
  { name: 'Sales Order Detail', viewId: 'guid-17', table: '17' },
  { name: 'Business Partner List', viewId: 'guid-2', table: '2' }
];

class MockLanguageModelTextPart {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}

class MockLanguageModelToolResult {
  content: MockLanguageModelTextPart[];
  constructor(content: MockLanguageModelTextPart[]) {
    this.content = content;
  }
}

class MockMarkdownString {
  value: string;
  constructor(value: string) {
    this.value = value;
  }
}

const mockVscode = {
  Uri: {
    joinPath: (base: { fsPath: string }, ...parts: string[]) => ({ fsPath: path.join(base.fsPath, ...parts) })
  },
  workspace: {
    fs: {
      readFile: async (uri: { fsPath: string }) => {
        if (uri.fsPath.endsWith(path.join('skills', 'assets', 'viewsMeta.json'))) {
          return new TextEncoder().encode(JSON.stringify(viewsMeta));
        }

        if (uri.fsPath.endsWith('app.json')) {
          return new TextEncoder().encode(JSON.stringify({
            applications: [
              {
                name: 'Partner.SalesAddon.MainModule',
                path: 'SalesAddon_2.0.0/MainModule/webapp'
              }
            ]
          }));
        }

        throw new Error(`ENOENT: ${uri.fsPath}`);
      }
    }
  },
  LanguageModelTextPart: MockLanguageModelTextPart,
  LanguageModelToolResult: MockLanguageModelToolResult,
  MarkdownString: MockMarkdownString
};

const mockUtils = {
  ensureCurrentWorkspaceFolder: async () => ({ uri: { fsPath: '/workspace-root' } }),
  getCurrentExtension: () => ({ extensionUri: { fsPath: '/extension-root' } }),
  sanitizeIdentifier: (value: string) => value.replace(/\W/g, '').replace(/\s/g, '')
};

const mockContentProviderModule = {
  ContentProvider: class {
    async addModuleToExistingApp(...args: unknown[]) {
      createdModuleArgs = args;
      return 'added-module';
    }
  }
};

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'vscode') {
    return mockVscode;
  }
  if (request === '../../utils/Utils') {
    return mockUtils;
  }
  if (request === '../../content/ContentProvider') {
    return mockContentProviderModule;
  }
  return originalLoad.call(this, request, parent, isMain);
};

function resetState(): void {
  createdModuleArgs = [];
  viewsMeta = [
    { name: 'Sales Order Detail', viewId: 'guid-17', table: '17' },
    { name: 'Business Partner List', viewId: 'guid-2', table: '2' }
  ];
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/tools/impl/AddUIAPIModuleTool.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/tools/impl/AddUIAPIModuleTool.js');
}

test('AddUIAPIModule.invoke rejects duplicate module names', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.AddUIAPIModule();

  const result = await tool.invoke({
    input: {
      moduleName: 'Main Module',
      views: [
        { viewName: 'OrderDetailView', baseViewName: 'Sales Order Detail' }
      ]
    }
  } as never, {} as never);
  const value = (result as unknown as { content: Array<{ value: string }> }).content[0].value;

  assert.equal(value, "Module 'MainModule' already exists in current app.");
  assert.equal(createdModuleArgs.length, 0);
});

test('AddUIAPIModule.invoke resolves views and delegates to ContentProvider', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.AddUIAPIModule();

  const result = await tool.invoke({
    input: {
      moduleName: 'Service Module',
      views: [
        { viewName: 'ServiceOrderDetail', baseViewName: 'Sales Order Detail' }
      ]
    }
  } as never, {} as never);
  const value = (result as unknown as { content: Array<{ value: string }> }).content[0].value;

  assert.equal(value, 'added-module');
  assert.equal(createdModuleArgs.length, 2);

  const appMeta = createdModuleArgs[0] as {
    appName: string;
    appVersion: string;
    appProvider: string;
    modules: Array<{ moduleName: string; views: Array<{ viewName: string; baseViewUUID: string; table: string }> }>;
  };
  assert.equal(appMeta.appName, 'SalesAddon');
  assert.equal(appMeta.appProvider, 'Partner');
  assert.equal(appMeta.appVersion, '2.0.0');
  assert.equal(appMeta.modules.length, 1);
  assert.equal(appMeta.modules[0].moduleName, 'ServiceModule');
  assert.equal(appMeta.modules[0].views[0].viewName, 'ServiceOrderDetail');
  assert.equal(appMeta.modules[0].views[0].baseViewUUID, 'guid-17');
  assert.equal((appMeta.modules[0].views[0] as { sampleControlUuid?: string }).sampleControlUuid, 'eYw7UEkk3Qynbr4DjuHNax');

  assert.deepEqual(createdModuleArgs[1], { fsPath: '/workspace-root' });
});
