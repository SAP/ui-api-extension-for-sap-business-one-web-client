import { ConfigurationTarget, ExtensionContext, Uri, window, workspace, DebugConfiguration } from "vscode";
import { parse as parseJsonc } from 'jsonc-parser';
import { getClassLogger, getLogger, reportLoggerConfig } from "../logger/LoggerWrapper";
import {
  BROWSER_STARTUP_FLAGS_PROP,
  DEV_SERVER_PORT_PROP,
  LOGGING_LEVEL_PROP,
  SOURCE_TRACKING_PROP,
  WEB_CLIENT_URL_PROP,
  getBrowserStartupFlagsSetting,
  getLoggingLevelSetting,
  getSourceLocationTrackingSetting,
} from "./SettingItems";
import { tokenizeBrowserStartupFlags } from "../utils/Utils";

// Registers workspace configuration listeners that apply log level and source-tracking changes at runtime.
function registerLogSettingsListeners(context: ExtensionContext): void {
  context.subscriptions.push(
    workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(LOGGING_LEVEL_PROP)) {
        const logLevel = getLoggingLevelSetting();
        getLogger().changeLevel(logLevel);
        reportLoggerConfig(context, logLevel);
      }
    })
  );
  context.subscriptions.push(
    workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(SOURCE_TRACKING_PROP)) {
        const newSourceLocationTracking = getSourceLocationTrackingSetting();
        getLogger().changeSourceLocationTracking(newSourceLocationTracking);
      }
    })
  );
}

function registerBrowserStartupFlagsWatcher(context: ExtensionContext): void {
  const logger = getClassLogger(registerBrowserStartupFlagsWatcher.name);
  context.subscriptions.push(
    workspace.onDidChangeConfiguration(async event => {
      if (!event.affectsConfiguration(BROWSER_STARTUP_FLAGS_PROP)) {
        return;
      }
      const workspaceFolders = workspace.workspaceFolders;
      if (!workspaceFolders?.length) {
        return;
      }
      const flags = getBrowserStartupFlagsSetting().trim();
      logger.info(`${BROWSER_STARTUP_FLAGS_PROP} changed to: ${flags || '(empty)'}`);
      const runtimeArgs = flags ? tokenizeBrowserStartupFlags(flags) : [];
      let updatedCount = 0;
      for (const folder of workspaceFolders) {
        const launchJsonUri = Uri.joinPath(folder.uri, '.vscode', 'launch.json');
        try {
          const raw = await workspace.fs.readFile(launchJsonUri);
          const parsed = parseJsonc(new TextDecoder().decode(raw)) as { version?: string; configurations?: DebugConfiguration[] };
          if (!Array.isArray(parsed.configurations)) {
            continue;
          }
          let changed = false;
          for (const config of parsed.configurations) {
            if (config.type === 'chrome') {
              config.runtimeArgs = runtimeArgs;
              changed = true;
            }
          }
          if (changed) {
            await workspace.fs.writeFile(launchJsonUri, new TextEncoder().encode(JSON.stringify(parsed, null, 2)));
            logger.info(`Updated runtimeArgs in ${launchJsonUri.fsPath}`);
            updatedCount++;
          } else {
            logger.debug(`No chrome configurations found in ${launchJsonUri.fsPath}, skipping.`);
          }
        } catch {
          logger.debug(`No launch.json found in ${folder.uri.fsPath}, skipping.`);
        }
      }
      if (updatedCount > 0) {
        window.showInformationMessage(`Browser startup flags updated in launch.json.`);
      }
    })
  );
}

function normalizeWebClientUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.toLowerCase().endsWith('webx/index.html')) {
    return trimmed.replace(/\/?$/, '/') + 'webx/index.html';
  }
  return trimmed;
}

function validateWebClientUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return `"${WEB_CLIENT_URL_PROP}" must use http or https protocol.`;
    }
    return undefined;
  } catch {
    return `"${WEB_CLIENT_URL_PROP}" is not a valid URL: "${url}".`;
  }
}

function registerWebClientUrlSettingWatcher(context: ExtensionContext): void {
  const logger = getClassLogger(registerWebClientUrlSettingWatcher.name);
  context.subscriptions.push(
    workspace.onDidChangeConfiguration(async event => {
      if (!event.affectsConfiguration(WEB_CLIENT_URL_PROP)) {
        return;
      }
      const url = workspace.getConfiguration().get<string>(WEB_CLIENT_URL_PROP);
      if (!url) {
        logger.debug(`${WEB_CLIENT_URL_PROP} cleared.`);
        return;
      }
      logger.info(`${WEB_CLIENT_URL_PROP} changed to: ${url}`);
      const error = validateWebClientUrl(url);
      if (error) {
        logger.error(error);
        window.showErrorMessage(error);
        return;
      }
      const normalized = normalizeWebClientUrl(url);
      if (normalized !== url) {
        const inspection = workspace.getConfiguration().inspect<string>(WEB_CLIENT_URL_PROP);
        let target = ConfigurationTarget.Global;
        if (inspection?.workspaceFolderValue !== undefined) {
          target = ConfigurationTarget.WorkspaceFolder;
        } else if (inspection?.workspaceValue !== undefined) {
          target = ConfigurationTarget.Workspace;
        }
        await workspace.getConfiguration().update(WEB_CLIENT_URL_PROP, normalized, target);
        logger.info(`${WEB_CLIENT_URL_PROP} normalized to: ${normalized}`);
        window.showInformationMessage(`Web Client URL has been normalized to: ${normalized}`);
      } else {
        logger.debug(`${WEB_CLIENT_URL_PROP} is valid, no normalization needed.`);
      }
    })
  );
}

const DEFAULT_DEV_SERVER_PORT = 8082;

function registerDevServerPortWatcher(context: ExtensionContext): void {
  const logger = getClassLogger(registerDevServerPortWatcher.name);
  let reverting = false;
  context.subscriptions.push(
    workspace.onDidChangeConfiguration(async event => {
      if (!event.affectsConfiguration(DEV_SERVER_PORT_PROP)) {
        return;
      }
      if (reverting) {
        reverting = false;
        return;
      }
      const port = workspace.getConfiguration().get<number>(DEV_SERVER_PORT_PROP);
      if (port === undefined || port === null) {
        return;
      }
      const isValid = Number.isInteger(port) && port >= 1 && port <= 65535;
      if (!isValid) {
        const errorMsg = `Invalid port number: ${port}. Port must be an integer between 1 and 65535. Reverting to default (${DEFAULT_DEV_SERVER_PORT}).`;
        logger.error(errorMsg);
        window.showErrorMessage(errorMsg);
        const inspection = workspace.getConfiguration().inspect<number>(DEV_SERVER_PORT_PROP);
        let target = ConfigurationTarget.Global;
        if (inspection?.workspaceFolderValue !== undefined) {
          target = ConfigurationTarget.WorkspaceFolder;
        } else if (inspection?.workspaceValue !== undefined) {
          target = ConfigurationTarget.Workspace;
        }
        reverting = true;
        await workspace.getConfiguration().update(DEV_SERVER_PORT_PROP, DEFAULT_DEV_SERVER_PORT, target);
      } else {
        logger.info(`${DEV_SERVER_PORT_PROP} changed to: ${port}`);
        window.showInformationMessage(`Development server port updated to: ${port}`);
      }
    })
  );
}

export { registerLogSettingsListeners, registerBrowserStartupFlagsWatcher, registerWebClientUrlSettingWatcher, registerDevServerPortWatcher };
