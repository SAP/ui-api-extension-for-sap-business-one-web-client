import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import * as path from 'node:path';
import test from 'node:test';

interface MockUri { fsPath: string }

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/tools/impl/CurrentAppInformationTool.js');

let readDirectoryResult: Array<[string, number]> = [];
let readDirectoryError: Error | undefined;
let statPaths = new Set<string>();
let fileContents = new Map<string, string>();
const shownErrors: string[] = [];

const workspaceFolder = { uri: { fsPath: '/workspace-root' } };

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

const mockVscode = {
  Uri: {
    joinPath: (base: MockUri, ...parts: string[]) => ({ fsPath: path.join(base.fsPath, ...parts) })
  },
  workspace: {
    fs: {
      readDirectory: async (_uri: MockUri) => {
        if (readDirectoryError) {
          throw readDirectoryError;
        }
        return readDirectoryResult;
      },
      stat: async (uri: MockUri) => {
        if (!statPaths.has(uri.fsPath)) {
          throw new Error(`ENOENT: ${uri.fsPath}`);
        }
        return {};
      },
      readFile: async (uri: MockUri) => {
        const content = fileContents.get(uri.fsPath);
        if (content === undefined) {
          throw new Error(`ENOENT: ${uri.fsPath}`);
        }
        return new TextEncoder().encode(content);
      }
    }
  },
  window: {
    showErrorMessage: (message: string) => {
      shownErrors.push(message);
      return undefined;
    },
    showInformationMessage: (message: string) => {
      shownErrors.push(message);
      return undefined;
    }
  },
  LanguageModelTextPart: MockLanguageModelTextPart,
  LanguageModelToolResult: MockLanguageModelToolResult,
  FileType: {
    Directory: 2,
    File: 1
  }
};

const mockUtils = {
  ensureCurrentWorkspaceFolder: async () => workspaceFolder
};

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'vscode') {
    return mockVscode;
  }
  if (request === '../../utils/Utils') {
    return mockUtils;
  }
  return originalLoad.call(this, request, parent, isMain);
};

function resetState(): void {
  readDirectoryResult = [];
  readDirectoryError = undefined;
  statPaths = new Set<string>();
  fileContents = new Map<string, string>();
  shownErrors.length = 0;
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/tools/impl/CurrentAppInformationTool.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/tools/impl/CurrentAppInformationTool.js');
}

test('GetCurrentAppInformationTool.invoke reports empty workspace folder', async () => {
  resetState();
  readDirectoryResult = [];
  const moduleRef = await loadModule();
  const tool = new moduleRef.GetCurrentAppInformationTool();

  const result = await tool.invoke({ input: undefined } as never, {} as never);
  const payload = (result as unknown as { content: Array<{ value: string }> }).content[0].value;

  assert.equal(payload, 'Workspace folder is empty.');
  assert.ok(shownErrors.some((message) => message.includes('is empty')));
});

test('GetCurrentAppInformationTool.invoke reports missing app.json', async () => {
  resetState();
  readDirectoryResult = [['MainModule', 2]];
  const moduleRef = await loadModule();
  const tool = new moduleRef.GetCurrentAppInformationTool();

  const result = await tool.invoke({ input: undefined } as never, {} as never);
  const payload = (result as unknown as { content: Array<{ value: string }> }).content[0].value;

  assert.equal(payload, 'app.json file not found in workspace.');
  assert.ok(shownErrors.some((message) => message.includes('app.json file not found')));
});

test('GetCurrentAppInformationTool.invoke returns parsed app, module, dialog, and view metadata', async () => {
  resetState();
  readDirectoryResult = [['MainModule', 2], ['app.json', 1]];

  const appJsonPath = '/workspace-root/app.json';
  const manifestPath = '/workspace-root/MainModule/src/manifest.json';
  const viewLayoutPath = '/workspace-root/MainModule/src/layout/OrderDetailView.layout.json';
  const dialogLayoutPath = '/workspace-root/MainModule/src/dialog/EditDialog.dialog.json';

  statPaths.add(appJsonPath);

  fileContents.set(appJsonPath, JSON.stringify({
    applications: [
      {
        name: 'Partner.SalesAddon.MainModule',
        path: 'SalesAddon_1.0.0/MainModule/webapp'
      }
    ]
  }));

  fileContents.set(manifestPath, JSON.stringify({
    'b1.bundles': [
      {
        id: 'OrderDetailView.layout',
        baseViewGuid: 'base-guid',
        layout: 'layout/OrderDetailView.layout.json'
      },
      {
        id: 'EditDialog.dialog',
        view: 'dialog/EditDialog.dialog.json'
      }
    ]
  }));

  fileContents.set(viewLayoutPath, JSON.stringify({
    controller: 'Partner.SalesAddon.MainModule.controller.OrderDetailView'
  }));

  fileContents.set(dialogLayoutPath, JSON.stringify({
    controller: 'Partner.SalesAddon.MainModule.controller.EditDialog'
  }));

  const moduleRef = await loadModule();
  const tool = new moduleRef.GetCurrentAppInformationTool();

  const result = await tool.invoke({ input: undefined } as never, {} as never);
  const payload = (result as unknown as { content: Array<{ value: string }> }).content[0].value;
  const parsed = JSON.parse(payload) as {
    appProvider: string;
    appName: string;
    modules: string[];
    moduleDetails: Array<{
      name: string;
      moduleFolder: string;
      dialogs: Array<{ name: string; layoutFile: string; controllerFile: string }>;
      views: Array<{ name: string; layoutFile: string; baseViewId: string; controllerFile: string }>;
    }>;
  };

  assert.equal(parsed.appProvider, 'Partner');
  assert.equal(parsed.appName, 'SalesAddon');
  assert.deepEqual(parsed.modules, ['MainModule']);
  assert.equal(parsed.moduleDetails.length, 1);
  assert.equal(parsed.moduleDetails[0].views[0].name, 'OrderDetailView');
  assert.equal(parsed.moduleDetails[0].views[0].layoutFile, 'MainModule/src/layout/OrderDetailView.layout.json');
  assert.equal(parsed.moduleDetails[0].views[0].baseViewId, 'base-guid');
  assert.equal(parsed.moduleDetails[0].views[0].controllerFile, 'MainModule/src/controller/OrderDetailView.ts');
  assert.equal(parsed.moduleDetails[0].dialogs[0].name, 'EditDialog');
  assert.equal(parsed.moduleDetails[0].dialogs[0].layoutFile, 'MainModule/src/dialog/EditDialog.dialog.json');
  assert.equal(parsed.moduleDetails[0].dialogs[0].controllerFile, 'MainModule/src/controller/EditDialog.ts');
});
