import * as vscode from "vscode";
import { getCurrentExtension } from "../../utils/Utils";
import { ServiceLayerMetadataParser } from "../../meta/ServiceLayerMetaParser";

let isMetadataParserConfigured = false;

export function configureMetadataParserPath(): void {
  if (isMetadataParserConfigured) {
    return;
  }

  const extension = getCurrentExtension();
  ServiceLayerMetadataParser.getInstance().setMetadataBasePath(extension.extensionUri.fsPath);
  isMetadataParserConfigured = true;
}

interface IGetEntitySetListParameter {
  page?: number;
  pageSize?: number;
}

export class GetEntitySetListTool
  implements vscode.LanguageModelTool<IGetEntitySetListParameter> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IGetEntitySetListParameter>,
    _token: vscode.CancellationToken
  ) {
    const pageSize = options.input?.pageSize ?? 50;
    const page = options.input?.page ?? 1;
    const allEntitySets = await ServiceLayerMetadataParser.getInstance().getEntitySetList();
    const totalCount = allEntitySets.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const start = (page - 1) * pageSize;
    const pageItems = allEntitySets.slice(start, start + pageSize);
    const result = {
      page,
      pageSize,
      totalCount,
      totalPages,
      entitySets: pageItems,
    };
    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(JSON.stringify(result)),
    ]);
  }
}

interface IGetEntitySetDetailParameter {
  entitySet: string;
}

export class GetEntitySetDetailTool
  implements vscode.LanguageModelTool<IGetEntitySetDetailParameter> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IGetEntitySetDetailParameter>,
    _token: vscode.CancellationToken
  ) {
    const entitySet = options.input.entitySet;
    const entitySetDetail = await ServiceLayerMetadataParser.getInstance().getEntitySetDetails(entitySet);
    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(JSON.stringify(entitySetDetail)),
    ]);
  }
}

interface IGetTypeDetailParameter {
  typeName: string;
}

export class GetTypeDetailTool
  implements vscode.LanguageModelTool<IGetTypeDetailParameter> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IGetTypeDetailParameter>,
    _token: vscode.CancellationToken
  ) {
    const typeName = options.input.typeName;
    const typeDetail = await ServiceLayerMetadataParser.getInstance().getTypeDetails(typeName);
    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(JSON.stringify(typeDetail)),
    ]);
  }
}

interface IValidatePropertyParameter {
  entitySet: string;
  propertyList: string;
}

export class ValidatePropertyTool
  implements vscode.LanguageModelTool<IValidatePropertyParameter> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IValidatePropertyParameter>,
    _token: vscode.CancellationToken
  ) {
    const entitySet = options.input.entitySet;
    const propertyList = options.input.propertyList.split(",");
    const invalidProperties = await ServiceLayerMetadataParser.getInstance().validateEntitySetProperties(entitySet, propertyList);
    const parts = [];
    if (invalidProperties.length === 0) {
      parts.push(new vscode.LanguageModelTextPart(`All Properties are valid for entity set ${entitySet}`));
    } else {
      parts.push(new vscode.LanguageModelTextPart(`These properties: '${invalidProperties.join(",")}' are invalid for entity set ${entitySet}`));
    }
    return new vscode.LanguageModelToolResult(parts);
  }
}

interface IValidateComplexTypePropertyParameter {
  complexType: string;
  propertyList: string;
}

export class ValidateComplexTypePropertyTool
  implements vscode.LanguageModelTool<IValidateComplexTypePropertyParameter> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IValidateComplexTypePropertyParameter>,
    _token: vscode.CancellationToken
  ) {
    const complexType = options.input.complexType;
    const propertyList = options.input.propertyList.split(",");
    const invalidProperties = await ServiceLayerMetadataParser.getInstance().validateComplexTypeProperty(complexType, propertyList);
    const parts = [];
    if (invalidProperties.length === 0) {
      parts.push(new vscode.LanguageModelTextPart(`All Properties are valid for complex type ${complexType}`));
    } else {
      parts.push(new vscode.LanguageModelTextPart(`These properties: '${invalidProperties.join(",")}' are invalid for complex type ${complexType}`));
    }
    return new vscode.LanguageModelToolResult(parts);
  }
}

export class GetFunctionImportListTool
  implements vscode.LanguageModelTool<void> {
  async invoke(
    _options: vscode.LanguageModelToolInvocationOptions<void>,
    _token: vscode.CancellationToken
  ) {
    const functionImportList = await ServiceLayerMetadataParser.getInstance().getGlobalFunctionImportList();
    const parts = [];
    for (const functionImport of functionImportList) {
      parts.push(new vscode.LanguageModelTextPart(functionImport));
    }
    return new vscode.LanguageModelToolResult(parts);
  }
}

interface IGetFunctionImportDetailParameter {
  functionName: string;
}

export class GetFunctionImportDetailTool
  implements vscode.LanguageModelTool<IGetFunctionImportDetailParameter> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IGetFunctionImportDetailParameter>,
    _token: vscode.CancellationToken
  ) {
    const functionImport = options.input.functionName;
    const functionImportDetail = await ServiceLayerMetadataParser.getInstance().getFunctionImportDetails(functionImport);
    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(JSON.stringify(functionImportDetail)),
    ]);
  }
}
