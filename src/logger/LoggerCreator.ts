import { ExtensionContext, window } from "vscode";
import {
  getExtensionLogger,
  getExtensionLoggerOpts,
  LogLevel,
} from "@vscode-logging/logger";
import {
  registerLogSettingsListeners,
} from "../settings/SettingChangesHandler";
import {
  getLoggingLevelSetting,
  getSourceLocationTrackingSetting,
} from "../settings/SettingItems";
import { reportLoggerConfig, initLoggerWrapper } from "./LoggerWrapper";


export function createLoggerAndSubscribeLogSettingChanges(
  context: ExtensionContext
): void {
  createExtensionLogger(context);
  registerLogSettingsListeners(context);
}

function createExtensionLogger(context: ExtensionContext): void {
  console.log("Creating Extension Logger...");
  const contextLogPath = context.logUri;
  const logLevelSetting: LogLevel = getLoggingLevelSetting();
  const sourceLocationTrackingSettings: boolean = getSourceLocationTrackingSetting();
  const extensionPackageJson = context.extension.packageJSON as { name?: unknown } | undefined;
  const extensionName =
    typeof extensionPackageJson?.name === "string"
      ? extensionPackageJson.name
      : context.extension.id;

  const CHANNEL_NAME = "SAP Business One Web Client UI API development extension";
  const extensionLoggerOpts: getExtensionLoggerOpts = {
    extName: extensionName,
    level: logLevelSetting,
    logConsole: true,
    logPath: contextLogPath.fsPath,
    sourceLocationTracking: sourceLocationTrackingSettings,
    logOutputChannel: window.createOutputChannel(CHANNEL_NAME),
  };

  const extensionLogger = getExtensionLogger(extensionLoggerOpts);
  initLoggerWrapper(extensionLogger);
  reportLoggerConfig(context, logLevelSetting);
}
