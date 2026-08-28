import * as vscode from 'vscode';
import { getClassLogger } from '../logger/LoggerWrapper';

export async function openWorkspace(appFolderPath: string): Promise<void> {
	const logger = getClassLogger(openWorkspace.name);
	const userErrorMessage = 'Failed to open workspace.';
	const logOpenWorkspaceError = (stage: string, details: string) => {
		logger.error(`Open workspace failed at '${stage}'. Details: ${details}`);
	};

	logger.info('Open workspace command received.');
	try {
		if (appFolderPath && appFolderPath.length > 0) {
			const appFolderUri = vscode.Uri.file(appFolderPath);
			logger.info(`Opening workspace folder: ${appFolderPath}`);
			await vscode.commands.executeCommand('vscode.openFolder', appFolderUri, false);
		} else {
			logger.warn('Open workspace command called without folder path.');
			vscode.window.showWarningMessage('No folder path provided.');
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		logOpenWorkspaceError('open workspace flow', errorMessage);
		vscode.window.showErrorMessage(userErrorMessage);
	}
}
