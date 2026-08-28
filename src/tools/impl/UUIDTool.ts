import * as vscode from "vscode";
import { v4 as uuidv4 } from "uuid";
import { createTranslator } from "short-uuid";

const shortUuidTranslator = createTranslator();

interface IUUIDOptions {
  uuidCount?: number;
}

const MAX_UUID_COUNT = 200;

function getValidatedUuidCount(params: IUUIDOptions): { value?: number; error?: string } {
  const rawCount = params.uuidCount ?? 1;

  if (!Number.isInteger(rawCount)) {
    return { error: "Invalid uuidCount. Provide an integer." };
  }

  if (rawCount < 1 || rawCount > MAX_UUID_COUNT) {
    return { error: `Invalid uuidCount. Allowed range is 1 to ${MAX_UUID_COUNT}.` };
  }

  return { value: rawCount };
}

export class UUIDTool implements vscode.LanguageModelTool<IUUIDOptions> {
  async invoke(
    options: vscode.LanguageModelToolInvocationOptions<IUUIDOptions>,
    _token: vscode.CancellationToken
  ) {
    const params = options.input as IUUIDOptions;
    const countValidation = getValidatedUuidCount(params);
    if (countValidation.error) {
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(countValidation.error),
      ]);
    }

    const uuidCount = countValidation.value ?? 1;
    const uuidList = [];

    for (let i = 0; i < uuidCount; i++) {
      const uuid = shortUuidTranslator.fromUUID(uuidv4());
      uuidList.push(uuid);
    }

    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(uuidList.join(",")),
    ]);
  }
}
