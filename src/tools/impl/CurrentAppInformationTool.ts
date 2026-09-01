import * as vscode from "vscode";
import { ensureCurrentWorkspaceFolder } from "../../utils/Utils";

export class GetCurrentAppInformationTool
  implements vscode.LanguageModelTool<void> {
  async invoke(
    _options: vscode.LanguageModelToolInvocationOptions<void>,
    _token: vscode.CancellationToken
  ) {
    const workspaceFolder = await ensureCurrentWorkspaceFolder();
    let entries: [string, vscode.FileType][] = [];
    try {
      const allEntries = await vscode.workspace.fs.readDirectory(
        workspaceFolder.uri
      );
      entries = allEntries.filter(([name]) => !name.startsWith("."));
      if (entries.length === 0) {
        vscode.window.showInformationMessage(
          `Workspace folder ${workspaceFolder.uri.fsPath} is empty.`
        );
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(`Workspace folder is empty.`),
        ]);
      }
    } catch (error) {
      const errorMsg = `Unable to access workspace folder: ${String(error)}`;
      vscode.window.showErrorMessage(errorMsg);
      return new vscode.LanguageModelToolResult([
        new vscode.LanguageModelTextPart(errorMsg),
      ]);
    }

    let baseUri = workspaceFolder.uri;
    let appJsonFile = vscode.Uri.joinPath(baseUri, "app.json");
    try {
      await vscode.workspace.fs.stat(appJsonFile);
    } catch {
      const subFolders = entries.filter(
        ([, type]) => type === vscode.FileType.Directory
      );
      if (subFolders.length === 1) {
        const subFolderUri = vscode.Uri.joinPath(
          workspaceFolder.uri,
          subFolders[0][0]
        );
        const subAppJsonFile = vscode.Uri.joinPath(subFolderUri, "app.json");
        try {
          await vscode.workspace.fs.stat(subAppJsonFile);
          baseUri = subFolderUri;
          appJsonFile = subAppJsonFile;
        } catch {
          const errorMsg = "app.json file not found in workspace.";
          vscode.window.showErrorMessage(errorMsg);
          return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(errorMsg),
          ]);
        }
      } else {
        const errorMsg = "app.json file not found in workspace.";
        vscode.window.showErrorMessage(errorMsg);
        return new vscode.LanguageModelToolResult([
          new vscode.LanguageModelTextPart(errorMsg),
        ]);
      }
    }

    const appJsonContent = await vscode.workspace.fs.readFile(appJsonFile);
    const appJsonContentString = new TextDecoder().decode(appJsonContent);
    const appJsonObj = JSON.parse(appJsonContentString);

    interface AppInfo {
      appProvider?: string;
      appName?: string;
      modules: string[];
      moduleDetails: {
        name: string;
        moduleFolder: string;
        namespace: string;
        dialogs: {
          name: string;
          layoutFile: string;
          controllerFile: string;
        }[];
        views: {
          name: string;
          layoutFile: string;
          controllerFile: string;
        }[];
      }[];
    }

    const appInfo: AppInfo = {
      modules: [],
      moduleDetails: [],
    };

    for (const app of appJsonObj.applications) {
      const parts: string[] = app.name.split(".");
      if (parts.length < 3) {
        continue;
      }
      appInfo.appProvider = parts[0];
      appInfo.appName = parts[1];
      const moduleName = parts[2];
      appInfo.modules.push(moduleName);

      const manifestFilePath = vscode.Uri.joinPath(
        baseUri,
        `${moduleName}/src/manifest.json`
      );
      const manifestFileContent = await vscode.workspace.fs.readFile(
        manifestFilePath
      );
      const manifestFileString = new TextDecoder().decode(manifestFileContent);
      const manifestFileObj = JSON.parse(manifestFileString);
      const bundles = manifestFileObj["b1.bundles"];

      const dialogs: {
        name: string;
        id: string;
        layoutFile: string;
        controllerFile: string;
      }[] = [];
      const views: {
        name: string;
        id: string;
        layoutFile: string;
        baseViewId: string;
        controllerFile: string;
      }[] = [];

      for (const bundle of bundles) {
        if (!bundle.id) {
          continue;
        }

        const bundleString = bundle.id as string;
        if (bundleString.endsWith(".dialog")) {
          const dialogName = bundleString.split(".")[0];
          const layoutFile = `${moduleName}/src/${bundle.view}`;
          const layoutContent = await vscode.workspace.fs.readFile(
            vscode.Uri.joinPath(baseUri, layoutFile)
          );
          const layoutContentString = new TextDecoder().decode(layoutContent);
          const layoutContentObj = JSON.parse(layoutContentString);
          const controller = layoutContentObj.controller as string;
          const controllerFile =
            `${moduleName}/src/controller/` +
            controller.split(".").pop() +
            ".ts";
          dialogs.push({
            name: dialogName,
            id: dialogName + ".dialog",
            layoutFile,
            controllerFile,
          });
        } else {
          if (!bundle.baseViewGuid) {
            continue;
          }
          const viewName = bundleString.split(".")[0];
          const layoutFile = `${moduleName}/src/${bundle.layout}`;
          const layoutContent = await vscode.workspace.fs.readFile(
            vscode.Uri.joinPath(baseUri, layoutFile)
          );
          const layoutContentString = new TextDecoder().decode(layoutContent);
          const layoutContentObj = JSON.parse(layoutContentString);
          const controller = layoutContentObj.controller as string;
          const controllerFile =
            `${moduleName}/src/controller/` +
            controller.split(".").pop() +
            ".ts";

          views.push({
            name: viewName,
            id: viewName + ".layout",
            layoutFile: `${moduleName}/src/${bundle.layout}`,
            baseViewId: bundle.baseViewGuid,
            controllerFile,
          });
        }
      }

      appInfo.moduleDetails.push({
        name: moduleName,
        moduleFolder: moduleName,
        namespace: `${appInfo.appProvider}.${appInfo.appName}.${moduleName}`,
        dialogs,
        views,
      });
    }

    return new vscode.LanguageModelToolResult([
      new vscode.LanguageModelTextPart(JSON.stringify(appInfo)),
    ]);
  }
}
