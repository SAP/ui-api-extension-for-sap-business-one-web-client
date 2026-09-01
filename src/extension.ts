import * as vscode from 'vscode';
import { registerChatParticipant } from './participant/ChatParticipant';
import { registerChatTools } from './tools/ToolsRegister';
import { disposeToolPromptResources } from './prompt/PromptManager';
import { APP_ROOT_SETTING_PROP, WEB_CLIENT_URL_PROP } from './settings/SettingItems';
import { initializeExtensionMetadata } from './utils/Utils';
import { createLoggerAndSubscribeLogSettingChanges } from "./logger/LoggerCreator";
import { installSdkToGlobalNodeModules } from './commands/InstallSdkToGlobalNodeModules';
import { registerBrowserStartupFlagsWatcher, registerWebClientUrlSettingWatcher, registerDevServerPortWatcher } from './settings/SettingChangesHandler';

function registerDebugConfigurationProvider(context: vscode.ExtensionContext) {
    const debugTypes = ['chrome', 'edge', "editor-browser"];
    debugTypes.forEach(debugType => {
        const provider = vscode.debug.registerDebugConfigurationProvider(debugType, {
            resolveDebugConfiguration(
                _folder: vscode.WorkspaceFolder | undefined,
                config: vscode.DebugConfiguration,
                _token?: vscode.CancellationToken
            ): vscode.ProviderResult<vscode.DebugConfiguration> {
                const appConfig = vscode.workspace.getConfiguration(APP_ROOT_SETTING_PROP);
                const webClientURLSection = WEB_CLIENT_URL_PROP.split('.').slice(1).join('.'); // Extract the section after the root property
                const webClientURL = appConfig.get<string>(webClientURLSection);

                if (!webClientURL) {
                    vscode.window.showErrorMessage(
                        `Please configure "${WEB_CLIENT_URL_PROP}" before debugging.`,
                        { modal: true },
                        'Open Settings'
                    ).then(selection => {
                        if (selection === 'Open Settings') {
                            vscode.commands.executeCommand(
                                'workbench.action.openSettings',
                                WEB_CLIENT_URL_PROP
                            );
                        }
                    });
                    // Return undefined to CANCEL the debug session
                    return undefined;
                }
                // Return config to allow debugging to proceed
                return config;
            }
        });
        context.subscriptions.push(provider);
    });
}

export function activate(context: vscode.ExtensionContext) {
    try {
        createLoggerAndSubscribeLogSettingChanges(context);
    } catch (error) {
        const ERROR_ACTIVATION_FAILED = "Extension activation failed due to Logger configuration failure:";
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(ERROR_ACTIVATION_FAILED, errorMessage);
        return;
    }
    initializeExtensionMetadata(context.extension);
    registerChatParticipant(context);
    registerChatTools(context);
    registerDebugConfigurationProvider(context);
    registerWebClientUrlSettingWatcher(context);
    registerBrowserStartupFlagsWatcher(context);
    registerDevServerPortWatcher(context);
    installSdkToGlobalNodeModules(false);
}
export function deactivate() {
    disposeToolPromptResources();
}
