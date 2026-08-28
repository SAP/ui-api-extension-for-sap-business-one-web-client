import * as vscode from 'vscode';
import { getCurrentExtension, linkFolder, tokenizeBrowserStartupFlags } from '../utils/Utils';
import { getClassLogger } from '../logger/LoggerWrapper';
import { IChildLogger } from '@vscode-logging/logger';
import { DEV_SERVER_PORT_PROP, WEB_CLIENT_URL_PROP, getBrowserStartupFlagsSetting } from '../settings/SettingItems';

export interface AppViewMeta {
    viewName: string;
    baseViewCategory: string;
    baseViewName: string;
    baseViewUUID: string;
    table: string;
    sampleControlUuid: string;
}

export interface AppModuleMeta {
    moduleName: string;
    views: AppViewMeta[];
}

export interface AppMeta {
    appName: string;
    appVersion: string;
    appProvider: string;
    modules: AppModuleMeta[];
}

export class ContentProvider {
    private readonly logger: IChildLogger = getClassLogger(ContentProvider.name);

    private async fileExists(uri: vscode.Uri): Promise<boolean> {
        try {
            await vscode.workspace.fs.stat(uri);
            return true;
        } catch {
            return false;
        }
    }

    private formatError(error: unknown): string {
        if (error instanceof Error) {
            return error.stack ?? error.message;
        }
        return String(error);
    }

    private getAppModules(appMeta: AppMeta): AppModuleMeta[] {
        if (appMeta.modules?.length) {
            return appMeta.modules;
        }
        return [];
    }

    private buildLaunchConfigurations(appMeta: AppMeta): vscode.DebugConfiguration[] {
        const debugUrl = `\${config:${WEB_CLIENT_URL_PROP}}?enable-extension-debug=true&extension-debug-server=http%3A%2F%2Flocalhost%3A\${config:${DEV_SERVER_PORT_PROP}}%2F`;
        const configurations: vscode.DebugConfiguration[] = [];

        const browserFlags = getBrowserStartupFlagsSetting().trim();
        const runtimeArgs = browserFlags ? tokenizeBrowserStartupFlags(browserFlags) : [];
        for (const module of this.getAppModules(appMeta)) {
            for (const view of module.views) {
                const objectType = view.table && view.table !== '<<TODO>>' ? view.table : 'REPLACE_OBJECT_TYPE';
                const isListView = /list$/i.test(view.baseViewName);
                const routeType = isListView ? 'List' : 'Detail';
                const routeSuffix = isListView
                    ? `/Objects/${objectType}/${routeType}`
                    : `/Objects/${objectType}/${routeType}?view=${objectType}.detailView`;


                const configuration: vscode.DebugConfiguration = {
                    name: `WebClient Preview - ${module.moduleName} | ${view.viewName}`,
                    request: 'launch',
                    preLaunchTask: "prepare dev server",
                    type: 'chrome',
                    url: `${debugUrl}#webclient-${objectType}&${routeSuffix}`,
                    webRoot: '${workspaceFolder}',
                    runtimeArgs: runtimeArgs
                };
                configurations.push(configuration);

                // For editor-browser debug type, do not apply the runtime arguments.
                configurations.push({
                    name: `Embedded WebClient Preview - ${module.moduleName} | ${view.viewName}`,
                    request: 'launch',
                    preLaunchTask: "prepare dev server",
                    type: "editor-browser",
                    url: `${debugUrl}#webclient-${objectType}&${routeSuffix}`,
                    webRoot: '${workspaceFolder}'
                });
            }
        }
        return configurations;
    }

    private async generateSettings(vscodeFolderUri: vscode.Uri): Promise<void> {
        const settingsJsonContent = {
            "json.schemas": [],
            "json.validate.enable": true,
            "files.exclude": {
                "index.html": true,
                "gulpfile.js": true,
            }
        };

        const settingsJson = "settings.json";
        const settingsJsonUri = vscode.Uri.joinPath(vscodeFolderUri, settingsJson);
        const settingsJsonString = JSON.stringify(settingsJsonContent, null, 2);
        const settingsJsonContentEncoded = new TextEncoder().encode(settingsJsonString);
        await vscode.workspace.fs.writeFile(settingsJsonUri, settingsJsonContentEncoded);
        this.logger.debug(`Generated ${settingsJson} at '${settingsJsonUri.fsPath}'.`);
    }

