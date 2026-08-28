import * as vscode from 'vscode';
import { executeTerminalCommand, getDevServerURL, isDevServerRunning, isNpmInstallNeeded, waitForShellIntegration } from '../utils/Utils';
import { getClassLogger } from '../logger/LoggerWrapper';
import { UiApiCommandLiterals } from './UiApiCommandLiterals';


const dev_server_terminal_name = 'Web Client UI API Development Server';

export async function startDevServer(
	stream: vscode.ChatResponseStream,
	startCommand: string = UiApiCommandLiterals.START_CHAT_COMMAND
): Promise<{ metadata: { command: string; status?: 'success' | 'failed' } }> {
	const logger = getClassLogger(startDevServer.name);
	const userWarningMessage = 'Failed to prepare development server terminal.';
	const logStartServerError = (stage: string, details: string) => {
		logger.error(`Start development server failed at '${stage}'. Details: ${details}`);
	};

	logger.info('Start development server command received.');
	stream.progress("Checking if development server is already running...");
	if (await isDevServerRunning()) {
		logger.info(`Development server already running at ${getDevServerURL()}.`);
		stream.markdown(`Development server is already running at: ${getDevServerURL()}.`);
		return { metadata: { command: startCommand } };
	}

	stream.progress("Starting development server...");
	let terminal = vscode.window.terminals.find(terminal => terminal.name === dev_server_terminal_name);
	if (terminal) {
		terminal.dispose();
		vscode.debug.stopDebugging();
	}

	stream.progress("Creating terminal...");
	try {
		terminal = vscode.window.createTerminal(dev_server_terminal_name);
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : String(e);
		logStartServerError('create terminal', errorMessage);
		await vscode.window.showWarningMessage(userWarningMessage);
		return { metadata: { command: startCommand, status: 'failed' } };
	}
	terminal.show();
	try {
		await waitForShellIntegration(terminal);
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : String(e);
		logStartServerError('wait for shell integration', errorMessage);
		await vscode.window.showWarningMessage(userWarningMessage);
		return { metadata: { command: startCommand } };
	}

	if (await isNpmInstallNeeded()) {
		logger.info('Detected missing or outdated dependencies; running npm install.');
		stream.progress("Dependencies are missing or outdated. Running `npm install` before starting the development server...");
		const installCommand = "npm install";
		let installResult = '';
		try {
			installResult = await executeTerminalCommand(terminal, installCommand);
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : String(e);
			logger.error(`Failed to execute npm install: ${errorMessage}`);
			stream.markdown(`Dependency installation failed: ${errorMessage}`);
			return { metadata: { command: startCommand, status: 'failed' } };
		}

		if (installResult.includes('npm ERR!')) {
			logger.error('npm install failed while preparing development server.');
			stream.markdown('Dependency installation failed. Please check the terminal output for `npm install`.');
			return { metadata: { command: startCommand, status: 'failed' } };
		}
		logger.info('npm install completed successfully.');
	}

	const command = "npm start";
	stream.progress(`Invoking command \`${command}\`...`);
	terminal.sendText(command, true);

	let isSuccess = false;
	stream.progress("Waiting for server to accept requests...");
	const timeout = 30000;
	const interval = 1000;
	const start = Date.now();
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
		logger.error('Development server failed to start within timeout window.');
		stream.markdown(`Development Server start failed!`);
	} else {
		const httpServer = getDevServerURL();
		logger.info(`Development server started successfully at ${httpServer}.`);
		stream.markdown(`Development server started. Access the server at: ${httpServer}.`);
	}
	return { metadata: { command: startCommand, status: isSuccess ? 'success' : 'failed' } };
}
