import { IChildLogger, IVSCodeExtLogger} from "@vscode-logging/logger";
import { ExtensionContext } from "vscode";

// Extension-wide logger instance initialized during activation.
let logger: IVSCodeExtLogger | undefined;

function isInitialized(): boolean {
  return logger !== undefined ? true : false;
}

export function getLogger(): IVSCodeExtLogger {
  // Fail fast so callers don't accidentally log before activation wiring is complete.
  if (isInitialized() === false) {
    const LOGGER_NOT_INITIALIZED = "Logger has not yet been initialized.";
    throw Error(LOGGER_NOT_INITIALIZED);
  }
  return logger!;
}

export function getClassLogger(className: string): IChildLogger {
  return getLogger().getChildLogger({ label: className });
}

export function initLoggerWrapper(newLogger: IVSCodeExtLogger): void {
  // Replaces the wrapper state; intended to be called once during activation.
  logger = newLogger;
}

export function reportLoggerConfig(
  context: ExtensionContext,
  configLogLevel: string
): void {
  getLogger().info(`Start Logging in Log Level: <${configLogLevel}>`);
  getLogger().info(
    `Full Logs can be found in the <${context.logUri.fsPath}> folder.`
  );
}