    private async generateLaunchJson(appMeta: AppMeta, vscodeFolderUri: vscode.Uri): Promise<void> {
        const configurations = this.buildLaunchConfigurations(appMeta);

        const launchJsonContent = {
            version: "0.2.0",
            configurations
        };

        const launchJson = "launch.json";
        const launchJsonUri = vscode.Uri.joinPath(vscodeFolderUri, launchJson);
        const launchJsonString = JSON.stringify(launchJsonContent, null, 2);
        const launchJsonContentEncoded = new TextEncoder().encode(launchJsonString);
        await vscode.workspace.fs.writeFile(launchJsonUri, launchJsonContentEncoded);
        this.logger.debug(`Generated ${launchJson} at '${launchJsonUri.fsPath}'.`);
    }

    private async appendLaunchJsonConfigurations(appMeta: AppMeta, vscodeFolderUri: vscode.Uri): Promise<void> {
        const launchJsonUri = vscode.Uri.joinPath(vscodeFolderUri, 'launch.json');
        let launchJsonContent: { version: string; configurations: vscode.DebugConfiguration[] } = {
            version: '0.2.0',
            configurations: []
        };

        try {
            const launchRaw = await vscode.workspace.fs.readFile(launchJsonUri);
            const parsed = JSON.parse(new TextDecoder().decode(launchRaw)) as { version?: string; configurations?: vscode.DebugConfiguration[] };
            launchJsonContent = {
                version: parsed.version ?? '0.2.0',
                configurations: Array.isArray(parsed.configurations) ? parsed.configurations : []
            };
        } catch {
            // If launch.json doesn't exist yet, create it with the new module configurations.
        }

        const newConfigurations = this.buildLaunchConfigurations(appMeta);
        const existingNames = new Set(
            launchJsonContent.configurations
                .filter((configuration) => typeof configuration.name === 'string')
                .map((configuration) => configuration.name)
        );
        for (const configuration of newConfigurations) {
            if (!existingNames.has(configuration.name)) {
                launchJsonContent.configurations.push(configuration);
            }
        }

        const launchJsonString = JSON.stringify(launchJsonContent, null, 2);
        const launchJsonContentEncoded = new TextEncoder().encode(launchJsonString);
        await vscode.workspace.fs.writeFile(launchJsonUri, launchJsonContentEncoded);
        this.logger.debug(`Updated launch.json at '${launchJsonUri.fsPath}' with new module configurations.`);
    }

    private async generateTasksJson(vscodeFolderUri: vscode.Uri): Promise<void> {
        const tasksJsonContent = {
            "version": "2.0.0",
            "tasks": [
                {
                    "label": "npm: install if needed",
                    "type": "shell",
                    "command": "node start.js --install-if-needed"
                },
                {
                    "label": "npm: start",
                    "type": "npm",
                    "script": "start",
                    "isBackground": true,
                    "problemMatcher": {
                        "owner": "custom",
                        "pattern": {
                            "regexp": "."
                        },
                        "background": {
                            "activeOnStart": true,
                            "beginsPattern": "Start Web Client Extension Development Server",
                            "endsPattern": "Development server is working at:"
                        }
                    }
                },
                {
                    "label": "prepare dev server",
                    "dependsOrder": "sequence",
                    "dependsOn": [
                        "npm: install if needed",
                        "npm: start"
                    ]
                }
            ]
        };

        const tasksJson = "tasks.json";
        const tasksJsonUri = vscode.Uri.joinPath(vscodeFolderUri, tasksJson);
        const tasksJsonString = JSON.stringify(tasksJsonContent, null, 2);
        const tasksJsonContentEncoded = new TextEncoder().encode(tasksJsonString);
        await vscode.workspace.fs.writeFile(tasksJsonUri, tasksJsonContentEncoded);
        this.logger.debug(`Generated ${tasksJson} at '${tasksJsonUri.fsPath}'.`);
    }

