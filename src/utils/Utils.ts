import * as vscode from 'vscode';
import { WorkspaceFolder } from 'vscode';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as net from 'net';
import * as path from 'path';

interface ExtensionPackageJson {
    name: string;
    publisher: string;
    version?: string;
}

let cachedExtension: vscode.Extension<unknown> | undefined;

export function initializeExtensionMetadata(extension: vscode.Extension<unknown>): void {
    const packageJson = extension.packageJSON as Partial<ExtensionPackageJson> | undefined;
    if (!packageJson || typeof packageJson.name !== 'string' || typeof packageJson.publisher !== 'string') {
        throw new Error('Invalid extension identity in package.json');
    }

    cachedExtension = extension;
}

export function genViewName(baseView: string): string {
    let view = baseView.replace(/\W/g, '');
    view = view.replace(/\s/g, '');
    view = view + 'View';
    return view;
}

export function sanitizeIdentifier(value: string): string {
    return value.replace(/\W/g, '').replace(/\s/g, '');
}

export function tokenizeBrowserStartupFlags(flags: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let quote: 'single' | 'double' | null = null;
    let escaping = false;

    for (const ch of flags.trim()) {
        if (escaping) {
            current += ch;
            escaping = false;
            continue;
        }

        if (ch === '\\' && quote !== 'single') {
            escaping = true;
            continue;
        }

        if (quote === 'single') {
            if (ch === "'") {
                quote = null;
            } else {
                current += ch;
            }
            continue;
        }

        if (quote === 'double') {
            if (ch === '"') {
                quote = null;
            } else {
                current += ch;
            }
            continue;
        }

        if (ch === "'") {
            quote = 'single';
            continue;
        }

        if (ch === '"') {
            quote = 'double';
            continue;
        }

        if (/\s/.test(ch)) {
            if (current) {
                tokens.push(current);
                current = '';
            }
            continue;
        }

        current += ch;
    }

    if (escaping) {
        current += '\\';
    }

    if (current) {
        tokens.push(current);
    }

    return tokens;
}

export function genViewURLWithDebugServer(urlString: string, debugServerURL: string): string {
    const url = new URL(urlString);
    const queryParams = new URLSearchParams(url.search);
    queryParams.set('enable-extension-debug', 'true');
    queryParams.set('extension-debug-server', debugServerURL);
    url.search = queryParams.toString();
    return url.toString();
}

export function getCurrentWorkspaces(): readonly WorkspaceFolder[] {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders?.length) {
        vscode.window.showErrorMessage("No workspace folder found");
        throw new Error("No workspace folder found");
    }
    return workspaceFolders;
}

export async function ensureCurrentWorkspaceFolder(): Promise<WorkspaceFolder> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
        return workspaceFolder;
    }

    const selection = await vscode.window.showWarningMessage(
        'This action requires an open workspace folder.',
        { modal: true },
        'Open Folder',
        'Cancel'
    );

    if (selection !== 'Open Folder') {
        throw new Error('No workspace folder found');
    }

    const folder = await vscode.window.showOpenDialog({
        canSelectMany: false,
        canSelectFiles: false,
        canSelectFolders: true,
        openLabel: 'Open Workspace Folder',
    });

    if (!folder?.length) {
        throw new Error('No workspace folder selected');
    }

    await vscode.commands.executeCommand('vscode.openFolder', folder[0], false);
    throw new Error('Workspace opened. Please retry the command.');
}

export function getCurrentExtension() {
    if (!cachedExtension) {
        throw new Error('Extension metadata has not been initialized');
    }

    if (!vscode.extensions.getExtension(cachedExtension.id)) {
        vscode.window.showErrorMessage("UIAPI Copilot Extension not found");
        throw new Error("UIAPI Copilot Extension not found");
    }

    return cachedExtension;
}

export function getDevServerURL(): string {
    const config = vscode.workspace.getConfiguration('WebClientUIAPICopilot');
    const debugServerPort = config.get('devServer.port', 8082);
    return `http://localhost:${debugServerPort}`;
}

export async function waitForShellIntegration(
    terminal: vscode.Terminal,
    timeout = 5000
): Promise<void> {
    let resolve!: () => void;
    let reject!: (e: Error) => void;
    const promise = new Promise<void>((promiseResolve, promiseReject) => {
        resolve = promiseResolve;
        reject = promiseReject;
    });

    const timer = setTimeout(() => reject(new Error('Could not run terminal command: shell integration is not enabled')), timeout);

    const listener = vscode.window.onDidChangeTerminalShellIntegration((event) => {
        if (event.terminal === terminal) {
            clearTimeout(timer);
            listener.dispose();
            resolve();
        }
    });

    await promise;
}

export async function executeTerminalCommand(
    terminal: vscode.Terminal,
    command: string,
    shellIntegrationTimeout = 5000
): Promise<string> {
    if (!terminal.shellIntegration) {
        await waitForShellIntegration(terminal, shellIntegrationTimeout);
    }

    if (!terminal.shellIntegration) {
        throw new Error(`Shell integration is unavailable. Unable to run \`${command}\`.`);
    }

    const execution = terminal.shellIntegration.executeCommand(command);
    const terminalStream = execution.read();
    let output = '';
    for await (const chunk of terminalStream) {
        output += chunk;
    }

    return output;
}

