import * as vscode from 'vscode';
import { getClassLogger } from '../logger/LoggerWrapper';
import { WEB_CLIENT_URL_PROP } from '../settings/SettingItems';

export async function openWebClientURLSetting(): Promise<void> {
    const logger = getClassLogger(openWebClientURLSetting.name);

    logger.info('Open Web Client URL setting command received.');
    try {
        await vscode.commands.executeCommand('workbench.action.openSettings', WEB_CLIENT_URL_PROP);
        logger.info(`Opened settings navigated to ${WEB_CLIENT_URL_PROP}.`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to open settings for ${WEB_CLIENT_URL_PROP}. Details: ${errorMessage}`);
        vscode.window.showErrorMessage(`Failed to open settings. Please manually navigate to "${WEB_CLIENT_URL_PROP}".`);
    }
}