    private generateManifestJson(appMeta: AppMeta, module: AppModuleMeta): string {
        const namespace = `${appMeta.appProvider}.${appMeta.appName}.${module.moduleName}`;
        const manifestContent = {
            version: '1.0.0',
            name: namespace,
            description: 'SAPBusinessOne WebClient UI API extension created by Visual Studio Code',
            'b1.bundles': module.views.map((view) => ({
                id: `${view.viewName}.layout`,
                baseViewGuid: view.baseViewUUID,
                layout: `layout/${view.viewName}.layout.json`,
                description: view.viewName,
                i18n: {
                    '@@i18n': [`${namespace}.i18n.i18n`]
                }
            })),
            allowedExternalURLs: '*',
            allowedServiceLayerAPIs: '*'
        };
        return JSON.stringify(manifestContent, null, 2);
    }

    private async generateMtaYaml(appMeta: AppMeta, appFolderUri: vscode.Uri): Promise<void> {
        const extension = getCurrentExtension();
        const mtaTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "mta.yaml.template");
        const mtaTemplateContent = await vscode.workspace.fs.readFile(mtaTemplateFileUri);
        const mtaTemplateString = new TextDecoder().decode(mtaTemplateContent);

        const modulesAnchor = 'modules:\n';
        const modulesAnchorIndex = mtaTemplateString.indexOf(modulesAnchor);
        if (modulesAnchorIndex < 0) {
            throw new Error('Invalid mta.yaml.template: missing modules section.');
        }

        const headerTemplate = mtaTemplateString.slice(0, modulesAnchorIndex + modulesAnchor.length);
        const moduleTemplate = mtaTemplateString.slice(modulesAnchorIndex + modulesAnchor.length).trimEnd();

        const modulesContent = this.getAppModules(appMeta)
            .map((module) => moduleTemplate
                .replace(/<%= moduleName %>/g, module.moduleName)
                .replace(/<%= moduleType %>/g, 'ui-extension')
                .replace(/<%= modulePath %>/g, module.moduleName))
            .join('\n');

        const renderedHeader = headerTemplate
            .replace(/<%= ID %>/g, appMeta.appName)
            .replace(/<%= version %>/g, appMeta.appVersion)
            .replace(/<%= provider %>/g, appMeta.appProvider)
            .replace(/<%= description %>/g, 'You can add your application description')
            .replace(/<%= copyright %>/g, 'You can add your copyright information');

        const mtaContent = `${renderedHeader}${modulesContent}`;