export async function execCommand(command: string, args: string[]): Promise<{ exitCode: number | string; stdout: string; stderr: string; }> {
    return new Promise(resolve => {
        const childProcess = spawn(command, args, { shell: true });
        let stdout = '';
        let stderr = '';
        let settled = false;

        childProcess.stdout.on('data', (data: string | Buffer) => {
            stdout += data.toString();
        });

        childProcess.stderr.on('data', (data: string | Buffer) => {
            stderr += data.toString();
        });

        childProcess.on('exit', (code: number | null, signal: string | null) => {
            if (settled) {
                return;
            }
            settled = true;
            resolve({
                exitCode: code ?? signal ?? -1,
                stdout: stdout.trim(),
                stderr: stderr.trim()
            });
        });

        childProcess.on('error', (error: { code?: string; message: string }) => {
            if (settled) {
                return;
            }
            settled = true;
            resolve({
                exitCode: error.code ?? -1,
                stdout: stdout.trim(),
                stderr: error.message || stderr.trim()
            });
        });
    });
}

async function pathExists(uri: vscode.Uri): Promise<boolean> {
    try {
        await vscode.workspace.fs.stat(uri);
        return true;
    } catch {
        return false;
    }
}

export async function isNpmInstallNeeded(): Promise<boolean> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        return false;
    }

    const packageJsonUri = vscode.Uri.joinPath(workspaceFolder.uri, 'package.json');
    const packageLockUri = vscode.Uri.joinPath(workspaceFolder.uri, 'package-lock.json');
    const nodeModulesUri = vscode.Uri.joinPath(workspaceFolder.uri, 'node_modules');

    if (!await pathExists(packageJsonUri)) {
        return false;
    }

    if (!await pathExists(nodeModulesUri)) {
        return true;
    }

    const packageJsonStat = await vscode.workspace.fs.stat(packageJsonUri);
    const nodeModulesStat = await vscode.workspace.fs.stat(nodeModulesUri);
    let dependencyConfigMtime = packageJsonStat.mtime;

    if (await pathExists(packageLockUri)) {
        const packageLockStat = await vscode.workspace.fs.stat(packageLockUri);
        dependencyConfigMtime = Math.max(dependencyConfigMtime, packageLockStat.mtime);
    }

    return dependencyConfigMtime > nodeModulesStat.mtime;
}

// TODO: refactor this function according to the start.js
export async function findProcessesUsingPort(port: number): Promise<number[]> {
    if (process.platform === 'win32') {
        const result = await execCommand('netstat', ['-ano', '-p', 'tcp']);
        if (result.exitCode !== 0 || !result.stdout) {
            return [];
        }

        const portProcessIds = result.stdout
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.startsWith('TCP'))
            .map(line => line.split(/\s+/))
            .filter(parts => parts.length >= 5)
            .filter(parts => parts[1].endsWith(`:${port}`) && parts[3] === 'LISTENING')
            .map(parts => Number(parts[4]))
            .filter(pid => Number.isInteger(pid) && pid > 0);

        if (portProcessIds.length === 0) {
            return [];
        }

        const tasklistResult = await execCommand('tasklist', ['/FI', 'IMAGENAME eq node.exe', '/NH', '/FO', 'CSV']);
        if (tasklistResult.exitCode !== 0 || !tasklistResult.stdout) {
            return [...new Set(portProcessIds)];
        }

        const nodeProcessIds = new Set(
            tasklistResult.stdout
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(line => line.startsWith('"node'))
                .map(line => Number(line.split(',')[1]?.replace(/"/g, '')))
                .filter(pid => Number.isInteger(pid) && pid > 0)
        );

        return [...new Set(portProcessIds.filter(pid => nodeProcessIds.has(pid)))];
    }

    const result = await execCommand('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t', '-a', '-c', 'node']);
    if (result.exitCode !== 0 || !result.stdout) {
        return [];
    }

    return [...new Set(result.stdout
        .split(/\r?\n/)
        .map(line => Number(line.trim()))
        .filter(pid => Number.isInteger(pid) && pid > 0))];
}

export async function isDevServerRunning(): Promise<boolean> {
    const serverUrl = new URL(getDevServerURL());
    const appJsonUrl = new URL('/app.json', serverUrl);

    return new Promise(resolve => {
        const socket = net.createConnection({
            host: serverUrl.hostname,
            port: getDevServerPort()
        });

        socket.once('connect', () => {
            socket.destroy();

            fetch(appJsonUrl)
                .then(async response => {
                    if (!response.ok) {
                        resolve(false);
                        return;
                    }

                    let body: unknown;
                    try {
                        body = await response.json();
                    } catch {
                        resolve(false);
                        return;
                    }

                    const hasApplications = typeof body === 'object'
                        && body !== null
                        && 'applications' in body
                        && Array.isArray((body as { applications?: unknown }).applications)
                        && (body as { applications: unknown[] }).applications.every(application =>
                            typeof application === 'object'
                            && application !== null
                            && typeof (application as { name?: unknown }).name === 'string'
                            && typeof (application as { path?: unknown }).path === 'string'
                        );

                    resolve(hasApplications);
                })
                .catch(() => resolve(false));
        });

        socket.once('error', () => {
            socket.destroy();
            resolve(false);
        });
    });
}

export function getDevServerPort(): number {
    const serverUrl = new URL(getDevServerURL());
    return serverUrl.port ? parseInt(serverUrl.port, 10) : 8082;
}

export async function linkFolder(actual: string, symlink: string): Promise<void> {
    const actualPath = path.resolve(actual);
    const symlinkPath = path.resolve(symlink);
    try {
        await fs.promises.symlink(actualPath, symlinkPath, 'dir');
    } catch (error) {
        console.error(`Error linking folder: ${error}`);
    }
};
