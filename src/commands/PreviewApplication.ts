import * as vscode from 'vscode';
import { debug } from 'vscode';
import { getDevServerURL, isDevServerRunning } from '../utils/Utils';
import { getClassLogger } from '../logger/LoggerWrapper';
import { startDevServer } from './StartDevServer';
import { UiApiCommandLiterals } from './UiApiCommandLiterals';
import { WEB_CLIENT_URL_PROP } from '../settings/SettingItems';

export async function previewApplication(
	stream: vscode.ChatResponseStream,
	command: string,
	startCommand: string = UiApiCommandLiterals.START_CHAT_COMMAND
): Promise<{ metadata: { command: string; status?: 'failed' } }> {
	const logger = getClassLogger(previewApplication.name);
	const userErrorMessage = 'Preview failed.';
	const logPreviewError = (stage: string, details: string) => {
		logger.error(`Preview failed at '${stage}'. Details: ${details}`);
	};

	logger.info(`Preview command received: ${command}.`);

	const webClientUrl = vscode.workspace.getConfiguration().get<string>(WEB_CLIENT_URL_PROP);
	if (!webClientUrl) {
		const msg = `The Web Client URL is not configured. Please set it before previewing.`;
		logger.error(msg);
		stream.markdown(msg);
		stream.button({
			command: UiApiCommandLiterals.OPEN_WEB_CLIENT_URL_SETTING_COMMAND_ID,
			arguments: [],
			title: vscode.l10n.t('Set Web Client URL'),
		});
		return { metadata: { command: command, status: 'failed' } };
	}

	stream.progress("Checking if development server is started...");
	if (!await isDevServerRunning()) {
		logger.info('Development server is not running. Triggering start command before preview.');
		stream.progress("Development Server is not running. Starting it before preview...");
		await startDevServer(stream, startCommand);

		if (!await isDevServerRunning()) {
			const errorMessage = `Development Server could not be started at ${getDevServerURL()}.`;
			logger.error(errorMessage);
			stream.markdown(errorMessage);
			await vscode.window.showWarningMessage(errorMessage);
			return { metadata: { command: command, status: "failed" } };
		}
	}
	stream.progress("Development Server is responding. ");

	const launchJson = "launch.json";
	try {
		const vscodeFolderUri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, ".vscode");
		const launchJsonUri = vscode.Uri.joinPath(vscodeFolderUri, launchJson);
		const launchJsonContent = await vscode.workspace.fs.readFile(launchJsonUri);
		const launchJsonContentString = new TextDecoder().decode(launchJsonContent);
		const launchJsonContentJson = JSON.parse(launchJsonContentString);
		if (!Array.isArray(launchJsonContentJson.configurations) || launchJsonContentJson.configurations.length === 0) {
			logger.error('launch.json has no usable debug configurations for preview.');
			stream.markdown("The launch.json file is not properly configured.");
			return { metadata: { command: command, status: "failed" } };
		}

		const configNamePrefix = command === UiApiCommandLiterals.PREVIEW_EMBED_CHAT_COMMAND
			? 'Embedded WebClient Preview'
			: 'WebClient Preview';
		const editor = vscode.window.activeTextEditor;
		const document = editor?.document;
		const isLayoutEditor = !!document && document.uri.path.endsWith('.layout.json');
		let matchedConfiguration: { name?: string; url?: string } | undefined;

		if (isLayoutEditor && document) {
			const fullPath = document.uri.fsPath;
			const pathParts = fullPath.split('/');
			const moduleName = pathParts[pathParts.length - 4];
			const viewName = document.uri.path.substring(document.uri.path.lastIndexOf('/') + 1).replace('.layout.json', '');
			const targetConfigName = `${configNamePrefix} - ${moduleName} | ${viewName}`;

			matchedConfiguration = launchJsonContentJson.configurations.find((configuration: { name?: string; url?: string }) => configuration.name === targetConfigName)
				?? launchJsonContentJson.configurations.find((configuration: { name?: string; url?: string }) => configuration.name?.startsWith(`${configNamePrefix} - `))
				?? launchJsonContentJson.configurations.find((configuration: { name?: string; url?: string }) => configuration.name === `${configNamePrefix} - Homepage`)
				?? launchJsonContentJson.configurations[0];
		} else {
			const warningMessage = editor
				? "The active editor is not a *.layout.json file. Use the first matching preview configuration from launch.json. "
				: "No *.layout.json file is open for preview. Use the first matching preview configuration from launch.json. ";
			stream.markdown(warningMessage);
			void vscode.window.showWarningMessage(warningMessage);
			matchedConfiguration = launchJsonContentJson.configurations.find((configuration: { name?: string; url?: string }) => configuration.name?.startsWith(configNamePrefix))
				?? launchJsonContentJson.configurations[0];
		}

		if (!matchedConfiguration?.name || !matchedConfiguration.url) {
			logger.error('Unable to resolve preview configuration or URL from launch.json.');
			stream.markdown("The preview URL is not found in the launch.json file.");
			return { metadata: { command: command, status: "failed" } };
		}

		logger.info(`Starting debug preview with configuration: ${matchedConfiguration.name}.`);
		stream.markdown("Wait for a moment, a browser window is about to pop up to preview this layout.");
		await debug.startDebugging(vscode.workspace.workspaceFolders![0], matchedConfiguration.name);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		logPreviewError('preview flow', errorMessage);
		stream.markdown("An error occurred.");
		vscode.window.showErrorMessage(userErrorMessage);
	}
	return { metadata: { command: command } };
}
