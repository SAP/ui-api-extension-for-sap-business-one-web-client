import * as vscode from "vscode";
import { getViewsMeta } from "./ToolShared";

interface IGetViewDetailParameter {
  viewName: string;
}

const MAX_VIEW_NAME_LENGTH = 256;

function validateViewName(value: unknown): string | undefined {
  if (typeof value !== "string" || value.trim().length === 0) {
    return "Invalid viewName. Provide a non-empty string.";
  }

  if (value.length > MAX_VIEW_NAME_LENGTH) {
    return `Invalid viewName. Maximum length is ${MAX_VIEW_NAME_LENGTH} characters.`;
  }

  return undefined;
}

export class GetViewListTool implements vscode.LanguageModelTool<void> {
  async invoke(
    _options: vscode.LanguageModelToolInvocationOptions<void>,
    _token: vscode.CancellationToken
  ) {
    const views = await getViewsMeta();
    const parts = [];
    for (const view of views) {
      if (typeof view.name === "string" && view.name.trim().length > 0) {
        parts.push(new vscode.LanguageModelTextPart(view.name));
      }
    }

    return new vscode.LanguageModelToolResult(parts);
  }
}

export class GetViewDetailTool
  implements vscode.LanguageModelTool<IGetViewDetailParameter> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IGetViewDetailParameter>,
    _token: vscode.CancellationToken
  ) {
    const viewName = options.input.viewName;
    const validationError = validateViewName(viewName);
    if (validationError) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(validationError),
      ]);
    }

    const views = await getViewsMeta();
    const matchedView = views.find((view) => view.name === viewName.trim());
    if (!matchedView) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(`View '${viewName}' not found.`),
      ]);
    }

    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(JSON.stringify(matchedView)),
    ]);
  }
}
