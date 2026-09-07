import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import path from 'node:path';
import test from 'node:test';

interface MockTerminal {
  name: string;
  disposed: boolean;
  shown: boolean;
  sentText: string[];
  dispose: () => void;
  show: () => void;
  sendText: (text: string, addNewLine?: boolean) => void;
}

interface MockStream {
  progressMessages: string[];
  markdownMessages: string[];
  progress: (message: string) => void;
  markdown: (message: string) => void;
}

const requireForTest = createRequire(path.join(process.cwd(), 'dist-test/test/StartDevServer.test.js'));
const moduleId = requireForTest.resolve('../src/commands/StartDevServer.js');

let isServerRunning = false;
let isServerRunningSequence: boolean[] = [];
let npmInstallNeeded = false;
let waitForShellError: Error | undefined;
let createTerminalError: Error | undefined;
let installCommandOutput = '';
let executeCommandError: Error | undefined;
let warningMessages: string[] = [];

const terminals: MockTerminal[] = [];

function makeTerminal(name: string): MockTerminal {
  return {
    name,
    disposed: false,
    shown: false,
    sentText: [],
    dispose() {
      this.disposed = true;
    },
    show() {
      this.shown = true;
    },
    sendText(text: string) {
      this.sentText.push(text);
    }
  };
}

const mockVscode = {
  window: {
    terminals,
    createTerminal: (name: string) => {
      if (createTerminalError) {
        throw createTerminalError;
      }
      const terminal = makeTerminal(name);
      terminals.push(terminal);
      return terminal;
    },
    showWarningMessage: async (message: string) => {
      warningMessages.push(message);
      return undefined;
    }
  },
  debug: {
    stopDebugging: () => { return; }
  }
};

const mockLoggerWrapper = {
  getClassLogger: (_className: string) => ({
    info: (_message: string) => undefined,
    error: (_message: string) => undefined
  })
};

const mockUtils = {
  isDevServerRunning: async () => {
    if (isServerRunningSequence.length > 0) {
      return isServerRunningSequence.shift() as boolean;
    }
    return isServerRunning;
  },
  getDevServerURL: () => 'http://localhost:8082',
  waitForShellIntegration: async (_terminal: MockTerminal) => {
    if (waitForShellError) {
      throw waitForShellError;
    }
  },
  isNpmInstallNeeded: async () => npmInstallNeeded,
  executeTerminalCommand: async (_terminal: MockTerminal, command: string) => {
    if (executeCommandError) {
      throw executeCommandError;
    }
    if (command === 'npm install') {
      return installCommandOutput;
    }
    return '';
  }
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
  isServerRunning = false;
  isServerRunningSequence = [];
  npmInstallNeeded = false;
  waitForShellError = undefined;
  createTerminalError = undefined;
  installCommandOutput = '';
  executeCommandError = undefined;
  warningMessages = [];
  terminals.length = 0;
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/commands/StartDevServer.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/commands/StartDevServer.js');
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

test('startDevServer reports already-running server and exits early', async () => {
  resetState();
  isServerRunning = true;
  const moduleRef = await loadModule();
  const stream = createStream();

  const result = await moduleRef.startDevServer(stream as never, 'custom-start');

  assert.equal(result.metadata.command, 'custom-start');
  assert.equal(result.metadata.status, undefined);
  assert.ok(stream.markdownMessages.some((m) => m.includes('already running')));
});

test('startDevServer returns failed status when terminal creation throws', async () => {
  resetState();
  createTerminalError = new Error('cannot create terminal');
  const moduleRef = await loadModule();
  const stream = createStream();

  const result = await moduleRef.startDevServer(stream as never);

  assert.equal(result.metadata.status, 'failed');
  assert.ok(warningMessages.some((m) => m.includes('Failed to prepare development server terminal.')));
});

test('startDevServer returns no status when waitForShellIntegration throws', async () => {
  resetState();
  waitForShellError = new Error('shell integration timeout');
  const moduleRef = await loadModule();
  const stream = createStream();

  const result = await moduleRef.startDevServer(stream as never);

  assert.equal(result.metadata.status, undefined);
  assert.ok(warningMessages.some((m) => m.includes('Failed to prepare development server terminal.')));
});

test('startDevServer fails when executeTerminalCommand throws during npm install', async () => {
  resetState();
  npmInstallNeeded = true;
  executeCommandError = new Error('shell command failed');
  const moduleRef = await loadModule();
  const stream = createStream();

  const result = await moduleRef.startDevServer(stream as never);

  assert.equal(result.metadata.status, 'failed');
  assert.ok(stream.markdownMessages.some((m) => m.includes('Dependency installation failed') && m.includes('shell command failed')));
});

test('startDevServer fails when npm install output contains npm ERR', async () => {
  resetState();
  npmInstallNeeded = true;
  installCommandOutput = 'npm ERR! install failed';
  const moduleRef = await loadModule();
  const stream = createStream();

  const result = await moduleRef.startDevServer(stream as never);

  assert.equal(result.metadata.status, 'failed');
  assert.ok(stream.markdownMessages.some((m) => m.includes('Dependency installation failed')));
});

test('startDevServer returns success when npm start output is ready and server responds', async () => {
  resetState();
  isServerRunningSequence = [false, true];
  const moduleRef = await loadModule();
  const stream = createStream();

  const result = await moduleRef.startDevServer(stream as never);

  assert.equal(result.metadata.status, 'success');
  assert.ok(stream.markdownMessages.some((m) => m.includes('Development server started.')));
  assert.ok(terminals.some((terminal) => terminal.shown), 'terminal should be shown before command execution');
  assert.ok(terminals.some((terminal) => terminal.sentText.includes('npm start')), 'npm start should be sent to the terminal without waiting for exit');
});
