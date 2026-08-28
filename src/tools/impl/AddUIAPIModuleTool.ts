import * as vscode from "vscode";
import { AppMeta, AppModuleMeta, AppViewMeta, ContentProvider } from "../../content/ContentProvider";
import { ensureCurrentWorkspaceFolder, sanitizeIdentifier } from "../../utils/Utils";
import {
  getViewsMeta,
  IResolvedAppContext,
  isNonEmptyString,
  MAX_CATEGORY_LENGTH,
  MAX_NAME_LENGTH,
  resolveAppContextFromAppJson,
} from "./ToolShared";

interface IAddUIAPIModuleParameter {
  moduleName: string;
  views: Array<{
    viewName: string;
    baseViewCategory?: string;
    baseViewName: string;
  }>;
}

const MAX_VIEWS_PER_MODULE = 50;

function validateAddModuleInput(input: IAddUIAPIModuleParameter): string | undefined {
  if (!isNonEmptyString(input.moduleName) || input.moduleName.length > MAX_NAME_LENGTH) {
    return `Invalid moduleName. Provide a non-empty string up to ${MAX_NAME_LENGTH} characters.`;
  }

  if (!Array.isArray(input.views) || input.views.length === 0 || input.views.length > MAX_VIEWS_PER_MODULE) {
    return `Invalid views. Provide 1 to ${MAX_VIEWS_PER_MODULE} views.`;
  }

  for (const view of input.views) {
    if (!isNonEmptyString(view.viewName) || view.viewName.length > MAX_NAME_LENGTH) {
      return `Invalid viewName. Provide a non-empty string up to ${MAX_NAME_LENGTH} characters.`;
    }

    if (!isNonEmptyString(view.baseViewName) || view.baseViewName.length > MAX_NAME_LENGTH) {
      return `Invalid baseViewName. Provide a non-empty string up to ${MAX_NAME_LENGTH} characters.`;
    }

    if (typeof view.baseViewCategory !== "undefined") {
      if (!isNonEmptyString(view.baseViewCategory) || view.baseViewCategory.length > MAX_CATEGORY_LENGTH) {
        return `Invalid baseViewCategory. Provide a non-empty string up to ${MAX_CATEGORY_LENGTH} characters.`;
      }
    }

    if (!sanitizeIdentifier(view.viewName)) {
      return `Invalid viewName '${view.viewName}'. It must contain at least one alphanumeric character after sanitization.`;
    }
  }

  if (!sanitizeIdentifier(input.moduleName)) {
    return `Invalid moduleName '${input.moduleName}'. It must contain at least one alphanumeric character after sanitization.`;
  }

  return undefined;
}

async function resolveModuleViews(
  moduleName: string,
  views: IAddUIAPIModuleParameter["views"]
): Promise<{ module?: AppModuleMeta; invalidBaseViews: string[] }> {
  const viewList = await getViewsMeta();
  const invalidBaseViews: string[] = [];
  const resolvedViews: AppViewMeta[] = [];

  for (const view of views) {
    const matchedView = viewList.find((item) => item.name === view.baseViewName);
    if (!matchedView) {
      invalidBaseViews.push(view.baseViewName);
      continue;
    }

    resolvedViews.push({
      viewName: sanitizeIdentifier(view.viewName),
      baseViewCategory: view.baseViewCategory ?? "System",
      baseViewName: view.baseViewName,
      baseViewUUID: matchedView.viewId,
      table: matchedView.table,
      sampleControlUuid: matchedView.sampleControlUuid,
    });
  }

  if (invalidBaseViews.length) {
    return { invalidBaseViews };
  }

  return {
    module: {
      moduleName: sanitizeIdentifier(moduleName),
      views: resolvedViews,
    },
    invalidBaseViews,
  };
}

export class AddUIAPIModule
  implements vscode.LanguageModelTool<IAddUIAPIModuleParameter> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IAddUIAPIModuleParameter>,
    _token: vscode.CancellationToken
  ) {
    const params = options.input as IAddUIAPIModuleParameter;
    const validationError = validateAddModuleInput(params);
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
    if (appContext.existingModuleNames.includes(moduleName)) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(`Module '${moduleName}' already exists in current app.`),
      ]);
    }

    const resolved = await resolveModuleViews(params.moduleName, params.views);
    if (resolved.invalidBaseViews.length) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          `Invalid base view names: ${resolved.invalidBaseViews.map((viewName) => `'${viewName}'`).join(", ")}. Please retrieve the relevant UI API base views by tools and select the most relevant.`
        ),
      ]);
    }

    const appMeta: AppMeta = {
      appName: appContext.appName,
      appVersion: appContext.appVersion,
      appProvider: appContext.appProvider,
      modules: resolved.module ? [resolved.module] : [],
    };

    const contentProvider = new ContentProvider();
    const retString = await contentProvider.addModuleToExistingApp(appMeta, workspaceFolder.uri);
    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(retString),
    ]);
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<IAddUIAPIModuleParameter>,
    _token: vscode.CancellationToken
  ) {
    const confirmationMessages = {
      title: "Add Web Client UIAPI Module",
      message: new vscode.MarkdownString(
        `Add module "${options.input.moduleName}" with ${options.input.views.length} view(s) to the current Web Client UI API application?\n\n`
      ),
    };
    return {
      invocationMessage: `'Add Web Client UI API Module' "${options.input.moduleName}"`,
      confirmationMessages,
    };
  }
}
