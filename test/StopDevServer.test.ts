import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import test from 'node:test';

interface MockTerminal {
  name: string;
  disposed: boolean;
  dispose: () => void;
}

interface MockStream {
  progressMessages: string[];
  markdownMessages: string[];
  progress: (message: string) => void;
  markdown: (message: string) => void;
}

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/commands/StopDevServer.js');

const terminals: MockTerminal[] = [];
let stopDebuggingCalls = 0;
let runningStates: boolean[] = [];

const mockVscode = {
  window: {
    terminals
  },
  debug: {
    stopDebugging: () => {
      stopDebuggingCalls += 1;
    }
  }
};

const mockLoggerWrapper = {
  getClassLogger: (_className: string) => ({
    info: (_message: string) => undefined,
    warn: (_message: string) => undefined,
    error: (_message: string) => undefined
  })
};

const mockUtils = {
  isDevServerRunning: async () => {
    if (runningStates.length === 0) {
      return false;
    }
    return runningStates.shift() ?? false;
  },
  getDevServerURL: () => 'http://localhost:8082',
  getDevServerPort: () => 8082,
  findProcessesUsingPort: async (_port: number) => [] as number[],
  execCommand: async (_command: string, _args: string[]) => ({ exitCode: 0, stdout: '', stderr: '' })
};

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'vscode') {
    return mockVscode;
  }
  if (request === '../utils/Utils') {
    return mockUtils;
  }
  if (request === '../logger/LoggerWrapper') {
    return mockLoggerWrapper;
  }
  return originalLoad.call(this, request, parent, isMain);
};

function resetState(): void {
  terminals.length = 0;
  stopDebuggingCalls = 0;
  runningStates = [];
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/commands/StopDevServer.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/commands/StopDevServer.js');
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

test('stopDevServer reports when server is not running', async () => {
  resetState();
  runningStates = [false];
  const moduleRef = await loadModule();
  const stream = createStream();

  const result = await moduleRef.stopDevServer(stream as never, 'custom-stop');

  assert.equal(result.metadata.command, 'custom-stop');
  assert.ok(stream.markdownMessages.some((m) => m.includes('not running')));
  assert.equal(stopDebuggingCalls, 0);
});

test('stopDevServer disposes terminal and stops gracefully when server becomes unavailable', async () => {
  resetState();
  terminals.push({
    name: 'Web Client UI API Development Server',
    disposed: false,
    dispose() {
      this.disposed = true;
    }
  });
  runningStates = [true, false];

  const moduleRef = await loadModule();
  const stream = createStream();

  const result = await moduleRef.stopDevServer(stream as never);

  assert.equal(result.metadata.command, 'webclient-uiapi-stop');
  assert.equal(terminals[0].disposed, true);
  assert.equal(stopDebuggingCalls, 1);
  assert.ok(stream.markdownMessages.some((m) => m.includes('is stopped')));
});
