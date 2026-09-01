import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import * as path from 'node:path';
import test from 'node:test';

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/tools/impl/SchemaFilePathTool.js');

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
    joinPath: (base: { fsPath: string }, ...parts: string[]) => ({ fsPath: path.posix.join(base.fsPath, ...parts) })
  },
  LanguageModelTextPart: MockLanguageModelTextPart,
  LanguageModelToolResult: MockLanguageModelToolResult
};

const mockUtils = {
  ensureCurrentWorkspaceFolder: async () => ({ uri: { fsPath: '/workspace-root' } }),
  getCurrentExtension: () => ({ extensionUri: { fsPath: '/extension-root' } })
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
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/tools/impl/SchemaFilePathTool.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/tools/impl/SchemaFilePathTool.js');
}

test('GetUIAPISchemaFilePathTool.invoke returns project-local and global schema paths', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.GetUIAPISchemaFilePathTool();

  const result = await tool.invoke({ input: { schemaType: 'Dialog' } } as never, {} as never);
  const payload = (result as unknown as { content: Array<{ value: string }> }).content[0].value;
  const parsed = JSON.parse(payload) as { schemaType: string; projectLocalPath: string; globalPath: string };

  assert.equal(parsed.schemaType, 'Dialog');
  assert.equal(parsed.projectLocalPath, '/workspace-root/References/schema/dialog.schema.json');
  assert.equal(parsed.globalPath, '/extension-root/schema/dialog.schema.json');
});
