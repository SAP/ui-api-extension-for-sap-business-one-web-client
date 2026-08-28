import * as path from 'path';
import * as vscode from 'vscode';
import { execCommand, getCurrentExtension } from '../utils/Utils';
import { getClassLogger } from '../logger/LoggerWrapper';

function resolveGlobalNodeModules(prefix: string): string {
    const libNodeModules = path.join(prefix, 'lib', 'node_modules');
    if (process.platform !== 'win32') {
        return libNodeModules;
    }

    // npm on Windows usually uses <prefix>/node_modules.
    return path.join(prefix, 'node_modules');
}

export async function installSdkToGlobalNodeModules(forceInstall = true): Promise<void> {
    const logger = getClassLogger(installSdkToGlobalNodeModules.name);
    const userErrorMessage = 'Failed to install Web Client UIAPI SDK.';
    const logInstallError = (stage: string, details: string) => {
        logger.error(`Install SDK to global node_modules failed at '${stage}'. Details: ${details}`);
    };

    logger.info('Install SDK to global node_modules command received.');
    const commandResult = await execCommand('npm', ['prefix', '-g']);
    if (commandResult.exitCode !== 0 || !commandResult.stdout) {
        const details = commandResult.stderr || 'Unable to resolve global npm prefix.';
        logInstallError('resolve npm global prefix', `exitCode=${commandResult.exitCode}, stderr=${details}`);
        vscode.window.showErrorMessage(userErrorMessage);
        return;
    }

    const prefix = commandResult.stdout.split(/\r?\n/).filter(Boolean).pop()?.trim();
    if (!prefix) {
        logInstallError('parse npm global prefix', `stdout=${commandResult.stdout}`);
        vscode.window.showErrorMessage(userErrorMessage);
        return;
    }

    const globalNodeModulesPath = resolveGlobalNodeModules(prefix);
    logger.info(`Resolved npm global node_modules path: ${globalNodeModulesPath}`);
    const globalNodeModulesUri = vscode.Uri.file(globalNodeModulesPath);
    const sdkTargetUri = vscode.Uri.joinPath(globalNodeModulesUri, 'sbo-webclient-uiapi-sdk');

    try {
        let globalNodeModulesExists = false;
        try {
            await vscode.workspace.fs.stat(globalNodeModulesUri);
            globalNodeModulesExists = true;
        } catch {
            // stat throws if path does not exist
        }

        let sdkTargetExists = false;
        if (!globalNodeModulesExists) {
            await vscode.workspace.fs.createDirectory(globalNodeModulesUri);
        } else {
            try {
                await vscode.workspace.fs.stat(sdkTargetUri);
                sdkTargetExists = true;
            } catch {
                // stat throws if path does not exist
            }

            if (sdkTargetExists && !forceInstall) {
                logger.info('Global node_modules directory already exists. Skipping SDK installation.');
                return;
            }
        }

        if(sdkTargetExists) {
            await vscode.workspace.fs.delete(sdkTargetUri, { recursive: true, useTrash: false });
        }

        const extension = getCurrentExtension();
        const sdkSourceUri = vscode.Uri.joinPath(extension.extensionUri, 'references', 'sbo-webclient-uiapi-sdk');
        await vscode.workspace.fs.copy(sdkSourceUri, sdkTargetUri, { overwrite: true });

        logger.info(`Web Client UIAPI SDK installed successfully: ${sdkTargetUri.fsPath}`);
        vscode.window.showInformationMessage(`Web Client UIAPI SDK installed successfully.`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logInstallError('install SDK to global node_modules', `path=${sdkTargetUri.fsPath}, error=${errorMessage}`);
        vscode.window.showErrorMessage(userErrorMessage);
    }
}
