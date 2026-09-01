import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import * as path from 'node:path';
import test from 'node:test';

interface MockUri { fsPath: string; path: string }

interface MockStream {
  progressMessages: string[];
  markdownMessages: string[];
  progress: (message: string) => void;
  markdown: (message: string) => void;
}

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/commands/PreviewApplication.js');

let runningStates: boolean[] = [];
let startDevServerCalls = 0;
let warningMessages: string[] = [];
let errorMessages: string[] = [];
let debugCalls: Array<{ folderFsPath: string; name: string }> = [];
let launchJsonObject: unknown = { configurations: [] };

const workspaceUri = { fsPath: '/workspace-root', path: '/workspace-root' };

let webClientUrl: string | undefined = 'https://server:50000/webx/index.html';

const mockVscode = {
  workspace: {
    workspaceFolders: [{ uri: workspaceUri }],
    getConfiguration: () => ({
      get: (_key: string) => webClientUrl
    }),
    fs: {
      readFile: async (_uri: MockUri) => new TextEncoder().encode(JSON.stringify(launchJsonObject))
    }
  },
  window: {
    activeTextEditor: undefined as unknown,
    showWarningMessage: async (message: string) => {
      warningMessages.push(message);
      return undefined;
    },
    showErrorMessage: (message: string) => {
      errorMessages.push(message);
      return undefined;
    }
  },
  debug: {
    startDebugging: async (folder: { uri: { fsPath: string } }, name: string) => {
      debugCalls.push({ folderFsPath: folder.uri.fsPath, name });
      return true;
    }
  },
  Uri: {
    joinPath: (base: { fsPath: string; path?: string }, ...parts: string[]) => {
      const fsPath = path.posix.join(base.fsPath, ...parts);
      return { fsPath, path: fsPath };
    }
  }
};

const mockUtils = {
  isDevServerRunning: async () => {
    if (runningStates.length === 0) {
      return true;
    }
    return runningStates.shift() ?? true;
  },
  getDevServerURL: () => 'http://localhost:8082'
};

const mockStartDevServer = {
  startDevServer: async (_stream: unknown, _startCommand: string) => {
    startDevServerCalls += 1;
    return { metadata: { command: 'webclient-uiapi-start' } };
  }
};

const mockLoggerWrapper = {
  getClassLogger: (_className: string) => ({
    info: (_message: string) => undefined,
    error: (_message: string) => undefined
  })
};

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'vscode') {
    return mockVscode;
  }
  if (request === '../utils/Utils') {
    return mockUtils;
  }
  if (request === './StartDevServer') {
    return mockStartDevServer;
  }
  if (request === '../logger/LoggerWrapper') {
    return mockLoggerWrapper;
  }
  return originalLoad.call(this, request, parent, isMain);
};

function resetState(): void {
  runningStates = [];
  startDevServerCalls = 0;
  warningMessages = [];
  errorMessages = [];
  debugCalls = [];
  launchJsonObject = { configurations: [] };
  webClientUrl = 'https://server:50000/webx/index.html';
  mockVscode.window.activeTextEditor = undefined;
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/commands/PreviewApplication.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/commands/PreviewApplication.js');
}

function createStream(): MockStream {
  return {
    progressMessages: [],
    markdownMessages: [],
    progress(message: string) {
      this.progressMessages.push(message);
    },
    markdown(message: string) {
      this.markdownMessages.push(message);
    }
  };
}

test('previewApplication fails when server cannot be started', async () => {
  resetState();
  runningStates = [false, false];
  const moduleRef = await loadModule();
  const stream = createStream();

  const result = await moduleRef.previewApplication(stream as never, 'webclient-uiapi-preview');

  assert.equal(startDevServerCalls, 1);
  assert.equal(result.metadata.status, 'failed');
  assert.ok(warningMessages.some((m) => m.includes('could not be started')));
});

test('previewApplication fails when launch.json has no configurations', async () => {
  resetState();
  runningStates = [true];
  launchJsonObject = { configurations: [] };
  const moduleRef = await loadModule();
  const stream = createStream();

  const result = await moduleRef.previewApplication(stream as never, 'webclient-uiapi-preview');

  assert.equal(result.metadata.status, 'failed');
  assert.ok(stream.markdownMessages.some((m) => m.includes('not properly configured')));
});

test('previewApplication selects layout-matched configuration and starts debugging', async () => {
  resetState();
  runningStates = [true];
  launchJsonObject = {
    configurations: [
      { name: 'WebClient Preview - SalesModule | OrderDetailView', url: 'http://localhost:8082/#a' },
      { name: 'WebClient Preview - Fallback | Homepage', url: 'http://localhost:8082/#b' }
    ]
  };
  mockVscode.window.activeTextEditor = {
    document: {
      uri: {
        fsPath: '/workspace-root/SalesAddon/SalesModule/src/layout/OrderDetailView.layout.json',
        path: '/workspace-root/SalesAddon/SalesModule/src/layout/OrderDetailView.layout.json'
      }
    }
  };

  const moduleRef = await loadModule();
  const stream = createStream();
  const result = await moduleRef.previewApplication(stream as never, 'webclient-uiapi-preview');

  assert.equal(result.metadata.status, undefined);
  assert.equal(debugCalls.length, 1);
  assert.equal(debugCalls[0].folderFsPath, '/workspace-root');
  assert.equal(debugCalls[0].name, 'WebClient Preview - SalesModule | OrderDetailView');
});
