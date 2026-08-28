import * as vscode from 'vscode';
import { getClassLogger } from '../logger/LoggerWrapper';

export async function createWorkspaceIfNotExist(): Promise<string | undefined> {
	const logger = getClassLogger(createWorkspaceIfNotExist.name);
	const userErrorMessage = 'Failed to create workspace.';
	const logCreateWorkspaceError = (stage: string, details: string) => {
		logger.error(`Create workspace failed at '${stage}'. Details: ${details}`);
	};

	logger.info('Create workspace command received.');
	try {
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (workspaceFolder) {
			// Check if the workspace is empty by checking if there are any files or folders.
			const files = await vscode.workspace.fs.readDirectory(workspaceFolder.uri);
			if (files.length > 0) {
				logger.info(`Current workspace folder is not empty: ${workspaceFolder.uri.fsPath}`);
				const selection = await vscode.window.showWarningMessage(
					'The current workspace folder is not empty. Are you sure you want to create the UI API application in the current folder?',
					{ modal: true },
					'Yes, create in current folder',
					'No, let me choose another folder'
				);
				if (selection === 'Yes, create in current folder') {
					logger.info('User confirmed creation in current non-empty workspace folder.');
					return workspaceFolder.uri.fsPath;
				}
			} else {
				logger.info(`Current workspace folder is empty and will be used: ${workspaceFolder.uri.fsPath}`);
				return workspaceFolder.uri.fsPath;
			}
		}

		const options: vscode.OpenDialogOptions = {
			canSelectMany: false,
			canSelectFiles: false,
			canSelectFolders: true,
			openLabel: 'Open Workspace Folder'
		};

		const folder = await vscode.window.showOpenDialog(options);

		if (folder && folder.length > 0) {
			logger.info(`User selected workspace folder: ${folder[0].fsPath}`);
			vscode.window.showInformationMessage('Selected folder: ' + folder[0].fsPath);
			vscode.window.showInformationMessage('Creating the workspace...');
			await vscode.commands.executeCommand('vscode.openFolder', folder[0], false);
			return folder[0].fsPath;
		}

		vscode.window.showWarningMessage('No folder selected.');
		logger.warn('No workspace folder selected by user.');
		return undefined;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		logCreateWorkspaceError('create workspace flow', errorMessage);
		vscode.window.showErrorMessage(userErrorMessage);
		return undefined;
	}
}
