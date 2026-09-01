import * as vscode from "vscode";
import { AppMeta, ContentProvider } from "../../content/ContentProvider";
import { ensureCurrentWorkspaceFolder, sanitizeIdentifier } from "../../utils/Utils";
import { isNonEmptyString, MAX_CATEGORY_LENGTH, MAX_NAME_LENGTH, resolveViews } from "./ToolShared";

interface ICreateUIAPIAppParameter {
  appName: string;
  appVersion?: string;
  appProvider: string;
  modules: Array<{
    moduleName: string;
    views: Array<{
      viewName: string;
      baseViewCategory?: string;
      baseViewName: string;
    }>;
  }>;
}

const MAX_MODULES = 20;
const MAX_VIEWS_PER_MODULE = 50;
const MAX_TOTAL_VIEWS = 200;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?(?:\+[0-9A-Za-z-.]+)?$/;

function validateCreateAppInput(input: ICreateUIAPIAppParameter): string | undefined {
  if (!isNonEmptyString(input.appName) || input.appName.length > MAX_NAME_LENGTH) {
    return `Invalid appName. Provide a non-empty string up to ${MAX_NAME_LENGTH} characters.`;
  }

  if (!isNonEmptyString(input.appProvider) || input.appProvider.length > MAX_NAME_LENGTH) {
    return `Invalid appProvider. Provide a non-empty string up to ${MAX_NAME_LENGTH} characters.`;
  }

  if (input.appProvider.trim().toLowerCase() === "sap") {
    return "Invalid appProvider. 'sap' is reserved and cannot be used.";
  }

  if (typeof input.appVersion !== "undefined" && !SEMVER_PATTERN.test(input.appVersion)) {
    return "Invalid appVersion. Provide a semantic version such as '1.0.0'.";
  }

  if (!Array.isArray(input.modules) || input.modules.length === 0 || input.modules.length > MAX_MODULES) {
    return `Invalid modules. Provide 1 to ${MAX_MODULES} modules.`;
  }

  let totalViews = 0;
  for (const module of input.modules) {
    if (!isNonEmptyString(module.moduleName) || module.moduleName.length > MAX_NAME_LENGTH) {
      return `Invalid moduleName. Provide a non-empty string up to ${MAX_NAME_LENGTH} characters.`;
    }

    if (!Array.isArray(module.views) || module.views.length === 0 || module.views.length > MAX_VIEWS_PER_MODULE) {
      return `Invalid views for module '${module.moduleName}'. Provide 1 to ${MAX_VIEWS_PER_MODULE} views.`;
    }

    totalViews += module.views.length;
    for (const view of module.views) {
      if (!isNonEmptyString(view.viewName) || view.viewName.length > MAX_NAME_LENGTH) {
        return `Invalid viewName in module '${module.moduleName}'. Provide a non-empty string up to ${MAX_NAME_LENGTH} characters.`;
      }

      if (!isNonEmptyString(view.baseViewName) || view.baseViewName.length > MAX_NAME_LENGTH) {
        return `Invalid baseViewName in module '${module.moduleName}'. Provide a non-empty string up to ${MAX_NAME_LENGTH} characters.`;
      }

      if (typeof view.baseViewCategory !== "undefined") {
        if (!isNonEmptyString(view.baseViewCategory) || view.baseViewCategory.length > MAX_CATEGORY_LENGTH) {
          return `Invalid baseViewCategory in module '${module.moduleName}'. Provide a non-empty string up to ${MAX_CATEGORY_LENGTH} characters.`;
        }
      }
    }
  }

  if (totalViews > MAX_TOTAL_VIEWS) {
    return `Invalid payload size. The total number of views must be at most ${MAX_TOTAL_VIEWS}.`;
  }

  if (!sanitizeIdentifier(input.appName)) {
    return "Invalid appName. It must contain at least one alphanumeric character after sanitization.";
  }

  if (!sanitizeIdentifier(input.appProvider)) {
    return "Invalid appProvider. It must contain at least one alphanumeric character after sanitization.";
  }

  for (const module of input.modules) {
    if (!sanitizeIdentifier(module.moduleName)) {
      return `Invalid moduleName '${module.moduleName}'. It must contain at least one alphanumeric character after sanitization.`;
    }

    for (const view of module.views) {
      if (!sanitizeIdentifier(view.viewName)) {
        return `Invalid viewName '${view.viewName}'. It must contain at least one alphanumeric character after sanitization.`;
      }
    }
  }

  return undefined;
}

export class CreateUIAPIApp
  implements vscode.LanguageModelTool<ICreateUIAPIAppParameter> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<ICreateUIAPIAppParameter>,
    _token: vscode.CancellationToken
  ) {
    const param = options.input as ICreateUIAPIAppParameter;
    const validationError = validateCreateAppInput(param);
    if (validationError) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(validationError),
      ]);
    }

    const allInvalidBaseViews: string[] = [];
    const resolvedModules = [];
    for (const module of param.modules) {
      const { resolvedViews, invalidBaseViews } = await resolveViews(module.views);
      allInvalidBaseViews.push(...invalidBaseViews);
      resolvedModules.push({ moduleName: sanitizeIdentifier(module.moduleName), views: resolvedViews });
    }

    if (allInvalidBaseViews.length) {
      await vscode.window.showWarningMessage("One or more view IDs were not found, retry...");
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          `Invalid base view names: ${allInvalidBaseViews.map((v) => `'${v}'`).join(", ")}. Please retrieve the relevant UI API base views by tools and select the most relevant.`
        ),
      ]);
    }

    const appName = sanitizeIdentifier(param.appName);
    const appProvider = sanitizeIdentifier(param.appProvider);
    const appVersion = param.appVersion || "1.0.0";

    const appMeta: AppMeta = {
      appName,
      appVersion,
      appProvider,
      modules: resolvedModules,
    };

    const workspaceFolder = await ensureCurrentWorkspaceFolder();
    const contentProvider = new ContentProvider();
    const retString = await contentProvider.createApp(appMeta, workspaceFolder.uri);
    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(retString),
    ]);
  }

  async prepareInvocation(
    options: vscode.LanguageModelToolInvocationPrepareOptions<ICreateUIAPIAppParameter>,
    _token: vscode.CancellationToken
  ) {
    options.input.appVersion = options.input.appVersion
      ? options.input.appVersion
      : "1.0.0";
    const confirmationMessages = {
      title: "Create Web Client UIAPI Application",
      message: new vscode.MarkdownString(
        `Create UIAPI Application "${options.input.appName}" of version "${options.input.appVersion}" from provider "${options.input.appProvider}" with ${options.input.modules.length} module(s)?\n\n`
      ),
    };
    return {
      invocationMessage: `'Create Web Client UI API Application' "${options.input.appName}"`,
      confirmationMessages,
    };
  }
}
