import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import Module from 'node:module';
import test from 'node:test';

const requireForTest = createRequire(__filename);
const moduleId = requireForTest.resolve('../src/tools/ToolsRegister.js');

const registrations: Array<{ name: string; tool: unknown }> = [];
let configureCalls = 0;

function makeToolClass(label: string) {
  return class {
    readonly label = label;
  };
}

const mockVscode = {
  lm: {
    registerTool: (name: string, tool: unknown) => {
      registrations.push({ name, tool });
      return { dispose: () => undefined };
    }
  }
};

const mockCreateUIAPIApp = { CreateUIAPIApp: makeToolClass('CreateUIAPIApp') };
const mockAddUIAPIModule = { AddUIAPIModule: makeToolClass('AddUIAPIModule') };
const mockAddUIAPIView = { AddUIAPIView: makeToolClass('AddUIAPIView') };
const mockCurrentAppInfo = { GetCurrentAppInformationTool: makeToolClass('GetCurrentAppInformationTool') };
const mockExposedControls = { GetExposedUIAPIControlsTool: makeToolClass('GetExposedUIAPIControlsTool') };
const mockSchemaPath = { GetUIAPISchemaFilePathTool: makeToolClass('GetUIAPISchemaFilePathTool') };
const mockUUIDTool = { UUIDTool: makeToolClass('UUIDTool') };
const mockViewsMetaTools = {
  GetViewDetailTool: makeToolClass('GetViewDetailTool'),
  GetViewListTool: makeToolClass('GetViewListTool')
};
const mockMetadataTools = {
  configureMetadataParserPath: () => {
    configureCalls += 1;
  },
  GetEntitySetDetailTool: makeToolClass('GetEntitySetDetailTool'),
  GetEntitySetListTool: makeToolClass('GetEntitySetListTool'),
  GetFunctionImportDetailTool: makeToolClass('GetFunctionImportDetailTool'),
  GetFunctionImportListTool: makeToolClass('GetFunctionImportListTool'),
  GetTypeDetailTool: makeToolClass('GetTypeDetailTool'),
  ValidateComplexTypePropertyTool: makeToolClass('ValidateComplexTypePropertyTool'),
  ValidatePropertyTool: makeToolClass('ValidatePropertyTool')
};

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (request: string, parent: unknown, isMain: boolean) {
  if (request === 'vscode') {
    return mockVscode;
  }
  if (request === './impl/CreateUIAPIAppTool') {
    return mockCreateUIAPIApp;
  }
  if (request === './impl/AddUIAPIModuleTool') {
    return mockAddUIAPIModule;
  }
  if (request === './impl/AddUIAPIViewTool') {
    return mockAddUIAPIView;
  }
  if (request === './impl/CurrentAppInformationTool') {
    return mockCurrentAppInfo;
  }
  if (request === './impl/ExposedUIControlsTool') {
    return mockExposedControls;
  }
  if (request === './impl/MetadataTools') {
    return mockMetadataTools;
  }
  if (request === './impl/SchemaFilePathTool') {
    return mockSchemaPath;
  }
  if (request === './impl/UUIDTool') {
    return mockUUIDTool;
  }
  if (request === './impl/ViewsMetaTools') {
    return mockViewsMetaTools;
  }
  return originalLoad.call(this, request, parent, isMain);
};

function resetState(): void {
  registrations.length = 0;
  configureCalls = 0;
  delete requireForTest.cache[moduleId];
}

async function loadModule(): Promise<typeof import('../src/tools/ToolsRegister.js')> {
  delete requireForTest.cache[moduleId];
  return requireForTest(moduleId) as typeof import('../src/tools/ToolsRegister.js');
}

test('registerChatTools configures metadata parser and registers all expected tools', async () => {
  resetState();
  const moduleRef = await loadModule();
  const context = { subscriptions: [] as unknown[] };

  moduleRef.registerChatTools(context as never);

  assert.equal(configureCalls, 1);
  assert.equal(registrations.length, 16);
  assert.equal(context.subscriptions.length, 16);
  assert.deepEqual(
    registrations.map((item) => item.name),
    [
      'WebClientUIAPI_getSchemaFilePath',
      'WebClientUIAPI_generateUUID',
      'WebClientUIAPI_createApp',
      'WebClientUIAPI_addModule',
      'WebClientUIAPI_addView',
      'WebClientUIAPI_getCurrentAppInformation',
      'WebClientUIAPI_getViewList',
      'WebClientUIAPI_getViewDetail',
      'WebClientUIAPI_getEntitySetList',
      'WebClientUIAPI_getEntitySetDetail',
      'WebClientUIAPI_validateEntityProperties',
      'WebClientUIAPI_getTypeDetail',
      'WebClientUIAPI_validateComplexTypeProperties',
      'WebClientUIAPI_getUnbindFunctions',
      'WebClientUIAPI_getFunctionDetail',
      'WebClientUIAPI_getExposedUIAPIControls'
    ]
  );
});
