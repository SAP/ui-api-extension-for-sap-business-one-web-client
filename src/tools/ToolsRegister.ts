import * as vscode from "vscode";
import { AddUIAPIModule } from "./impl/AddUIAPIModuleTool";
import { AddUIAPIView } from "./impl/AddUIAPIViewTool";
import { CreateUIAPIApp } from "./impl/CreateUIAPIAppTool";
import { GetCurrentAppInformationTool } from "./impl/CurrentAppInformationTool";
import { GetExposedUIAPIControlsTool } from "./impl/ExposedUIControlsTool";
import {
  configureMetadataParserPath,
  GetEntitySetDetailTool,
  GetEntitySetListTool,
  GetFunctionImportDetailTool,
  GetFunctionImportListTool,
  GetTypeDetailTool,
  ValidateComplexTypePropertyTool,
  ValidatePropertyTool,
} from "./impl/MetadataTools";
import { GetUIAPISchemaFilePathTool } from "./impl/SchemaFilePathTool";
import { UUIDTool } from "./impl/UUIDTool";
import { GetViewDetailTool, GetViewListTool } from "./impl/ViewsMetaTools";

export function registerChatTools(context: vscode.ExtensionContext) {
  configureMetadataParserPath();

  const toolsToRegister: Array<[string, vscode.LanguageModelTool<unknown>]> = [
    ["WebClientUIAPI_getSchemaFilePath", new GetUIAPISchemaFilePathTool()],
    ["WebClientUIAPI_generateUUID", new UUIDTool()],
    ["WebClientUIAPI_createApp", new CreateUIAPIApp()],
    ["WebClientUIAPI_addModule", new AddUIAPIModule()],
    ["WebClientUIAPI_addView", new AddUIAPIView()],
    ["WebClientUIAPI_getCurrentAppInformation", new GetCurrentAppInformationTool()],
    ["WebClientUIAPI_getViewList", new GetViewListTool()],
    ["WebClientUIAPI_getViewDetail", new GetViewDetailTool()],
    ["WebClientUIAPI_getEntitySetList", new GetEntitySetListTool()],
    ["WebClientUIAPI_getEntitySetDetail", new GetEntitySetDetailTool()],
    ["WebClientUIAPI_validateEntityProperties", new ValidatePropertyTool()],
    ["WebClientUIAPI_getTypeDetail", new GetTypeDetailTool()],
    ["WebClientUIAPI_validateComplexTypeProperties", new ValidateComplexTypePropertyTool()],
    ["WebClientUIAPI_getUnbindFunctions", new GetFunctionImportListTool()],
    ["WebClientUIAPI_getFunctionDetail", new GetFunctionImportDetailTool()],
    ["WebClientUIAPI_getExposedUIAPIControls", new GetExposedUIAPIControlsTool()],
  ];

  for (const [toolName, tool] of toolsToRegister) {
    context.subscriptions.push(vscode.lm.registerTool(toolName, tool));
  }
}
