import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import * as path from 'node:path';
import test from 'node:test';

interface MockUri { fsPath: string }
interface MockWorkspaceFolder { uri: MockUri }

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/prompt/AgentInstructions.js');

const existingPaths = new Set<string>();
let readFileCallCount = 0;
let readFileError: Error | undefined;
let readFileBytes = new TextEncoder().encode('default template');

const loggedInfo: string[] = [];
const loggedWarn: string[] = [];

const extensionUri: MockUri = { fsPath: path.join(path.sep, 'extension-root') };
const workspaceFolder: MockWorkspaceFolder = { uri: { fsPath: path.join(path.sep, 'workspace-root') } };

const mockVscode = {
  workspace: {
    workspaceFolders: [workspaceFolder] as MockWorkspaceFolder[] | undefined,
    fs: {
      stat: async (uri: MockUri) => {
        if (existingPaths.has(uri.fsPath)) {
          return {};
        }
        throw new Error(`ENOENT: ${uri.fsPath}`);
      },
      readFile: async (_uri: MockUri) => {
        readFileCallCount += 1;
        if (readFileError) {
          throw readFileError;
        }
        return readFileBytes;
      }
    }
  },
  Uri: {
    joinPath: (base: MockUri, ...parts: string[]) => ({ fsPath: path.join(base.fsPath, ...parts) })
  }
};

const mockLoggerWrapper = {
  getClassLogger: (_className: string) => ({
    info: (message: string) => {
      loggedInfo.push(message);
    },
    warn: (message: string) => {
      loggedWarn.push(message);
    }
  })
};

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'vscode') {
    return mockVscode;
  }
  if (request === '../logger/LoggerWrapper') {
    return mockLoggerWrapper;
  }
  return originalLoad.call(this, request, parent, isMain);
};

const context = {
  extensionUri
};

function resetState(): void {
  existingPaths.clear();
  readFileCallCount = 0;
  readFileError = undefined;
  readFileBytes = new TextEncoder().encode('default template');
  loggedInfo.length = 0;
  loggedWarn.length = 0;
  mockVscode.workspace.workspaceFolders = [workspaceFolder];
  delete requireForTest.cache[moduleId];
}

async function loadAgentInstructionsModule(): Promise<typeof import('../src/prompt/AgentInstructions.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/prompt/AgentInstructions.js');
}

test('loadInstructions returns empty string when workspace instruction file exists', async () => {
  resetState();
  existingPaths.add(path.join(workspaceFolder.uri.fsPath, 'AGENTS.md'));

  const moduleRef = await loadAgentInstructionsModule();
  const result = await moduleRef.loadInstructions(context as never);

  assert.equal(result, '');
  assert.equal(readFileCallCount, 0, 'template should not be read when workspace instructions exist');
  assert.ok(loggedInfo.some((message) => message.includes('Workspace-level instructions file detected')));
});

test('loadInstructions loads and trims AGENTS.md.template when no workspace instructions exist', async () => {
  resetState();
  readFileBytes = new TextEncoder().encode('   template body with spaces   \n');

  const moduleRef = await loadAgentInstructionsModule();
  const result = await moduleRef.loadInstructions(context as never);

  assert.equal(result, 'template body with spaces');
  assert.equal(readFileCallCount, 1);
  assert.ok(loggedInfo.some((message) => message.includes('Loaded AGENTS.md.template')));
});

test('loadInstructions returns fallback instructions when template loading fails', async () => {
  resetState();
  readFileError = new Error('read failed');

  const moduleRef = await loadAgentInstructionsModule();
  const result = await moduleRef.loadInstructions(context as never);

  assert.equal(
    result,
    'You are an assistant specializing in SAP Business One Web Client UI API development. Use available tools to complete tasks accurately.'
  );
  assert.equal(readFileCallCount, 1);
  assert.ok(loggedWarn.some((message) => message.includes('Failed to load AGENTS.md.template')));
});

test('loadInstructions caches template content after first successful load', async () => {
  resetState();
  readFileBytes = new TextEncoder().encode('cached template body');

  const moduleRef = await loadAgentInstructionsModule();
  const first = await moduleRef.loadInstructions(context as never);
  const second = await moduleRef.loadInstructions(context as never);

  assert.equal(first, 'cached template body');
  assert.equal(second, 'cached template body');
  assert.equal(readFileCallCount, 1, 'template should only be read once due to cache');
});
