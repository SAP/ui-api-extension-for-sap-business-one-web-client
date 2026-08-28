import { workspace } from "vscode";
import { LogLevel } from "@vscode-logging/logger";

/**
 * Note that the values of these configuration properties must match those defined in the package.json
 */
export const APP_ROOT_SETTING_PROP = "WebClientUIAPICopilot";

export const LOGGING_LEVEL_PROP = `${APP_ROOT_SETTING_PROP}.loggingLevel`;
export const SOURCE_TRACKING_PROP = `${APP_ROOT_SETTING_PROP}.sourceLocationTracking`;
export const DEV_SERVER_PORT_PROP = `${APP_ROOT_SETTING_PROP}.devServer.port`;
export const BROWSER_STARTUP_FLAGS_PROP = `${APP_ROOT_SETTING_PROP}.browserStartupFlags`;
export const WEB_CLIENT_URL_PROP = `${APP_ROOT_SETTING_PROP}.webClient.url`;

export function getBrowserStartupFlagsSetting(): string {
  return workspace.getConfiguration().get(BROWSER_STARTUP_FLAGS_PROP) ?? "";
}

export function getLoggingLevelSetting(): LogLevel {
  return workspace.getConfiguration().get(LOGGING_LEVEL_PROP) ?? "error";
}

export function getSourceLocationTrackingSetting(): boolean {
  return workspace.getConfiguration().get(SOURCE_TRACKING_PROP) ?? false;
}

export function getDebugServerPortSetting(): number {
  return workspace.getConfiguration().get(DEV_SERVER_PORT_PROP) ?? 8082;
}

export function getWebClientUrlSetting(): string | undefined {
  const raw = workspace.getConfiguration().get<string>(WEB_CLIENT_URL_PROP);
  if (!raw) {
    return undefined;
  }
  return raw;
}
