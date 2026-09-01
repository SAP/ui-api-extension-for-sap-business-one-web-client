import * as vscode from "vscode";
import { AppMeta, ContentProvider } from "../../content/ContentProvider";
import { ensureCurrentWorkspaceFolder, sanitizeIdentifier } from "../../utils/Utils";
import {
  IResolvedAppContext,
  isNonEmptyString,
  MAX_CATEGORY_LENGTH,
  MAX_NAME_LENGTH,
  resolveAppContextFromAppJson,
  resolveViews,
} from "./ToolShared";

interface IAddUIAPIViewParameter {
  moduleName: string;
  viewName: string;
  baseViewCategory?: string;
  baseViewName: string;
}


function validateAddViewInput(input: IAddUIAPIViewParameter): string | undefined {
  if (!isNonEmptyString(input.moduleName) || input.moduleName.length > MAX_NAME_LENGTH) {
    return `Invalid moduleName. Provide a non-empty string up to ${MAX_NAME_LENGTH} characters.`;
  }

  if (!isNonEmptyString(input.viewName) || input.viewName.length > MAX_NAME_LENGTH) {
    return `Invalid viewName. Provide a non-empty string up to ${MAX_NAME_LENGTH} characters.`;
  }

  if (!isNonEmptyString(input.baseViewName) || input.baseViewName.length > MAX_NAME_LENGTH) {
    return `Invalid baseViewName. Provide a non-empty string up to ${MAX_NAME_LENGTH} characters.`;
  }

  if (typeof input.baseViewCategory !== "undefined") {
    if (!isNonEmptyString(input.baseViewCategory) || input.baseViewCategory.length > MAX_CATEGORY_LENGTH) {
      return `Invalid baseViewCategory. Provide a non-empty string up to ${MAX_CATEGORY_LENGTH} characters.`;
    }
  }

  if (!sanitizeIdentifier(input.moduleName)) {
    return `Invalid moduleName '${input.moduleName}'. It must contain at least one alphanumeric character after sanitization.`;
  }

  if (!sanitizeIdentifier(input.viewName)) {
    return `Invalid viewName '${input.viewName}'. It must contain at least one alphanumeric character after sanitization.`;
  }

  return undefined;
}

export class AddUIAPIView
  implements vscode.LanguageModelTool<IAddUIAPIViewParameter> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IAddUIAPIViewParameter>,
    _token: vscode.CancellationToken
  ) {
    const params = options.input as IAddUIAPIViewParameter;
    const validationError = validateAddViewInput(params);
    if (validationError) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(validationError),
      ]);
    }

    const workspaceFolder = await ensureCurrentWorkspaceFolder();
    const appJsonUri = vscode.Uri.joinPath(workspaceFolder.uri, "app.json");
    let appJson: unknown;
    try {
      const appJsonContent = await vscode.workspace.fs.readFile(appJsonUri);
      appJson = JSON.parse(new TextDecoder().decode(appJsonContent));
    } catch (error) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(`Unable to read app.json from current workspace: ${String(error)}`),
      ]);
    }

    let appContext: IResolvedAppContext;
    try {
      appContext = resolveAppContextFromAppJson(appJson);
    } catch (error) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(String(error)),
      ]);
    }

    const moduleName = sanitizeIdentifier(params.moduleName);
    if (!appContext.existingModuleNames.includes(moduleName)) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(`Module '${moduleName}' does not exist in current app.`),
      ]);
    }

    const { resolvedViews, invalidBaseViews } = await resolveViews([{
      viewName: params.viewName,
      baseViewCategory: params.baseViewCategory,
      baseViewName: params.baseViewName,
    }]);
    if (invalidBaseViews.length) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          `Invalid base view name '${invalidBaseViews[0]}'. Please retrieve the relevant UI API base views by tools and select the most relevant.`
        ),
      ]);
    }
    const resolvedView = resolvedViews[0];

    const appMeta: AppMeta = {
      appName: appContext.appName,
      appVersion: appContext.appVersion,
      appProvider: appContext.appProvider,
      modules: [
        {
          moduleName,
          views: [resolvedView],
        },
      ],
    };

    const contentProvider = new ContentProvider();
    const retString = await contentProvider.addViewToExistingModule(appMeta, workspaceFolder.uri);
    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(retString),
    ]);
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<IAddUIAPIViewParameter>,
    _token: vscode.CancellationToken
  ) {
    const confirmationMessages = {
      title: "Add Web Client UIAPI View",
      message: new vscode.MarkdownString(
        `Add view "${options.input.viewName}" to module "${options.input.moduleName}" in the current Web Client UI API application?\n\n`
      ),
    };
    return {
      invocationMessage: `'Add Web Client UI API View' "${options.input.viewName}"`,
      confirmationMessages,
    };
  }
}