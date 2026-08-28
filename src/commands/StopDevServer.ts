import * as vscode from 'vscode';
import { debug } from 'vscode';
import { execCommand, findProcessesUsingPort, getDevServerPort, getDevServerURL, isDevServerRunning } from '../utils/Utils';
import { getClassLogger } from '../logger/LoggerWrapper';
import { UiApiCommandLiterals } from './UiApiCommandLiterals';

const dev_server_terminal_name = 'Web Client UI API Development Server';

async function forceStopDevServer(): Promise<{ success: boolean; pids: number[]; }> {
	const logger = getClassLogger(forceStopDevServer.name);
	const pids = await findProcessesUsingPort(getDevServerPort());
	if (!pids.length) {
		logger.info('Force stop requested, but no process is bound to the development server port.');
		return { success: false, pids: [] };
	}
	logger.warn(`Attempting force stop for PID(s): ${pids.join(', ')}.`);

	if (process.platform === 'win32') {
		for (const pid of pids) {
			await execCommand('taskkill', ['/PID', String(pid), '/F']);
		}
	} else {
		for (const pid of pids) {
			try {
				process.kill(pid, 'SIGKILL');
			} catch {
				// Ignore failures and verify shutdown by probing the server afterwards.
			}
		}
	}

	const success = !(await isDevServerRunning());
	if (success) {
		logger.info('Force stop completed successfully.');
	} else {
		logger.error('Force stop attempt completed, but development server is still running.');
	}
	return { success, pids };
}

export async function stopDevServer(
	stream: vscode.ChatResponseStream,
	stopCommand: string = UiApiCommandLiterals.STOP_CHAT_COMMAND
): Promise<{ metadata: { command: string } }> {
	const logger = getClassLogger(stopDevServer.name);
	logger.info('Stop development server command received.');
	const terminal = vscode.window.terminals.find(terminal => terminal.name === dev_server_terminal_name);
	const isRunning = await isDevServerRunning();

	if (!terminal && !isRunning) {
		logger.info('Stop requested while development server is not running.');
		stream.markdown("Development Server is not running.");
		return { metadata: { command: stopCommand } };
	}

	stream.progress("Stopping development server...");
	terminal?.dispose();
	debug.stopDebugging();

	const timeout = 3000;
	const interval = 1000;
	const start = Date.now();

	while (Date.now() - start < timeout) {
		if (!await isDevServerRunning()) {
			logger.info('Development server stopped gracefully.');
			stream.markdown("Development Server is stopped.");
			return { metadata: { command: stopCommand } };
		}

		await new Promise(resolve => setTimeout(resolve, interval));
	}

	stream.progress("Normal shutdown did not finish. Trying a force stop by killing the process bound to the dev-server port...");
	const forceStopResult = await forceStopDevServer();
	if (forceStopResult.success) {
		logger.info(`Development server forcefully stopped. PID(s): ${forceStopResult.pids.join(', ')}.`);
		stream.markdown(`Development Server is forcefully stopped. Killed process ID(s): ${forceStopResult.pids.join(', ')}.`);
		return { metadata: { command: stopCommand } };
	}

	logger.error(`Development server stop failed; endpoint still reachable at ${getDevServerURL()}.`);
	stream.markdown(`Development Server stop failed. The server is still responding at: ${getDevServerURL()}.`);
	return { metadata: { command: stopCommand } };
}
