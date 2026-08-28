import assert from 'node:assert/strict';
import Module from 'node:module';
import * as path from 'node:path';
import test from 'node:test';

interface MockUri { fsPath: string }
interface MockWorkspaceFolder { uri: MockUri }

const configValues = new Map<string, unknown>();
const statEntries = new Map<string, { mtime: number }>();

const workspaceFolderPath = path.join(path.sep, 'workspace-utils-test');
const workspaceFolder: MockWorkspaceFolder = { uri: { fsPath: workspaceFolderPath } };

const mockVscode = {
  env: {
    sessionId: 'session-id-for-tests'
  },
  authentication: {
    getAccounts: async () => [] as Array<{ id: string; label: string }>
  },
  workspace: {
    workspaceFolders: [workspaceFolder] as MockWorkspaceFolder[] | undefined,
    getConfiguration: (_section?: string) => ({
      get: (key: string, defaultValue?: unknown) => {
        if (configValues.has(key)) {
          return configValues.get(key);
        }
        return defaultValue;
      }
    }),
    fs: {
      stat: async (uri: MockUri) => {
        const entry = statEntries.get(uri.fsPath);
        if (!entry) {
          throw new Error(`ENOENT: ${uri.fsPath}`);
        }
        return entry;
      }
    }
  },
  window: {
    showErrorMessage: (_message: string) => undefined,
    showWarningMessage: async () => 'Cancel',
    showOpenDialog: async () => undefined,
    onDidChangeTerminalShellIntegration: () => ({ dispose: () => undefined })
  },
  commands: {
    executeCommand: async () => undefined
  },
  extensions: {
    getExtension: (_id: string) => ({ id: 'extension-id' })
  },
  Uri: {
    joinPath: (base: MockUri, ...parts: string[]) => ({ fsPath: path.join(base.fsPath, ...parts) })
  }
};

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'vscode') {
    return mockVscode;
  }
  return originalLoad.call(this, request, parent, isMain);
};

async function getUtils(): Promise<typeof import('../src/utils/Utils.js')> {
  return import('../src/utils/Utils.js');
}

function setMtime(filePath: string, mtime: number): void {
  statEntries.set(filePath, { mtime });
}

function resetState(): void {
  configValues.clear();
  statEntries.clear();
  mockVscode.workspace.workspaceFolders = [workspaceFolder];
}

test('getDevServerURL and getDevServerPort use configured port', async () => {
  resetState();
  configValues.set('devServer.port', 9090);

  const utils = await getUtils();

  assert.equal(utils.getDevServerURL(), 'http://localhost:9090');
  assert.equal(utils.getDevServerPort(), 9090);
});

test('getDevServerPort falls back to default port when unset', async () => {
  resetState();

  const utils = await getUtils();

  assert.equal(utils.getDevServerPort(), 8082);
});

test('genViewURLWithDebugServer preserves existing params and sets debug params', async () => {
  resetState();

  const utils = await getUtils();
  const result = utils.genViewURLWithDebugServer(
    'https://example.com/webx/index.html?foo=bar&enable-extension-debug=false',
    'http://localhost:9123'
  );

  const url = new URL(result);
  assert.equal(url.origin, 'https://example.com');
  assert.equal(url.pathname, '/webx/index.html');
  assert.equal(url.searchParams.get('foo'), 'bar');
  assert.equal(url.searchParams.get('enable-extension-debug'), 'true');
  assert.equal(url.searchParams.get('extension-debug-server'), 'http://localhost:9123');
});

test('isNpmInstallNeeded returns false without workspace folder', async () => {
  resetState();
  mockVscode.workspace.workspaceFolders = undefined;

  const utils = await getUtils();

  assert.equal(await utils.isNpmInstallNeeded(), false);
});

test('isNpmInstallNeeded returns false when package.json is missing', async () => {
  resetState();

  const utils = await getUtils();

  assert.equal(await utils.isNpmInstallNeeded(), false);
});

test('isNpmInstallNeeded returns true when node_modules is missing', async () => {
  resetState();
  setMtime(path.join(workspaceFolderPath, 'package.json'), 1000);

  const utils = await getUtils();

  assert.equal(await utils.isNpmInstallNeeded(), true);
});

test('isNpmInstallNeeded compares package files with node_modules mtime', async () => {
  resetState();
  const packageJsonPath = path.join(workspaceFolderPath, 'package.json');
  const packageLockPath = path.join(workspaceFolderPath, 'package-lock.json');
  const nodeModulesPath = path.join(workspaceFolderPath, 'node_modules');
  setMtime(packageJsonPath, 1000);
  setMtime(nodeModulesPath, 2000);

  const utils = await getUtils();

  assert.equal(await utils.isNpmInstallNeeded(), false, 'node_modules newer than package.json should not require install');

  setMtime(packageJsonPath, 3000);
  assert.equal(await utils.isNpmInstallNeeded(), true, 'newer package.json should require install');

  setMtime(packageJsonPath, 1000);
  setMtime(packageLockPath, 4000);
  assert.equal(await utils.isNpmInstallNeeded(), true, 'newer package-lock.json should require install');
});
