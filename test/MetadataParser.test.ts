import assert from 'node:assert/strict';
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

interface FunctionImportShape {
    $: {
        Name: string;
        ReturnType: string;
        ServiceCode?: string;
        HttpMethod?: string;
        IsBindable?: boolean;
    };
    Parameter?: Array<{ $: { Name: string; Type: string } }> | { $: { Name: string; Type: string } };
}

interface EntitySetShape {
    $: {
        Name: string;
        EntityType: string;
        ServiceCode?: string;
        TableName?: string;
    };
}

function resetParserState(): void {
    const parser = metadataParser as unknown as ParserInternalState;
    parser.xmlFilePath = path.join(process.cwd(), 'resource', 'metadata.xml');
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

async function ensureParserInitialized(): Promise<ParserInternalState> {
    resetParserState();
    await metadataParser.getEntitySetList();
    return metadataParser as unknown as ParserInternalState;
}

test('getEntitySetList returns entity sets and applies filters', async () => {
    resetParserState();
    const entitySetList = await metadataParser.getEntitySetList();

    assert.ok(entitySetList.length > 0, 'entity set list should not be empty');
    assert.equal(entitySetList.some((name) => name.startsWith('U_')), false, 'U_ entity sets must be filtered out');
    assert.equal(entitySetList.some((name) => name.startsWith('B1Sessions')), false, 'B1Sessions* entity sets must be filtered out');
});

test('validateEntitySet returns true for known name and false for unknown name', async () => {
    resetParserState();
    const entitySetList = await metadataParser.getEntitySetList();
    const knownEntitySet = entitySetList[0];

    assert.ok(knownEntitySet, 'expected at least one entity set from metadata.xml');
    assert.equal(await metadataParser.validateEntitySet(knownEntitySet), true);
    assert.equal(await metadataParser.validateEntitySet('__NON_EXISTENT_ENTITY_SET__'), false);
});

test('getEntitySetDetails exposes entity metadata and functions', async () => {
    resetParserState();
    const details = await metadataParser.getEntitySetDetails('ChartOfAccounts') as {
        Name: string;
        ServiceCode: string;
        TableName: string;
        EntityType: {
            Name: string;
            KeyProperties: string[];
            Properties: Array<{ Name: string; Type: string }>;
        };
        ODataUnbindFunctions: unknown[];
        ODataBindableFunctions: unknown[];
    } | null;

    assert.ok(details, 'expected details for ChartOfAccounts');
    assert.equal(details?.Name, 'ChartOfAccounts');
    assert.ok(details?.ServiceCode, 'service code should be available from annotations');
    assert.ok(Array.isArray(details?.EntityType.KeyProperties), 'KeyProperties should be an array');
    assert.ok((details?.EntityType.Properties.length || 0) > 0, 'Properties should not be empty');
    assert.ok(Array.isArray(details?.ODataUnbindFunctions), 'ODataUnbindFunctions should be an array');
    assert.ok(Array.isArray(details?.ODataBindableFunctions), 'ODataBindableFunctions should be an array');
});

test('getEntitySetDetails returns expected Orders functions payload', async () => {
    resetParserState();
    const details = await metadataParser.getEntitySetDetails('Orders') as {
        Name: string;
        ServiceCode: string;
        TableName: string;
        EntityType: {
            Name: string;
            KeyProperties: string[];
        };
        ODataUnbindFunctions: Array<{
            Name: string;
            ReturnType?: string;
            HttpMethod: string;
            IsBindable: boolean;
            ImportSource: 'FunctionImport' | 'ActionImport' | 'BoundFunction' | 'BoundAction';
            Parameter?: { Name: string; Type: string } | Array<{ Name: string; Type: string }>;
        }>;
        ODataBindableFunctions: Array<{
            Name: string;
            HttpMethod: string;
            IsBindable: boolean;
            ImportSource: 'FunctionImport' | 'ActionImport' | 'BoundFunction' | 'BoundAction';
            Parameter?: { Name: string; Type: string } | Array<{ Name: string; Type: string }>;
        }>;
    } | null;

    assert.ok(details, 'expected details for Orders');
    assert.equal(details?.Name, 'Orders');
    assert.equal(details?.ServiceCode, '17');
    assert.equal(details?.TableName, 'ORDR');
    assert.equal(details?.EntityType.Name, 'SAPB1.Document');
    assert.deepEqual(details?.EntityType.KeyProperties, ['DocEntry']);

    assert.equal(details?.ODataUnbindFunctions.length, 8, 'Orders should expose 8 unbind operations');
    assert.deepEqual(
        details?.ODataUnbindFunctions.map((item) => item.Name),
        [
            'OrdersService_Preview',
            'OrdersService_CloseByDate',
            'OrdersService_ExportEWayBill',
            'OrdersService_GetApprovalTemplates',
            'OrdersService_HandleApprovalRequest',
            'OrdersService_InitData',
            'OrdersService_ApproveAndAdd',
            'OrdersService_ApproveAndUpdate'
        ]
    );

    assert.ok((details?.ODataBindableFunctions.length || 0) > 0, 'Orders should expose bindable operations');
    assert.deepEqual(
        details?.ODataBindableFunctions.map((item) => item.Name),
        ['Close', 'Cancel', 'Reopen', 'CreateCancellationDocument']
    );

    const cancel = details?.ODataBindableFunctions.find((item) => item.Name === 'Cancel');
    assert.ok(cancel, 'expected bound Cancel action for Orders/SAPB1.Document');
    assert.equal(cancel?.IsBindable, true);
    assert.equal(cancel?.HttpMethod, 'POST');
    assert.equal(cancel?.ImportSource, 'BoundAction');

    const parameter = cancel?.Parameter;
    const firstParameter = Array.isArray(parameter) ? parameter[0] : parameter;
    assert.equal(firstParameter?.Name, 'DocumentParams');
    assert.equal(firstParameter?.Type, 'SAPB1.Document');

    const preview = details?.ODataUnbindFunctions[0];
    assert.equal(preview?.Name, 'OrdersService_Preview');
    assert.equal(preview?.ReturnType, 'SAPB1.Document');
    assert.equal(preview?.IsBindable, false);
    assert.equal(preview?.HttpMethod, 'POST');
    assert.equal(preview?.ImportSource, 'ActionImport');
});

test('getEntitySetDetails returns null for unknown entity set', async () => {
    resetParserState();
    const details = await metadataParser.getEntitySetDetails('__NON_EXISTENT_ENTITY_SET__');
    assert.equal(details, null);
});

test('getEntityTypeProperties returns properties and keys', async () => {
    resetParserState();
    const result = await metadataParser.getEntityTypeProperties('SAPB1.Document');

    assert.ok(Array.isArray(result.properties), 'properties should be an array');
    assert.ok(Array.isArray(result.keyProperties), 'keyProperties should be an array');
    assert.ok(result.properties.length > 0, 'properties should not be empty');
    assert.ok(result.keyProperties.length > 0, 'keyProperties should not be empty');
});

test('validateProperties and validateEntitySetProperties return only invalid names', async () => {
    resetParserState();
    const details = await metadataParser.getEntitySetDetails('ChartOfAccounts') as {
        EntityType: {
            Name: string;
            Properties: Array<{ Name: string; Type: string }>;
        };
    } | null;

    assert.ok(details, 'expected ChartOfAccounts details');
    const knownEntityType = details?.EntityType.Name as string;
    const knownProperty = details?.EntityType.Properties[0]?.Name as string;

    const invalidsByType = await metadataParser.validateProperties(knownEntityType, [knownProperty, '__INVALID_PROP__']);
    assert.deepEqual(invalidsByType, ['__INVALID_PROP__']);

    const invalidsByEntitySet = await metadataParser.validateEntitySetProperties('ChartOfAccounts', [knownProperty, '__INVALID_PROP_2__']);
    assert.deepEqual(invalidsByEntitySet, ['__INVALID_PROP_2__']);
});

test('getFunctionImports includes normalized function and action imports', async () => {
    resetParserState();
    const imports = await metadataParser.getFunctionImports();

    assert.ok(Array.isArray(imports), 'function imports should be an array');
    assert.ok(imports.length > 0, 'metadata.xml should contain imports');
    assert.ok(imports.some((item) => item.$.HttpMethod === 'GET'), 'expected GET imports from FunctionImport');
    assert.ok(imports.some((item) => item.$.HttpMethod === 'POST'), 'expected POST imports from ActionImport');
    assert.ok(imports.some((item) => item.$.ImportSource === 'FunctionImport'), 'expected FunctionImport source flag');
    assert.ok(imports.some((item) => item.$.ImportSource === 'ActionImport'), 'expected ActionImport source flag');
});

test('getGlobalFunctionImportList returns imports not mapped to entity set service codes', async () => {
    const parser = await ensureParserInitialized();
    const globalNames = await metadataParser.getGlobalFunctionImportList();

    const entitySets = parser.schema.EntityContainer.EntitySet as EntitySetShape[];
    const functionImports = parser.schema.EntityContainer.FunctionImport as FunctionImportShape[];
    const serviceCodes = new Set(entitySets.map((entitySet) => entitySet.$.ServiceCode).filter(Boolean));

    for (const functionName of globalNames) {
        const fn = functionImports.find((item) => item.$.Name === functionName);
        assert.ok(fn, `expected function import '${functionName}' to exist in schema`);
        assert.ok(fn?.$.ServiceCode, 'global function import should have ServiceCode');
        assert.equal(serviceCodes.has(fn?.$.ServiceCode), false, 'global function import service code must not belong to entity sets');
    }
});

test('getFunctionImportDetails returns metadata for known function import and hides ServiceCode', async () => {
    resetParserState();
    const details = await metadataParser.getFunctionImportDetails('CompanyService_GetCompanyInfo') as {
        ODataFunctionCallInstruction: string;
        ODataUnbindFunction: {
            Name: string;
            ReturnType: string;
            HttpMethod: string;
            IsBindable: boolean;
            ImportSource: 'FunctionImport' | 'ActionImport';
            Parameter: unknown;
            ServiceCode?: string;
        };
    } | null;

    assert.ok(details, 'expected details for CompanyService_GetCompanyInfo');
    assert.equal(details?.ODataUnbindFunction.Name, 'CompanyService_GetCompanyInfo');
    assert.equal(details?.ODataUnbindFunction.ReturnType, 'SAPB1.CompanyInfo');
    assert.equal(details?.ODataUnbindFunction.HttpMethod, 'GET');
    assert.equal(details?.ODataUnbindFunction.IsBindable, false);
    assert.equal(details?.ODataUnbindFunction.ImportSource, 'FunctionImport');
    assert.equal(details?.ODataUnbindFunction.Parameter, undefined);
    assert.equal(Object.prototype.hasOwnProperty.call(details?.ODataUnbindFunction || {}, 'ServiceCode'), false, 'ServiceCode should not be exposed in details');
    assert.ok(details?.ODataFunctionCallInstruction.includes('parameter name MUST be used'));
});

test('getFunctionImportDetails does not default missing return type to Edm.String', async () => {
    resetParserState();
    const details = await metadataParser.getFunctionImportDetails('CompanyService_UpdateAdminInfo') as {
        ODataUnbindFunction: {
            Name: string;
            ReturnType?: string;
            HttpMethod: string;
            ImportSource: 'FunctionImport' | 'ActionImport';
            Parameter?: { Name: string; Type: string } | Array<{ Name: string; Type: string }>;
        };
    } | null;

    assert.ok(details, 'expected details for CompanyService_UpdateAdminInfo');
    assert.equal(details?.ODataUnbindFunction.Name, 'CompanyService_UpdateAdminInfo');
    assert.equal(details?.ODataUnbindFunction.ReturnType, undefined, 'missing return type should remain undefined');
    assert.equal(details?.ODataUnbindFunction.HttpMethod, 'POST');
    assert.equal(details?.ODataUnbindFunction.ImportSource, 'ActionImport');
    assert.deepEqual(details?.ODataUnbindFunction.Parameter, { Name: 'AdminInfo', Type: 'SAPB1.AdminInfo' });
});

test('getTypeDetails returns enum values using SAPB1.ValidValue annotation', async () => {
    resetParserState();
    const details = await metadataParser.getTypeDetails('AccountCategorySourceEnum') as {
        typeCategory: string;
        typeName: string;
        members: Array<{ Name: string; Value: string }>;
    } | null;

    assert.ok(details, 'expected enum details for AccountCategorySourceEnum');
    assert.equal(details?.typeCategory, 'EnumType');
    assert.equal(details?.typeName, 'AccountCategorySourceEnum');
    assert.ok((details?.members.length || 0) > 0, 'enum members should not be empty');
    assert.ok(details?.members.some((member) => member.Value === 'B'), 'expected annotation-driven enum member value');
});

test('getTypeDetails returns complex type metadata and validateComplexTypeProperty works', async () => {
    resetParserState();
    const details = await metadataParser.getTypeDetails('DocumentLine') as {
        typeCategory: string;
        typeName: string;
        properties: Array<{ Name: string; Type: string }>;
    } | null;

    assert.ok(details, 'expected complex type details for DocumentLine');
    assert.equal(details?.typeCategory, 'ComplexType');
    assert.equal(details?.typeName, 'DocumentLine');
    assert.ok((details?.properties.length || 0) > 0, 'complex type should contain properties');

    const knownProperty = details?.properties[0]?.Name as string;
    const invalids = await metadataParser.validateComplexTypeProperty('DocumentLine', [knownProperty, '__INVALID_COMPLEX_PROP__']);
    assert.deepEqual(invalids, ['__INVALID_COMPLEX_PROP__']);
});

test('getTypeDetails throws for unknown type', async () => {
    resetParserState();
    await assert.rejects(async () => {
        await metadataParser.getTypeDetails('__NON_EXISTENT_TYPE__');
    }, /not found/);
});
