import { ExtensionContext, workspace } from "vscode";
import { getLogger, reportLoggerConfig } from "../logger/LoggerWrapper";
import {
  LOGGING_LEVEL_PROP,
  SOURCE_TRACKING_PROP,
  getLoggingLevelSetting,
  getSourceLocationTrackingSetting,
} from "./SettingItems";

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

export {registerLogSettingsListeners};
