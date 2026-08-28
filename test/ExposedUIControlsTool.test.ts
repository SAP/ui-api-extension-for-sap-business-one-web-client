import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import * as path from 'node:path';
import test from 'node:test';

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/tools/impl/ExposedUIControlsTool.js');

let schemaContent = {
  definitions: {
    Button: {
      title: 'UI Control: Button',
      description: 'Clickable action button'
    },
    Input: {
      title: 'UI Control: Input',
      description: 'Single line text input'
    },
    CommonModel: {
      title: 'Common: Not A Control',
      description: 'Not exposed control'
    }
  }
};

const extensionUri = { fsPath: '/extension-root' };

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
      readFile: async (_uri: { fsPath: string }) => new TextEncoder().encode(JSON.stringify(schemaContent))
    }
  },
  LanguageModelTextPart: MockLanguageModelTextPart,
  LanguageModelToolResult: MockLanguageModelToolResult
};

const mockUtils = {
  getCurrentExtension: () => ({ extensionUri })
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
  schemaContent = {
    definitions: {
      Button: {
        title: 'UI Control: Button',
        description: 'Clickable action button'
      },
      Input: {
        title: 'UI Control: Input',
        description: 'Single line text input'
      },
      CommonModel: {
        title: 'Common: Not A Control',
        description: 'Not exposed control'
      }
    }
  };
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/tools/impl/ExposedUIControlsTool.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/tools/impl/ExposedUIControlsTool.js');
}

test('GetExposedUIAPIControlsTool.invoke returns only UI Control definitions', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.GetExposedUIAPIControlsTool();

  const result = await tool.invoke({ input: {} } as never, {} as never);
  const parts = (result as unknown as { content: Array<{ value: string }> }).content;
  const payloads = parts.map((p) => JSON.parse(p.value) as { controlName: string; description: string });

  assert.equal(payloads.length, 2);
  assert.deepEqual(payloads.map((p) => p.controlName), ['Button', 'Input']);
  assert.equal(payloads[0].description, 'Clickable action button');
});
