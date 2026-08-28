import * as vscode from 'vscode';
import * as path from 'path';
import { executeTerminalCommand, waitForShellIntegration } from '../utils/Utils';
import { getClassLogger } from '../logger/LoggerWrapper';
import { UiApiCommandLiterals } from './UiApiCommandLiterals';

export async function packApplication(
	stream: vscode.ChatResponseStream,
	packageCommand: string = UiApiCommandLiterals.PACKAGE_CHAT_COMMAND
): Promise<{ metadata: { command: string; error?: string } }> {
	const logger = getClassLogger(packApplication.name);
	const userTerminalWarningMessage = 'Failed to prepare packaging terminal.';
	const userPackagingWarningMessage = 'Packaging failed.';
	const logPackagingError = (stage: string, details: string) => {
		logger.error(`Packaging failed at '${stage}'. Details: ${details}`);
	};

	logger.info('Packaging command received.');
	stream.progress("Packaging...");

	const name = 'Web Client UIAPI Package';
	let terminal = vscode.window.terminals.find(terminal => terminal.name === name);
	if (!terminal) {
		stream.progress("Creating terminal...");
		try {
			terminal = vscode.window.createTerminal(name);
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : String(e);
			logPackagingError('create packaging terminal', errorMessage);
			await vscode.window.showWarningMessage(userTerminalWarningMessage);
			return { metadata: { command: packageCommand, error: errorMessage } };
		}
		terminal.show();
		try {
			await waitForShellIntegration(terminal);
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : String(e);
			logPackagingError('wait for packaging terminal shell integration', errorMessage);
			await vscode.window.showWarningMessage(userTerminalWarningMessage);
			return { metadata: { command: packageCommand, error: (e as Error).message } };
		}
	}

	stream.progress("Invoking command `mbt build`...");
	const command = "mbt build";
	let terminalResult = '';
	try {
		terminalResult = await executeTerminalCommand(terminal, command);
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : String(e);
		logPackagingError('execute packaging command', errorMessage);
		await vscode.window.showWarningMessage(userPackagingWarningMessage);
		return { metadata: { command: packageCommand, error: errorMessage } };
	}

	const MTAR_PREFIX = "MTA archive generated at:";
	const start = terminalResult.lastIndexOf(MTAR_PREFIX);
	if (start !== -1) {
		let end = terminalResult.indexOf('\n', start + 1);
		if (end === -1) {
			end = terminalResult.length;
		}
		const output = terminalResult.substring(start, end).replace(/\r$/, '');
		logger.info(`Packaging output: ${output}`);
		const mtarFile = output.substring(MTAR_PREFIX.length).trim();
		const mtarFileName = path.basename(mtarFile);
		const fileUri: vscode.Uri = vscode.Uri.file(mtarFile);
		stream.reference(fileUri);
		logger.info(`Packaging completed. MTAR generated at ${mtarFile}.`);
		stream.markdown(`Build Successfully. You can find the MTAR archive \`${mtarFileName}\` generated [here](${fileUri.toString()}) in the Explorer.`);
	} else {
		logger.info('Packaging completed. MTAR location marker not found in output; using default message.');
		stream.markdown("Build Successfully. You can find the MTAR archive in the `mta_archives` folder.");
	}
	return { metadata: { command: packageCommand } };
}
