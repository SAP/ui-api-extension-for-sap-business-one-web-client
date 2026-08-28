import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import * as path from 'node:path';
import test from 'node:test';

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/tools/impl/ViewsMetaTools.js');

let viewsMetaContent = [
  {
    name: 'Sales Order Detail',
    viewId: '2Jx8aiyfYXojYjGBy5rr8X',
    table: 'ORDR'
  },
  {
    name: 'Business Partners List',
    viewId: 'qm82JkXipzvgT16TczA45D',
    table: 'OCRD'
  }
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

const mockVscode = {
  Uri: {
    joinPath: (base: { fsPath: string }, ...parts: string[]) => ({ fsPath: path.join(base.fsPath, ...parts) })
  },
  workspace: {
    fs: {
      readFile: async (_uri: { fsPath: string }) => new TextEncoder().encode(JSON.stringify(viewsMetaContent))
    }
  },
  LanguageModelTextPart: MockLanguageModelTextPart,
  LanguageModelToolResult: MockLanguageModelToolResult
};

const mockUtils = {
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
  viewsMetaContent = [
    {
      name: 'Sales Order Detail',
      viewId: '2Jx8aiyfYXojYjGBy5rr8X',
      table: 'ORDR'
    },
    {
      name: 'Business Partners List',
      viewId: 'qm82JkXipzvgT16TczA45D',
      table: 'OCRD'
    }
  ];
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/tools/impl/ViewsMetaTools.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/tools/impl/ViewsMetaTools.js');
}

test('GetViewListTool.invoke returns only view names', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.GetViewListTool();

  const result = await tool.invoke({ input: undefined } as never, {} as never);
  const values = (result as unknown as { content: Array<{ value: string }> }).content.map((part) => part.value);

  assert.deepEqual(values, ['Sales Order Detail', 'Business Partners List']);
});

test('GetViewDetailTool.invoke returns detail JSON for exact view name', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.GetViewDetailTool();

  const result = await tool.invoke({ input: { viewName: 'Sales Order Detail' } } as never, {} as never);
  const value = (result as unknown as { content: Array<{ value: string }> }).content[0].value;
  const parsed = JSON.parse(value) as { name: string; viewId: string; table: string; viewType?: string; sampleControlUuid?: string };

  assert.equal(parsed.name, 'Sales Order Detail');
  assert.equal(parsed.viewId, '2Jx8aiyfYXojYjGBy5rr8X');
  assert.equal(parsed.table, 'ORDR');
  assert.equal(parsed.viewType, 'Detail');
  assert.equal(parsed.sampleControlUuid, 'eYw7UEkk3Qynbr4DjuHNax');
});

test('GetViewDetailTool.invoke returns not-found message for unknown view', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.GetViewDetailTool();

  const result = await tool.invoke({ input: { viewName: 'Unknown View' } } as never, {} as never);
  const value = (result as unknown as { content: Array<{ value: string }> }).content[0].value;

  assert.equal(value, "View 'Unknown View' not found.");
});
