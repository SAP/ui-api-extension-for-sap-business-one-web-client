import * as vscode from 'vscode';
import { executeTerminalCommand, getDevServerURL, isDevServerRunning, isNpmInstallNeeded, waitForShellIntegration } from '../utils/Utils';
import { getClassLogger } from '../logger/LoggerWrapper';
import { UiApiCommandLiterals } from './UiApiCommandLiterals';


export async function startDevServer(
	stream: vscode.ChatResponseStream,
	startCommand: string = UiApiCommandLiterals.START_CHAT_COMMAND
): Promise<{ metadata: { command: string; status?: 'success' | 'failed' } }> {
	const logger = getClassLogger(startDevServer.name);
	const userErrorMessage = 'Failed to prepare development server terminal.';
	const logStartServerError = (stage: string, details: string) => {
		logger.error(`Start development server failed at '${stage}'. Details: ${details}`);
	};
	logger.info('Start development server command received.');

	stream.progress(`Starting development server...`);
	if (await isDevServerRunning()) {
		stream.markdown(`Development server is already running at: ${getDevServerURL()}.`);
		return { metadata: { command: startCommand, status: "success" } };
	}

	const terminalName = 'Web Client UI API Development Server';
	let terminal = vscode.window.terminals.find(terminal => terminal.name === terminalName);
	if (terminal) {
		terminal.dispose();
		vscode.debug.stopDebugging();
	}

	stream.progress("Creating terminal...");
	try {
		terminal = vscode.window.createTerminal(terminalName);
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : String(e);
		logStartServerError('create terminal', errorMessage);
		await vscode.window.showErrorMessage(userErrorMessage);
		return { metadata: { command: startCommand, status: 'failed' } };
	}
	terminal.show();

	try {
		await waitForShellIntegration(terminal);
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : String(e);
		logStartServerError('terminal shell integration', errorMessage);
		await vscode.window.showErrorMessage(userErrorMessage);
		return { metadata: { command: startCommand, status: 'failed' } };
	}

	if (await isNpmInstallNeeded()) {
		stream.progress("Dependencies are missing or outdated. Running `npm install` before starting the development server...");
		let installResult = '';
		try {
			installResult = await executeTerminalCommand(terminal, "npm install");
		} catch (e) {
			installResult = `npm ERR! ${e instanceof Error ? e.message : String(e)}`;
		}
		if (installResult.includes('npm ERR!')) {
			logStartServerError('npm install', installResult);
			stream.markdown('Dependency installation failed. Please check the terminal output.');
			await vscode.window.showErrorMessage('Dependency installation failed.');
			return { metadata: { command: startCommand, status: 'failed' } };
		}
	}

	const command = "npm start";
	stream.progress(`Invoking command \`${command}\`...`);
	terminal.sendText(command, true);

	let isSuccess = false;
	const timeout = 30000;
	const interval = 1000;
	const start = Date.now();
	stream.progress("Waiting for server to accept requests...");
	while (Date.now() - start < timeout) {
		try {
			if (await isDevServerRunning()) {
				isSuccess = true;
				break;
			}
		} catch {
			// server not ready yet, keep polling
		}
		await new Promise(r => setTimeout(r, interval));
	}

	if (!isSuccess) {
		const errorMessage = `Development Server start failed!`;
		logStartServerError('npm start', errorMessage);
		stream.markdown(errorMessage);
	} else {
		const httpServer = getDevServerURL();
		stream.markdown(`Development server started. Access the server at: ${httpServer}.`);
	}
	return { metadata: { command: startCommand, status: isSuccess ? 'success' : 'failed' } };
}
