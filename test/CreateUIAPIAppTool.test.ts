import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import * as path from 'node:path';
import test from 'node:test';

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/tools/impl/CreateUIAPIAppTool.js');

const warningMessages: string[] = [];
let createdAppArgs: unknown[] = [];
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
      readFile: async (_uri: { fsPath: string }) => new TextEncoder().encode(JSON.stringify(viewsMeta))
    }
  },
  window: {
    showWarningMessage: async (message: string) => {
      warningMessages.push(message);
      return undefined;
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
    async createApp(...args: unknown[]) {
      createdAppArgs = args;
      return 'created-app';
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
  warningMessages.length = 0;
  createdAppArgs = [];
  viewsMeta = [
    { name: 'Sales Order Detail', viewId: 'guid-17', table: '17' },
    { name: 'Business Partner List', viewId: 'guid-2', table: '2' }
  ];
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/tools/impl/CreateUIAPIAppTool.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/tools/impl/CreateUIAPIAppTool.js');
}

test('CreateUIAPIApp.invoke reports invalid base view names', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.CreateUIAPIApp();

  const result = await tool.invoke({
    input: {
      appName: 'Sales Addon',
      appProvider: 'Partner',
      modules: [
        { moduleName: 'Main Module', views: [{ viewName: 'OrderDetailView', baseViewName: 'Unknown View' }] }
      ]
    }
  } as never, {} as never);
  const value = (result as unknown as { content: Array<{ value: string }> }).content[0].value;

  assert.ok(value.includes("Invalid base view names: 'Unknown View'"));
  assert.equal(createdAppArgs.length, 0);
  assert.equal(warningMessages.length, 1);
});

test('CreateUIAPIApp.invoke rejects reserved appProvider sap', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.CreateUIAPIApp();

  const result = await tool.invoke({
    input: {
      appName: 'Sales Addon',
      appProvider: 'SaP',
      modules: [
        {
          moduleName: 'Main Module',
          views: [
            { viewName: 'OrderDetailView', baseViewName: 'Sales Order Detail' }
          ]
        }
      ]
    }
  } as never, {} as never);
  const value = (result as unknown as { content: Array<{ value: string }> }).content[0].value;

  assert.equal(value, "Invalid appProvider. 'sap' is reserved and cannot be used.");
  assert.equal(createdAppArgs.length, 0);
});

test('CreateUIAPIApp.invoke sanitizes names, resolves base views, and delegates to ContentProvider', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.CreateUIAPIApp();

  const result = await tool.invoke({
    input: {
      appName: 'Sales Addon',
      appVersion: '2.0.0',
      appProvider: 'Partner Inc.',
      modules: [
        {
          moduleName: 'Main Module',
          views: [
            { viewName: 'Order Detail View', baseViewName: 'Sales Order Detail' },
            { viewName: 'BP List View', baseViewName: 'Business Partner List', baseViewCategory: 'System' }
          ]
        }
      ]
    }
  } as never, {} as never);
  const value = (result as unknown as { content: Array<{ value: string }> }).content[0].value;

  assert.equal(value, 'created-app');
  assert.equal(createdAppArgs.length, 2);
  assert.deepEqual(createdAppArgs[1], { fsPath: '/workspace-root' });

  const appMeta = createdAppArgs[0] as {
    appName: string;
    appVersion: string;
    appProvider: string;
    modules: Array<{ moduleName: string; views: Array<{ viewName: string; baseViewUUID: string; table: string; sampleControlUuid: string }> }>;
  };
  assert.equal(appMeta.appName, 'SalesAddon');
  assert.equal(appMeta.appProvider, 'PartnerInc');
  assert.equal(appMeta.appVersion, '2.0.0');
  assert.equal(appMeta.modules[0].moduleName, 'MainModule');
  assert.equal(appMeta.modules[0].views[0].viewName, 'OrderDetailView');
  assert.equal(appMeta.modules[0].views[0].baseViewUUID, 'guid-17');
  assert.equal(appMeta.modules[0].views[0].sampleControlUuid, 'eYw7UEkk3Qynbr4DjuHNax');
  assert.equal(appMeta.modules[0].views[1].table, '2');
  assert.equal(appMeta.modules[0].views[1].sampleControlUuid, 'eYw7UEkk3Qynbr4DjuHNax');
});

test('CreateUIAPIApp.prepareInvocation defaults version and returns confirmation text', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.CreateUIAPIApp();
  const input: {
    appName: string;
    appProvider: string;
    appVersion?: string;
    modules: Array<{ moduleName: string; views: never[] }>;
  } = {
    appName: 'Sales Addon',
    appProvider: 'Partner',
    modules: [{ moduleName: 'Main Module', views: [] }]
  };

  const prepared = await tool.prepareInvocation({ input } as never, {} as never);

  assert.equal(input.appVersion, '1.0.0');
  assert.equal(prepared.invocationMessage, `'Create Web Client UI API Application' "Sales Addon"`);
  assert.equal(prepared.confirmationMessages.title, 'Create Web Client UIAPI Application');
  assert.ok((prepared.confirmationMessages.message as unknown as { value: string }).value.includes('version "1.0.0"'));
});
