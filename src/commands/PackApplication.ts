import * as vscode from 'vscode';
import * as path from 'path';
import { executeTerminalCommand, isNpmInstallNeeded, waitForShellIntegration } from '../utils/Utils';
import { getClassLogger } from '../logger/LoggerWrapper';
import { UiApiCommandLiterals } from './UiApiCommandLiterals';

export async function packApplication(
	stream: vscode.ChatResponseStream,
	packageCommand: string = UiApiCommandLiterals.PACKAGE_CHAT_COMMAND
): Promise<{ metadata: { command: string; status?: 'success' | 'failed' } }> {
	const logger = getClassLogger(packApplication.name);
	const userTerminalWarningMessage = 'Failed to prepare packaging terminal.';
	const userPackagingWarningMessage = 'Packaging failed.';
	const logPackagingError = (stage: string, details: string) => {
		logger.error(`Packaging failed at '${stage}'. Details: ${details}`);
	};

	logger.info('Packaging command received.');
	stream.progress("Starting extension package...");

	const terminalName = 'Web Client UI API Package';
	let terminal = vscode.window.terminals.find(terminal => terminal.name === terminalName);
	if (terminal) {
		terminal.dispose();
	}

	stream.progress("Creating terminal...");
	try {
		terminal = vscode.window.createTerminal(terminalName);
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : String(e);
		logPackagingError('create terminal', errorMessage);
		await vscode.window.showErrorMessage(userTerminalWarningMessage);
		return { metadata: { command: packageCommand, status: 'failed' } };
	}
	terminal.show();
	try {
		await waitForShellIntegration(terminal);
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : String(e);
		logPackagingError('terminal shell integration', errorMessage);
		await vscode.window.showErrorMessage(userTerminalWarningMessage);
		return { metadata: { command: packageCommand, status: 'failed' } };
	}

	if (await isNpmInstallNeeded()) {
		stream.progress("Dependencies are missing or outdated. Running `npm install` before packaging...");
		let installResult = '';
		try {
			installResult = await executeTerminalCommand(terminal, "npm install");
		} catch (e) {
			installResult = `npm ERR! ${e instanceof Error ? e.message : String(e)}`;
		}
		if (installResult.includes('npm ERR!')) {
			logPackagingError('npm install', installResult);
			stream.markdown('Dependency installation failed. Please check the terminal output.');
			await vscode.window.showErrorMessage(userPackagingWarningMessage);
			return { metadata: { command: packageCommand, status: 'failed' } };
		}
	}

	const command = "mbt build";
	stream.progress(`Invoking command \`${command}\`...`);
	let terminalResult = '';
	try {
		terminalResult = await executeTerminalCommand(terminal, command);
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : String(e);
		logPackagingError(command, errorMessage);
		await vscode.window.showErrorMessage(userPackagingWarningMessage);
		return { metadata: { command: packageCommand, status: 'failed' } };
	}

	const MTAR_PREFIX = "MTA archive generated at:";
	const start = terminalResult.lastIndexOf(MTAR_PREFIX);
	if (start !== -1) {
		const end = terminalResult.indexOf('\n', start + 1);
		const output = terminalResult.substring(start, end === -1 ? terminalResult.length : end).replace(/\r$/, '');
		logger.info(`Packaging output: ${output}`);
		const mtarFile = output.substring(MTAR_PREFIX.length).trim();
		const mtarFileName = path.basename(mtarFile);
		const fileUri: vscode.Uri = vscode.Uri.file(mtarFile);
		stream.reference(fileUri);
		logger.info(`Packaging completed. MTAR generated at ${mtarFile}.`);
		stream.markdown(`Build Successfully. You can find the MTAR archive \`${mtarFileName}\` generated [here](${fileUri.toString()}) in the Explorer.`);
	} else {
		logger.error('Packaging failed. MTAR location marker not found in output.', terminalResult);
		stream.markdown('Build failed. Please check the terminal output for `mbt build`.');
		return { metadata: { command: packageCommand, status: 'failed' } };
	}
	return { metadata: { command: packageCommand, status: 'success' } };
}
