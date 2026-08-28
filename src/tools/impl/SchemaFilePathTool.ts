import * as vscode from "vscode";
import { ensureCurrentWorkspaceFolder, getCurrentExtension } from "../../utils/Utils";

export type UISchemaType = "Manifest" | "ViewLayout" | "Dialog" | "Controls" | "Common";

const uiSchemaRelativePaths: Record<UISchemaType, string> = {
  Manifest: "schema/manifest.schema.json",
  ViewLayout: "schema/layout.schema.json",
  Dialog: "schema/dialog.schema.json",
  Common: "schema/common.schema.json",
  Controls: "schema/controls.schema.json",
};

const validSchemaTypes = Object.keys(uiSchemaRelativePaths) as UISchemaType[];

function isUISchemaType(value: unknown): value is UISchemaType {
  return typeof value === "string" && validSchemaTypes.includes(value as UISchemaType);
}

function getUISchemaUri(schemaType: UISchemaType): vscode.Uri {
  const extension = getCurrentExtension();
  return vscode.Uri.joinPath(
    extension.extensionUri,
    uiSchemaRelativePaths[schemaType]
  );
}

function getProjectLocalUISchemaUri(
  workspaceFolder: vscode.WorkspaceFolder,
  schemaType: UISchemaType
): vscode.Uri {
  return vscode.Uri.joinPath(
    workspaceFolder.uri,
    "References",
    uiSchemaRelativePaths[schemaType]
  );
}

interface ISchemaFilePathParameter {
  schemaType: UISchemaType;
}

export class GetUIAPISchemaFilePathTool
  implements vscode.LanguageModelTool<ISchemaFilePathParameter> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<ISchemaFilePathParameter>,
    _token: vscode.CancellationToken
  ) {
    const params = options.input as ISchemaFilePathParameter;
    if (!isUISchemaType(params?.schemaType)) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(
          `Invalid schemaType. Allowed values: ${validSchemaTypes.join(", ")}.`
        ),
      ]);
    }

    const workspaceFolder = await ensureCurrentWorkspaceFolder();
    const projectLocalSchemaUri = getProjectLocalUISchemaUri(
      workspaceFolder,
      params.schemaType
    );
    const globalSchemaUri = getUISchemaUri(params.schemaType);
    const result = {
      schemaType: params.schemaType,
      projectLocalPath: projectLocalSchemaUri.fsPath,
      globalPath: globalSchemaUri.fsPath,
    };

    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(JSON.stringify(result)),
    ]);
  }
}
