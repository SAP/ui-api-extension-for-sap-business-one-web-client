import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import test from 'node:test';

import { initLoggerWrapper } from '../src/logger/LoggerWrapper';
import { ServiceLayerMetadataParser } from '../src/meta/ServiceLayerMetaParser';

initLoggerWrapper({
    getChildLogger: () => ({
        debug: () => undefined,
        info: () => undefined,
        warn: () => undefined,
        error: () => undefined,
    }),
} as unknown as Parameters<typeof initLoggerWrapper>[0]);

const metadataParser = ServiceLayerMetadataParser.getInstance();

interface ParserInternalState {
    xmlFilePath: string;
    init: boolean;
    schema: {
        EntityContainer: {
            EntitySet: unknown[];
            FunctionImport: unknown[];
        };
        EntityType: unknown[];
        ComplexType: unknown[];
        EnumType: unknown[];
    };
}

function resetParserState(xmlFilePath?: string): void {
    const parser = metadataParser as unknown as ParserInternalState;
    parser.xmlFilePath = xmlFilePath || path.join(process.cwd(), 'resource', 'metadata.xml');
    parser.init = false;
    parser.schema = {
        EntityContainer: {
            EntitySet: [],
            FunctionImport: []
        },
        EntityType: [],
        ComplexType: [],
        EnumType: []
    };
}

function writeTempXml(content: string): string {
    const filePath = path.join(os.tmpdir(), `metadata-parser-test-${Date.now()}-${Math.random().toString(16).slice(2)}.xml`);
    fs.writeFileSync(filePath, content, 'utf-8');
    return filePath;
}

test('throws when xml file path does not exist', async () => {
    const missingPath = path.join(os.tmpdir(), `metadata-parser-new-missing-${Date.now()}.xml`);
    resetParserState(missingPath);

    await assert.rejects(async () => {
        await metadataParser.getEntitySetList();
    });
});

test('throws on malformed XML input', async () => {
    const malformedXmlPath = writeTempXml('<edmx:Edmx><broken></edmx:Edmx>');
    resetParserState(malformedXmlPath);

    try {
        await assert.rejects(async () => {
            await metadataParser.getEntitySetList();
        });
    } finally {
        fs.rmSync(malformedXmlPath, { force: true });
    }
});

test('throws when DataServices/Schema structure is missing', async () => {
    const invalidShapeXmlPath = writeTempXml('<?xml version="1.0" encoding="UTF-8"?><edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx"></edmx:Edmx>');
    resetParserState(invalidShapeXmlPath);

    try {
        await assert.rejects(async () => {
            await metadataParser.getEntitySetList();
        });
    } finally {
        fs.rmSync(invalidShapeXmlPath, { force: true });
    }
});

test('returns null for unknown entity set details', async () => {
    resetParserState();
    const result = await metadataParser.getEntitySetDetails('__NON_EXISTENT_ENTITY_SET__');
    assert.equal(result, null);
});

test('throws for unknown entity set in validateEntitySetProperties', async () => {
    resetParserState();
    await assert.rejects(async () => {
        await metadataParser.validateEntitySetProperties('__NON_EXISTENT_ENTITY_SET__', ['DocEntry']);
    }, /not found/);
});

test('throws for unknown complex type in validateComplexTypeProperty', async () => {
    resetParserState();
    await assert.rejects(async () => {
        await metadataParser.validateComplexTypeProperty('__NON_EXISTENT_COMPLEX_TYPE__', ['Code']);
    }, /not found/);
});

test('returns null for unknown function import details', async () => {
    resetParserState();
    const result = await metadataParser.getFunctionImportDetails('__NON_EXISTENT_FUNCTION_IMPORT__');
    assert.equal(result, null);
});
