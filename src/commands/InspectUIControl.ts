import * as vscode from 'vscode';
import { getClassLogger } from '../logger/LoggerWrapper';
import { UiApiCommandLiterals } from './UiApiCommandLiterals';


function normalizeUi5ControlId(controlId: string): string {
	const trimmedControlId = controlId.trim();
	const selectorIdMatch = trimmedControlId.match(/#([^\s>.]+)/);

	return selectorIdMatch ? selectorIdMatch[1] : trimmedControlId;
}

function getUi5ShortGuidParts(controlId: string): string[] {
	const normalizedControlId = normalizeUi5ControlId(controlId);
	const shortGuidPattern = /(?:^|[-:_])([A-Za-z0-9]{22})(?=$|[-:_])/g;
	const shortGuidParts: string[] = [];
	let match: RegExpExecArray | null;

	while ((match = shortGuidPattern.exec(normalizedControlId)) !== null) {
		shortGuidParts.push(match[1]);
	}

	// For UDF case, the normalizedControlId may be something like:
	// application-webclient-ORDR-component---MainPage--ORDR:Detail:DEFAULT-UDF_ORDR_U_SOH_SO-inputWithServSideSuggestion-inner
	if(shortGuidParts.length === 0) {
		const udfGuidPattern = /(?:^|[-:_])([A-Za-z0-9_]+)(?=$|[-:_])/g;
		while ((match = udfGuidPattern.exec(normalizedControlId)) !== null) {
			if(match[1].startsWith('UDF_')) {
				shortGuidParts.push(match[1]);
			}
		}
	}
	return shortGuidParts;
}

function getUi5ShortGuid(controlId: string): string | null {
	const normalizedControlId = normalizeUi5ControlId(controlId);
	const shortGuidParts = getUi5ShortGuidParts(controlId);
	if (shortGuidParts.length === 0) {return null;}
	const guid = shortGuidParts[shortGuidParts.length - 1];
	// Special handling for table columns: COLUMN_<guid>
	const columnMatch = normalizedControlId.match(/COLUMN_([A-Za-z0-9]{22})/);
	if (columnMatch) {
		return `COLUMN_${guid}`;
	}
	// Special handling for table column cells: CELL_3ANfh97HnV2PcjHCC4Xuye-__clone273
	const cellMatch = normalizedControlId.match(/CELL_([A-Za-z0-9]{22})/);
	if (cellMatch) {
		return `CELL_${guid}`;
	}
	return guid;
}

export async function inspectUIControl(
	request: vscode.ChatRequest,
	stream: vscode.ChatResponseStream,
	inspectCommand: string = UiApiCommandLiterals.INSPECT_CHAT_COMMAND
): Promise<{ metadata: { command: string } }> {
	const logger = getClassLogger(inspectUIControl.name);
	logger.debug('Inspect UI control command received.');
	stream.progress("Inspecting Web Client UI control...");

	let controlUI5Id = '';
	if (request.references && request.references.length > 0) {
		const reference = request.references[0] as unknown;
		if (typeof reference === 'object' && reference !== null) {
			const referenceWithName = reference as { name?: string; value?: string };
			if (typeof referenceWithName.name === 'string' && referenceWithName.name.length > 0) {
				controlUI5Id = referenceWithName.name;
			} else if (typeof referenceWithName.value === 'string' && referenceWithName.value.length > 0) {
				controlUI5Id = referenceWithName.value;
			}
		}
	}
	if (controlUI5Id) {
		logger.debug(`Inspecting UI control ID: ${controlUI5Id}`);
		const guid = getUi5ShortGuid(controlUI5Id);
		if (!guid) {
			logger.warn('Failed to extract short GUID from provided UI5 control ID.');
			stream.markdown("The provided reference does not contain a valid UI5 control ID. Please make sure to select a UI control in the application and trigger the inspect action again.");
		} else {
			logger.debug(`Resolved control GUID: ${guid}`);
			stream.markdown(`UI Element: \`${controlUI5Id}\`\n`);
			stream.markdown(`Control GUID: \`${guid}\``);
		}
	} else {
		logger.warn('Inspect command executed without a resolvable UI5 control reference.');
	}
	return { metadata: { command: inspectCommand } };
}
