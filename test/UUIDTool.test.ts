import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import test from 'node:test';

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/tools/impl/UUIDTool.js');

const generated: string[] = [];
let uuidCounter = 0;

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
  LanguageModelTextPart: MockLanguageModelTextPart,
  LanguageModelToolResult: MockLanguageModelToolResult
};

const mockUuid = {
  v4: () => {
    uuidCounter += 1;
    return `uuid-${uuidCounter}`;
  }
};

const mockShortUuid = {
  createTranslator: () => ({
    fromUUID: (value: string) => {
      generated.push(value);
      return `short-${value}`;
    }
  })
};

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'vscode') {
    return mockVscode;
  }
  if (request === 'uuid') {
    return mockUuid;
  }
  if (request === 'short-uuid') {
    return mockShortUuid;
  }
  return originalLoad.call(this, request, parent, isMain);
};

function resetState(): void {
  generated.length = 0;
  uuidCounter = 0;
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/tools/impl/UUIDTool.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/tools/impl/UUIDTool.js');
}

test('UUIDTool.invoke returns one uuid by default', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.UUIDTool();

  const result = await tool.invoke({ input: {} } as never, {} as never);
  const payload = (result as unknown as { content: Array<{ value: string }> }).content[0].value;

  assert.equal(payload, 'short-uuid-1');
  assert.deepEqual(generated, ['uuid-1']);
});

test('UUIDTool.invoke returns comma-separated uuids for custom count', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.UUIDTool();

  const result = await tool.invoke({ input: { uuidCount: 3 } } as never, {} as never);
  const payload = (result as unknown as { content: Array<{ value: string }> }).content[0].value;

  assert.equal(payload, 'short-uuid-1,short-uuid-2,short-uuid-3');
  assert.deepEqual(generated, ['uuid-1', 'uuid-2', 'uuid-3']);
});
