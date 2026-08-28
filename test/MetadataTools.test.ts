import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import test from 'node:test';

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/tools/impl/MetadataTools.js');

const parserMock = {
  setMetadataBasePathCalls: [] as string[],
  getEntitySetList: async () => ['Orders', 'BusinessPartners'],
  getEntitySetDetails: async (entitySet: string) => ({ entitySet, kind: 'detail' }),
  getTypeDetails: async (typeName: string) => ({ typeName, kind: 'type' }),
  validateEntitySetProperties: async (_entitySet: string, properties: string[]) => properties.filter((p) => p === 'BadProp'),
  validateComplexTypeProperty: async (_complexType: string, properties: string[]) => properties.filter((p) => p === 'BadComplexProp'),
  getGlobalFunctionImportList: async () => ['CompanyService_GetCompanyInfo', 'SomeOtherFunction'],
  getFunctionImportDetails: async (functionName: string) => ({ functionName, kind: 'function' }),
  setMetadataBasePath(basePath: string) {
    this.setMetadataBasePathCalls.push(basePath);
  }
};

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

const mockUtils = {
  getCurrentExtension: () => ({ extensionUri: { fsPath: '/extension-root' } })
};

const mockServiceLayerParser = {
  ServiceLayerMetadataParser: {
    getInstance: () => parserMock
  }
};

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'vscode') {
    return mockVscode;
  }
  if (request === '../../utils/Utils') {
    return mockUtils;
  }
  if (request === '../../meta/ServiceLayerMetaParser') {
    return mockServiceLayerParser;
  }
  return originalLoad.call(this, request, parent, isMain);
};

function resetState(): void {
  parserMock.setMetadataBasePathCalls.length = 0;
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/tools/impl/MetadataTools.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/tools/impl/MetadataTools.js');
}

test('configureMetadataParserPath sets base path only once', async () => {
  resetState();
  const moduleRef = await loadModule();

  moduleRef.configureMetadataParserPath();
  moduleRef.configureMetadataParserPath();

  assert.deepEqual(parserMock.setMetadataBasePathCalls, ['/extension-root']);
});

test('GetEntitySetListTool returns one text part per entity set', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.GetEntitySetListTool();

  const result = await tool.invoke({ input: undefined } as never, {} as never);
  const values = (result as unknown as { content: Array<{ value: string }> }).content.map((part) => part.value);

  assert.deepEqual(values, ['Orders', 'BusinessPartners']);
});

test('ValidatePropertyTool returns invalid property message when parser reports invalid entries', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.ValidatePropertyTool();

  const result = await tool.invoke({ input: { entitySet: 'Orders', propertyList: 'DocEntry,BadProp' } } as never, {} as never);
  const value = (result as unknown as { content: Array<{ value: string }> }).content[0].value;

  assert.equal(value, "These properties: 'BadProp' are invalid for entity set Orders");
});

test('ValidateComplexTypePropertyTool returns all-valid message when parser reports no invalid entries', async () => {
  resetState();
  const moduleRef = await loadModule();
  const tool = new moduleRef.ValidateComplexTypePropertyTool();

  const result = await tool.invoke({ input: { complexType: 'DocumentLine', propertyList: 'ItemCode,Quantity' } } as never, {} as never);
  const value = (result as unknown as { content: Array<{ value: string }> }).content[0].value;

  assert.equal(value, 'All Properties are valid for complex type DocumentLine');
});

test('detail tools serialize parser results as json strings', async () => {
  resetState();
  const moduleRef = await loadModule();

  const entityDetail = await new moduleRef.GetEntitySetDetailTool().invoke({ input: { entitySet: 'Orders' } } as never, {} as never);
  const typeDetail = await new moduleRef.GetTypeDetailTool().invoke({ input: { typeName: 'DocumentLine' } } as never, {} as never);
  const functionDetail = await new moduleRef.GetFunctionImportDetailTool().invoke({ input: { functionName: 'CompanyService_GetCompanyInfo' } } as never, {} as never);

  assert.equal((entityDetail as unknown as { content: Array<{ value: string }> }).content[0].value, JSON.stringify({ entitySet: 'Orders', kind: 'detail' }));
  assert.equal((typeDetail as unknown as { content: Array<{ value: string }> }).content[0].value, JSON.stringify({ typeName: 'DocumentLine', kind: 'type' }));
  assert.equal((functionDetail as unknown as { content: Array<{ value: string }> }).content[0].value, JSON.stringify({ functionName: 'CompanyService_GetCompanyInfo', kind: 'function' }));
});
