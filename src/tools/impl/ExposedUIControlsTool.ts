import * as vscode from "vscode";
import { getCurrentExtension } from "../../utils/Utils";

async function getExposedUIControls() {
  const extension = getCurrentExtension();
  const controlsSchema = vscode.Uri.joinPath(
    extension.extensionUri,
    "schema/controls.schema.json"
  );
  const schemaContent = await vscode.workspace.fs.readFile(controlsSchema);
  const schemaContentString = new TextDecoder().decode(schemaContent);
  const jsonSchema = JSON.parse(schemaContentString);
  const controls: { controlName: string; description: string }[] = [];

  Object.keys(jsonSchema.definitions).forEach((key) => {
    const val = jsonSchema.definitions[key];
    if (
      val.title &&
      String.prototype.startsWith.call(val.title, "UI Control:")
    ) {
      const controlName = val.title.split(":")[1].trim();
      controls.push({
        controlName,
        description: val.description
      });
    }
  });

  return controls;
}

export class GetExposedUIAPIControlsTool
  implements vscode.LanguageModelTool<void> {
  async invoke(
    _options: vscode.LanguageModelToolInvocationOptions<void>,
    _token: vscode.CancellationToken
  ) {
    const controls = await getExposedUIControls();
    const parts = [];
    for (const control of controls) {
      parts.push(new vscode.LanguageModelTextPart(JSON.stringify(control)));
    }
    return new vscode.LanguageModelToolResult(parts);
  }
}
