import * as vscode from "vscode";
import { getCurrentExtension, sanitizeIdentifier } from "../../utils/Utils";

export interface IResolvedAppContext {
  appName: string;
  appProvider: string;
  appVersion: string;
  existingModuleNames: string[];
}

export interface IViewMeta {
  name: string;
  viewId: string;
  table: string;
  viewType?: string;
  sampleControlUuid: string;
}

export const MAX_NAME_LENGTH = 128;
export const MAX_CATEGORY_LENGTH = 64;

// This UUID points to an existing menu button in the current view.
export const DEFAULT_SAMPLE_CONTROL_UUID = "eYw7UEkk3Qynbr4DjuHNax";

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function inferViewTypeFromViewName(viewName: string): string | undefined {
  if (/list$/i.test(viewName)) {
    return "List";
  }

  if (/detail$/i.test(viewName)) {
    return "Detail";
  }

  return undefined;
}

export async function getViewsMeta(): Promise<IViewMeta[]> {
  const extension = getCurrentExtension();
  const baseView = vscode.Uri.joinPath(
    extension.extensionUri,
    "skills/assets/viewsMeta.json"
  );
  const baseViewContent = await vscode.workspace.fs.readFile(baseView);
  const baseViewContentString = new TextDecoder().decode(baseViewContent);
  const baseViewContentObj = JSON.parse(baseViewContentString) as Array<
    Omit<IViewMeta, "viewType" | "sampleControlUuid"> & { sampleControlUUID?: string }
  >;
  return baseViewContentObj.map((view) => ({
    ...view,
    sampleControlUuid: view.sampleControlUUID ?? DEFAULT_SAMPLE_CONTROL_UUID,
    viewType: inferViewTypeFromViewName(view.name),
  }));
}

export function resolveAppContextFromAppJson(appJson: unknown): IResolvedAppContext {
  if (!appJson || typeof appJson !== "object" || !Array.isArray((appJson as { applications?: unknown[] }).applications)) {
    throw new Error("Invalid app.json format: missing applications array.");
  }

  interface IAppJsonApplication {
    name: string;
    path: string;
  }

  const applications = (appJson as { applications: unknown[] }).applications as IAppJsonApplication[];
  if (applications.length === 0) {
    throw new Error("Invalid app.json format: applications array is empty.");
  }

  const firstApplication = applications[0];
  if (!isNonEmptyString(firstApplication?.name) || !isNonEmptyString(firstApplication?.path)) {
    throw new Error("Invalid app.json format: applications entries must include name and path.");
  }

  const nameParts = firstApplication.name.split(".");
  if (nameParts.length < 3) {
    throw new Error(`Invalid application name in app.json: '${firstApplication.name}'.`);
  }

  const appProvider = nameParts[0];
  const appName = nameParts[1];
  const appPrefix = `${appName}_`;
  let appVersion = "1.0.0";
  if (firstApplication.path.startsWith(appPrefix)) {
    const pathWithoutPrefix = firstApplication.path.slice(appPrefix.length);
    const versionSegment = pathWithoutPrefix.split("/")[0];
    if (isNonEmptyString(versionSegment)) {
      appVersion = versionSegment;
    }
  }

  const existingModuleNames = applications
    .map((application) => application.name)
    .filter((name): name is string => isNonEmptyString(name))
    .map((name) => name.split("."))
    .filter((parts) => parts.length >= 3)
    .map((parts) => sanitizeIdentifier(parts[2]));

  return {
    appName,
    appProvider,
    appVersion,
    existingModuleNames,
  };
}