        const mtaYaml = "mta.yaml";
        const mtaContentEncoded = new TextEncoder().encode(mtaContent);
        await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(appFolderUri, mtaYaml), mtaContentEncoded);
        this.logger.debug(`Generated ${mtaYaml} at '${vscode.Uri.joinPath(appFolderUri, mtaYaml).fsPath}'.`);
    }

    private async appendMtaYamlModule(moduleName: string, appFolderUri: vscode.Uri): Promise<void> {
        const extension = getCurrentExtension();
        const mtaTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "mta.yaml.template");
        const mtaTemplateContent = await vscode.workspace.fs.readFile(mtaTemplateFileUri);
        const mtaTemplateString = new TextDecoder().decode(mtaTemplateContent);

        const modulesAnchor = 'modules:\n';
        const modulesAnchorIndex = mtaTemplateString.indexOf(modulesAnchor);
        if (modulesAnchorIndex < 0) {
            throw new Error('Invalid mta.yaml.template: missing modules section.');
        }

        const moduleTemplate = mtaTemplateString.slice(modulesAnchorIndex + modulesAnchor.length).trimEnd();
        const moduleSnippet = moduleTemplate
            .replace(/<%= moduleName %>/g, moduleName)
            .replace(/<%= moduleType %>/g, 'ui-extension')
            .replace(/<%= modulePath %>/g, moduleName)
            .trimEnd();

        const mtaYamlUri = vscode.Uri.joinPath(appFolderUri, 'mta.yaml');
        let existingMtaYaml = '';
        try {
            const existingMtaYamlRaw = await vscode.workspace.fs.readFile(mtaYamlUri);
            existingMtaYaml = new TextDecoder().decode(existingMtaYamlRaw);
        } catch {
            throw new Error('mta.yaml not found in current app workspace.');
        }

        const moduleNamePattern = new RegExp(`(^|\\n)-\\s*name:\\s*${moduleName}(\\n|$)`);
        if (moduleNamePattern.test(existingMtaYaml)) {
            return;
        }

        const trimmedExisting = existingMtaYaml.trimEnd();
        const updatedMtaYaml = `${trimmedExisting}\n${moduleSnippet}\n`;
        await vscode.workspace.fs.writeFile(mtaYamlUri, new TextEncoder().encode(updatedMtaYaml));
        this.logger.debug(`Updated mta.yaml at '${mtaYamlUri.fsPath}' with module '${moduleName}'.`);
    }

    private async generateAppJson(appMeta: AppMeta, appFolderUri: vscode.Uri): Promise<void> {
        const jsonContent = {
            "applications": this.getAppModules(appMeta).map((module) => ({
                "name": `${appMeta.appProvider}.${appMeta.appName}.${module.moduleName}`,
                "path": `${appMeta.appName}_${appMeta.appVersion}/${module.moduleName}/webapp`
            }))
        };

        const appJson = "app.json";
        const appFileUri = vscode.Uri.joinPath(appFolderUri, appJson);
        const appJsonString = JSON.stringify(jsonContent, null, 4);
        const content = new TextEncoder().encode(appJsonString);
        await vscode.workspace.fs.writeFile(appFileUri, content);
        this.logger.debug(`Generated ${appJson} at '${appFileUri.fsPath}'.`);
    }

    private async generateIndexHtml(extension: vscode.Extension<unknown>, appFolderUri: vscode.Uri): Promise<void> {
        const indexHtml = "index.html";
        const indexHtmlTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "index.html.template");
        await vscode.workspace.fs.copy(indexHtmlTemplateFileUri, vscode.Uri.joinPath(appFolderUri, indexHtml));
    }

    private async generateGulpfileJs(extension: vscode.Extension<unknown>, appFolderUri: vscode.Uri): Promise<void> {
        const gulpfileJs = "gulpfile.js";
        const gulpfileTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "gulpfile.js.template");
        await vscode.workspace.fs.copy(gulpfileTemplateFileUri, vscode.Uri.joinPath(appFolderUri, gulpfileJs));
    }

    private async generateStartJs(extension: vscode.Extension<unknown>, appFolderUri: vscode.Uri): Promise<void> {
        const startJs = "start.js";
        const startTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "start.js.template");
        await vscode.workspace.fs.copy(startTemplateFileUri, vscode.Uri.joinPath(appFolderUri, startJs));
    }

    private async generateReadmeMd(extension: vscode.Extension<unknown>, appFolderUri: vscode.Uri): Promise<void> {
        const readmeMd = "README.md";
        const readmeTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "README.md.template");
        await vscode.workspace.fs.copy(readmeTemplateFileUri, vscode.Uri.joinPath(appFolderUri, readmeMd));
    }

    private async generateAgentsMd(extension: vscode.Extension<unknown>, appFolderUri: vscode.Uri): Promise<void> {
        const agentsMd = "AGENTS.md";
        const agentsTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "AGENTS.md.template");
        await vscode.workspace.fs.copy(agentsTemplateFileUri, vscode.Uri.joinPath(appFolderUri, agentsMd));
    }

    private async generateCopilotInstructions(extension: vscode.Extension<unknown>, appFolderUri: vscode.Uri): Promise<void> {
        const copilotInstructionsMd = "copilot-instructions.md";
        const agentsTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "AGENTS.md.template");

        // create a folder named .github if not exist in the current workspace.
        const githubFolderUri = vscode.Uri.joinPath(appFolderUri, ".github");
        await vscode.workspace.fs.createDirectory(githubFolderUri);

        // copy the agents.md to the .github folder and rename it to copilot-instructions.md
        await vscode.workspace.fs.copy(agentsTemplateFileUri, vscode.Uri.joinPath(githubFolderUri, copilotInstructionsMd));
    }

    private async generateGitignore(extension: vscode.Extension<unknown>, appFolderUri: vscode.Uri): Promise<void> {
        const gitignore = ".gitignore";
        const gitignoreTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", ".gitignore.template");
        await vscode.workspace.fs.copy(gitignoreTemplateFileUri, vscode.Uri.joinPath(appFolderUri, gitignore));
    }

    private async generatePackageJson(extension: vscode.Extension<unknown>, appFolderUri: vscode.Uri, appName: string, appVersion: string, appProvider: string): Promise<void> {
        const packageJson = "package.json";
        const packageTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "package.json.template");
        const packageTemplateContent = await vscode.workspace.fs.readFile(packageTemplateFileUri);
        const packageTemplateContentString = new TextDecoder().decode(packageTemplateContent);
        const command = "node start.js";
        const packageContent = packageTemplateContentString.replace(/<%= ID %>/g, appName).replace(/<%= version %>/g, appVersion).replace(/<%= command %>/g, command).replace(/<%= provider %>/g, appProvider);
        const packageContentEncoded = new TextEncoder().encode(packageContent);
        await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(appFolderUri, packageJson), packageContentEncoded);
    }

    private async generateReferences(extension: vscode.Extension<unknown>, appFolderUri: vscode.Uri): Promise<void> {
        const referencesFolderUri = vscode.Uri.joinPath(appFolderUri, "References");
        await vscode.workspace.fs.createDirectory(referencesFolderUri);

        const targetDocumentFolderUri = vscode.Uri.joinPath(extension.extensionUri, "references", "document");
        const documentLinkUri = vscode.Uri.joinPath(referencesFolderUri, "document");
        await linkFolder(targetDocumentFolderUri.fsPath, documentLinkUri.fsPath);

        const targetSDKFolderUri = vscode.Uri.joinPath(extension.extensionUri, "references", "sbo-webclient-uiapi-sdk");
        const sdkLinkUri = vscode.Uri.joinPath(referencesFolderUri, "sbo-webclient-uiapi-sdk");
        await linkFolder(targetSDKFolderUri.fsPath, sdkLinkUri.fsPath);

        const targetSchemaFolderUri = vscode.Uri.joinPath(extension.extensionUri, "schema");
        const schemaLinkUri = vscode.Uri.joinPath(referencesFolderUri, "schema");
        await linkFolder(targetSchemaFolderUri.fsPath, schemaLinkUri.fsPath);
    }

    private async generateModules(
        appMeta: AppMeta,
        extension: vscode.Extension<unknown>,
        appFolderUri: vscode.Uri,
        appProvider: string,
        appName: string,
        modules: AppModuleMeta[]
    ): Promise<void> {
        const tsconfigJson = "tsconfig.json";
        const tsconfigTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "module", "tsconfig.json.template");
        const controllerTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "module", "controller.ts.template");
        const controllerTemplateContent = await vscode.workspace.fs.readFile(controllerTemplateFileUri);
        const controllerTemplateContentString = new TextDecoder().decode(controllerTemplateContent);
        const utilityTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "module", "utility.ts.template");
        const utilityTemplateContent = await vscode.workspace.fs.readFile(utilityTemplateFileUri);
        const modelsTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "module", "models.ts.template");
        const modelsTemplateContent = await vscode.workspace.fs.readFile(modelsTemplateFileUri);
        const i18nEnPropertiesTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "module", "i18n_en.properties.template");
        const i18nEnPropertiesTemplateContent = await vscode.workspace.fs.readFile(i18nEnPropertiesTemplateFileUri);
        const i18nPropertiesTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "module", "i18n.properties.template");
        const i18nPropertiesTemplateContent = await vscode.workspace.fs.readFile(i18nPropertiesTemplateFileUri);
        const layoutJsonTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, "template", "module", "layout.json.template");
        const layoutJsonTemplateContent = await vscode.workspace.fs.readFile(layoutJsonTemplateFileUri);
        const layoutJsonTemplateContentString = new TextDecoder().decode(layoutJsonTemplateContent);

        for (const module of modules) {
            const namespace = `${appProvider}.${appName}.${module.moduleName}`;
            this.logger.info(`Generating module '${module.moduleName}' with ${module.views.length} views.`);

            const moduleFolderUri = vscode.Uri.joinPath(appFolderUri, module.moduleName);
            await vscode.workspace.fs.createDirectory(moduleFolderUri);
            await vscode.workspace.fs.copy(tsconfigTemplateFileUri, vscode.Uri.joinPath(moduleFolderUri, tsconfigJson));

            const srcFolderUri = vscode.Uri.joinPath(moduleFolderUri, "src");
            await vscode.workspace.fs.createDirectory(srcFolderUri);

            const manifestJson = "manifest.json";
            const manifestContent = this.generateManifestJson(appMeta, module);
            const manifestContentEncoded = new TextEncoder().encode(manifestContent);
            await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(srcFolderUri, manifestJson), manifestContentEncoded);

            const controllerFolderUri = vscode.Uri.joinPath(srcFolderUri, "controller");
            await vscode.workspace.fs.createDirectory(controllerFolderUri);
            for (const view of module.views) {
                const controllerTs = `${view.viewName}.ts`;
                const controllerContent = controllerTemplateContentString.replace(/<%= viewName %>/g, view.viewName);
                const controllerContentEncoded = new TextEncoder().encode(controllerContent);
                await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(controllerFolderUri, controllerTs), controllerContentEncoded);
            }
            await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(controllerFolderUri, "utility.ts"), utilityTemplateContent);

            const modelFolderUri = vscode.Uri.joinPath(srcFolderUri, "model");
            await vscode.workspace.fs.createDirectory(modelFolderUri);
            await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(modelFolderUri, "models.ts"), modelsTemplateContent);

            const i18nFolderUri = vscode.Uri.joinPath(srcFolderUri, "i18n");
            await vscode.workspace.fs.createDirectory(i18nFolderUri);
            await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(i18nFolderUri, "i18n_en.properties"), i18nEnPropertiesTemplateContent);
            await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(i18nFolderUri, "i18n.properties"), i18nPropertiesTemplateContent);

            const layoutFolderUri = vscode.Uri.joinPath(srcFolderUri, "layout");
            await vscode.workspace.fs.createDirectory(layoutFolderUri);
            for (const view of module.views) {
                const layoutJson = `${view.viewName}.layout.json`;
                const layoutJsonContent = layoutJsonTemplateContentString.replace(/<%= viewName %>/g, view.viewName)
                    .replace(/<%= namespace %>/g, namespace)
                    .replace(/<Add existing control's stable ID>/g, view.sampleControlUuid);
                const layoutJsonContentEncoded = new TextEncoder().encode(layoutJsonContent);
                await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(layoutFolderUri, layoutJson), layoutJsonContentEncoded);
            }
        }
    }

    public async createApp(appMeta: AppMeta, folderUri: vscode.Uri): Promise<string> {
        const appName = appMeta.appName;
        const appProvider = appMeta.appProvider ? appMeta.appProvider : 'SAPBusinessOne';
        const appVersion = appMeta.appVersion ? appMeta.appVersion : '1.0.0';
        const modules = this.getAppModules(appMeta);

        this.logger.info(`Creating app '${appProvider}.${appName}' version '${appVersion}' in '${folderUri.fsPath}'.`);
        this.logger.debug(`CreateApp input summary: modules=${modules.length}`);
        if (modules.length === 0) {
            const errorMessage = `Invalid app metadata for '${appProvider}.${appName}': modules cannot be empty.`;
            this.logger.error(errorMessage);
            throw new Error(errorMessage);
        }

        try {
            const appFolderUri = vscode.Uri.joinPath(folderUri, appName);
            await vscode.workspace.fs.createDirectory(appFolderUri);

            const vscodeFolderUri = vscode.Uri.joinPath(appFolderUri, ".vscode");
            await vscode.workspace.fs.createDirectory(vscodeFolderUri);

            await this.generateLaunchJson(appMeta, vscodeFolderUri);
            await this.generateSettings(vscodeFolderUri);
            await this.generateTasksJson(vscodeFolderUri);
            await this.generateAppJson(appMeta, appFolderUri);

            const extension = getCurrentExtension();
            await this.generateIndexHtml(extension, appFolderUri);
            await this.generateGulpfileJs(extension, appFolderUri);
            await this.generateStartJs(extension, appFolderUri);
            await this.generateReadmeMd(extension, appFolderUri);
            await this.generateGitignore(extension, appFolderUri);
            await this.generatePackageJson(extension, appFolderUri, appName, appVersion, appProvider);

            await this.generateMtaYaml(appMeta, appFolderUri);
            await this.generateModules(appMeta, extension, appFolderUri, appProvider, appName, modules);
            await this.generateReferences(extension, appFolderUri);
            await this.generateAgentsMd(extension, appFolderUri);
            await this.generateCopilotInstructions(extension, appFolderUri);

            this.logger.info(`App generation completed successfully at '${appFolderUri.fsPath}'.`);
        } catch (error) {
            this.logger.error(`Failed to create app '${appProvider}.${appName}': ${this.formatError(error)}`);
            vscode.window.showErrorMessage(`Error creating file or folder: ${error}`);
        }
        return `Successfully Created Web Client UI API application`;
    }

    public async addModuleToExistingApp(appMeta: AppMeta, folderUri: vscode.Uri): Promise<string> {
        const appName = appMeta.appName;
        const appProvider = appMeta.appProvider;
        const appVersion = appMeta.appVersion;
        const modules = this.getAppModules(appMeta);

        if (modules.length !== 1) {
            const errorMessage = 'Invalid app metadata: exactly one module is required for addModuleToExistingApp.';
            this.logger.error(errorMessage);
            throw new Error(errorMessage);
        }

        const module = modules[0];
        this.logger.info(`Adding module '${module.moduleName}' to existing app '${appProvider}.${appName}'.`);

        try {
            const appJsonUri = vscode.Uri.joinPath(folderUri, 'app.json');
            const appJsonRaw = await vscode.workspace.fs.readFile(appJsonUri);
            const appJsonObj = JSON.parse(new TextDecoder().decode(appJsonRaw)) as { applications?: Array<{ name?: string; path?: string }> };
            if (!Array.isArray(appJsonObj.applications)) {
                throw new Error('Invalid app.json format: missing applications array.');
            }

            const newApplicationName = `${appProvider}.${appName}.${module.moduleName}`;
            const alreadyExists = appJsonObj.applications.some((application) => application.name === newApplicationName);
            if (alreadyExists) {
                throw new Error(`Module '${module.moduleName}' already exists in app.json.`);
            }

            appJsonObj.applications.push({
                name: newApplicationName,
                path: `${appName}_${appVersion}/${module.moduleName}/webapp`
            });
            await vscode.workspace.fs.writeFile(appJsonUri, new TextEncoder().encode(JSON.stringify(appJsonObj, null, 4)));

            const extension = getCurrentExtension();
            await this.generateModules(appMeta, extension, folderUri, appProvider, appName, modules);
            await this.appendMtaYamlModule(module.moduleName, folderUri);

            const vscodeFolderUri = vscode.Uri.joinPath(folderUri, '.vscode');
            await vscode.workspace.fs.createDirectory(vscodeFolderUri);
            await this.appendLaunchJsonConfigurations(appMeta, vscodeFolderUri);
        } catch (error) {
            this.logger.error(`Failed to add module '${module.moduleName}': ${this.formatError(error)}`);
            vscode.window.showErrorMessage(`Error adding module: ${error}`);
            throw error;
        }

        return `Successfully added module '${module.moduleName}' to Web Client UI API application`;
    }

    public async addViewToExistingModule(appMeta: AppMeta, folderUri: vscode.Uri): Promise<string> {
        const modules = this.getAppModules(appMeta);
        if (modules.length !== 1) {
            const errorMessage = 'Invalid app metadata: exactly one module is required for addViewToExistingModule.';
            this.logger.error(errorMessage);
            throw new Error(errorMessage);
        }

        const module = modules[0];
        if (module.views.length !== 1) {
            const errorMessage = 'Invalid app metadata: exactly one view is required for addViewToExistingModule.';
            this.logger.error(errorMessage);
            throw new Error(errorMessage);
        }

        const view = module.views[0];
        this.logger.info(`Adding view '${view.viewName}' to module '${module.moduleName}'.`);

        try {
            const extension = getCurrentExtension();
            const moduleSrcUri = vscode.Uri.joinPath(folderUri, module.moduleName, 'src');
            const manifestUri = vscode.Uri.joinPath(moduleSrcUri, 'manifest.json');

            const manifestRaw = await vscode.workspace.fs.readFile(manifestUri);
            const manifestObj = JSON.parse(new TextDecoder().decode(manifestRaw)) as {
                name?: string;
                [key: string]: unknown;
            };

            if (typeof manifestObj.name !== 'string' || manifestObj.name.trim().length === 0) {
                throw new Error(`Invalid manifest.json in module '${module.moduleName}': missing name.`);
            }
            const namespace = manifestObj.name;

            const bundlesValue = manifestObj['b1.bundles'];
            const bundles = Array.isArray(bundlesValue) ? bundlesValue as Array<{ id?: string }> : [];
            const newBundleId = `${view.viewName}.layout`;
            if (bundles.some((bundle) => bundle?.id === newBundleId)) {
                throw new Error(`View '${view.viewName}' already exists in module '${module.moduleName}'.`);
            }

            const controllerFolderUri = vscode.Uri.joinPath(moduleSrcUri, 'controller');
            const layoutFolderUri = vscode.Uri.joinPath(moduleSrcUri, 'layout');
            await vscode.workspace.fs.createDirectory(controllerFolderUri);
            await vscode.workspace.fs.createDirectory(layoutFolderUri);

            const controllerUri = vscode.Uri.joinPath(controllerFolderUri, `${view.viewName}.ts`);
            const layoutUri = vscode.Uri.joinPath(layoutFolderUri, `${view.viewName}.layout.json`);
            if (await this.fileExists(controllerUri)) {
                throw new Error(`Controller file already exists: ${controllerUri.fsPath}`);
            }
            if (await this.fileExists(layoutUri)) {
                throw new Error(`Layout file already exists: ${layoutUri.fsPath}`);
            }

            const controllerTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, 'template', 'module', 'controller.ts.template');
            const controllerTemplateContent = await vscode.workspace.fs.readFile(controllerTemplateFileUri);
            const controllerTemplateString = new TextDecoder().decode(controllerTemplateContent);
            const controllerContent = controllerTemplateString.replace(/<%= viewName %>/g, view.viewName);
            await vscode.workspace.fs.writeFile(controllerUri, new TextEncoder().encode(controllerContent));

            const layoutTemplateFileUri = vscode.Uri.joinPath(extension.extensionUri, 'template', 'module', 'layout.json.template');
            const layoutTemplateContent = await vscode.workspace.fs.readFile(layoutTemplateFileUri);
            const layoutTemplateString = new TextDecoder().decode(layoutTemplateContent);
            const layoutContent = layoutTemplateString
                .replace(/<%= viewName %>/g, view.viewName)
                .replace(/<%= namespace %>/g, namespace)
                .replace(/<Add existing control's stable ID>/g, view.sampleControlUuid);
            await vscode.workspace.fs.writeFile(layoutUri, new TextEncoder().encode(layoutContent));

            const i18nKey = `${namespace}.i18n.i18n`;
            const updatedBundles = [
                ...bundles,
                {
                    id: newBundleId,
                    baseViewGuid: view.baseViewUUID,
                    layout: `layout/${view.viewName}.layout.json`,
                    description: view.viewName,
                    i18n: {
                        '@@i18n': [i18nKey]
                    }
                }
            ];

            manifestObj['b1.bundles'] = updatedBundles;
            await vscode.workspace.fs.writeFile(manifestUri, new TextEncoder().encode(JSON.stringify(manifestObj, null, 2)));

            const vscodeFolderUri = vscode.Uri.joinPath(folderUri, '.vscode');
            await vscode.workspace.fs.createDirectory(vscodeFolderUri);
            await this.appendLaunchJsonConfigurations(appMeta, vscodeFolderUri);
        } catch (error) {
            this.logger.error(`Failed to add view '${view.viewName}' to module '${module.moduleName}': ${this.formatError(error)}`);
            vscode.window.showErrorMessage(`Error adding view: ${error}`);
            throw error;
        }

        return `Successfully added view '${view.viewName}' to module '${module.moduleName}'`;
    }
}