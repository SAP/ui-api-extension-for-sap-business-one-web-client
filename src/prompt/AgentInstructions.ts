import * as vscode from 'vscode';
import { getClassLogger } from '../logger/LoggerWrapper';

let cachedAgentInstructionsPromise: Promise<string> | undefined;

export async function loadInstructions(context: vscode.ExtensionContext): Promise<string> {
	const logger = getClassLogger(loadInstructions.name);
	const hasWorkspaceInstructions = await hasWorkspaceInstructionFiles();
    if(hasWorkspaceInstructions) {
		logger.info('Workspace-level instructions file detected; skipping AGENTS.md.template load.');
        return "";
    }

    if (cachedAgentInstructionsPromise) {
		return cachedAgentInstructionsPromise;
	}

	cachedAgentInstructionsPromise = (async () => {
		try {
			const templateUri = vscode.Uri.joinPath(context.extensionUri, 'template', 'AGENTS.md.template');
			const bytes = await vscode.workspace.fs.readFile(templateUri);
			logger.info('Loaded AGENTS.md.template for tool-user prompt instructions.');
			return new TextDecoder().decode(bytes).trim();
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			logger.warn(`Failed to load AGENTS.md.template; using fallback instructions. Error: ${errorMessage}`);
			return 'You are an assistant specializing in SAP Business One Web Client UI API development. Use available tools to complete tasks accurately.';
		}
	})();

	return cachedAgentInstructionsPromise;
}

async function fileExists(uri: vscode.Uri): Promise<boolean> {
	try {
		await vscode.workspace.fs.stat(uri);
		return true;
	} catch {
		return false;
	}
}

async function hasWorkspaceInstructionFiles(): Promise<boolean> {
	const workspaceFolders = vscode.workspace.workspaceFolders ?? [];
	for (const folder of workspaceFolders) {
		const agentsFileUri = vscode.Uri.joinPath(folder.uri, 'AGENTS.md');
		const copilotInstructionsUri = vscode.Uri.joinPath(folder.uri, '.github', 'copilot-instructions.md');
		const [hasAgentsFile, hasCopilotInstructionsFile] = await Promise.all([
			fileExists(agentsFileUri),
			fileExists(copilotInstructionsUri),
		]);
		if (hasAgentsFile || hasCopilotInstructionsFile) {
			return true;
		}
	}

	return false;
}
