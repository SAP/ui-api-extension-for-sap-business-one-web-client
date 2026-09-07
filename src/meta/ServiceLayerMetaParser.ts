import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';

import { getClassLogger } from "../logger/LoggerWrapper";
import { IChildLogger } from "@vscode-logging/logger";

interface EntitySet {
    $: {
        Name: string;
        EntityType: string;
        ServiceCode?: string;
        TableName?: string;
    };
}

interface Parameter {
    $: {
        Name: string;
        Type: string;
    };
}

interface FunctionImport {
    $: {
        Name: string;
        ReturnType?: string;
        ServiceCode?: string;
        HttpMethod?: string;
        IsBindable?: boolean;
        ImportSource?: 'FunctionImport' | 'ActionImport' | 'BoundFunction' | 'BoundAction';
    },
    Parameter?: Parameter[] | Parameter;
}

interface Property {
    $: {
        Name: string;
        Type: string;
        Alias?: string;
        Nullable: string;
    };
}

interface Member {
    $: {
        Name: string;
        Value: string;
    };
}

interface PropertyRef {
    $: {
        Name: string;
    }
}

interface EntityType {
    $: {
        Name: string;
    };
    Key: {
        PropertyRef: PropertyRef[] | PropertyRef;
    };
    Property: Property[];
}

interface ComplexType {
    $: {
        Name: string;
    };
    Property: Property[];
}

interface EnumType {
    $: {
        Name: string;
    };
    Member: Member[];
}

interface Schema {
    EntityContainer: {
        EntitySet: EntitySet[];
        FunctionImport: FunctionImport[];
    }
    EntityType: EntityType[];
    ComplexType: ComplexType[];
    EnumType: EnumType[];
}

interface XmlNode {
    $?: Record<string, string>;
    Annotation?: XmlNode | XmlNode[];
    Parameter?: XmlNode | XmlNode[];
    ReturnType?: XmlNode;
    Property?: XmlNode | XmlNode[];
    Member?: XmlNode | XmlNode[];
    Key?: {
        PropertyRef?: XmlNode | XmlNode[];
    };
    EntitySet?: XmlNode | XmlNode[];
    EntityContainer?: XmlNode | XmlNode[];
    FunctionImport?: XmlNode | XmlNode[];
    ActionImport?: XmlNode | XmlNode[];
    EntityType?: XmlNode | XmlNode[];
    ComplexType?: XmlNode | XmlNode[];
    EnumType?: XmlNode | XmlNode[];
    Function?: XmlNode | XmlNode[];
    Action?: XmlNode | XmlNode[];
}

const ODATA_FUNCTION_CALL_INSTRUCTION = "For any unbind function call with complex typed parameter, the parameter name MUST be used in the request body and ensure the properties in the parameter value is accurate by using tools. For example, for a function call with a parameter named 'EmailMessage', the request payload should be '{'EmailMessage': {'to': 'user@example.com', 'subject': 'Hello'}'}'. For bindable function/action, call the operation on a specific entity URL and do not send the binding parameter in request body. For example: POST /b1s/v2/Orders(123)/Cancel.";

export class ServiceLayerMetadataParser {
    private static instance: ServiceLayerMetadataParser | null = null;
    private xmlFilePath: string;
    schema: Schema;
    private boundOperations: FunctionImport[];
    private init: boolean;
    private readonly logger: IChildLogger = getClassLogger(ServiceLayerMetadataParser.name);

    private constructor(xmlFilePath?: string) {
        this.xmlFilePath = xmlFilePath || ServiceLayerMetadataParser.resolveDefaultMetadataXmlPath();
        this.schema = {
            EntityContainer: {
                EntitySet: [],
                FunctionImport: []
            },
            EntityType: [],
            ComplexType: [],
            EnumType: []
        };
        this.boundOperations = [];
        this.init = false;
        this.logger.info(`Initialized metadata parser with xml path: ${this.xmlFilePath}`);
    }

    public static getInstance(): ServiceLayerMetadataParser {
        if (!ServiceLayerMetadataParser.instance) {
            ServiceLayerMetadataParser.instance = new ServiceLayerMetadataParser();
        }
        return ServiceLayerMetadataParser.instance;
    }

    private static resolveDefaultMetadataXmlPath(): string {
        const candidates = [
            path.join(process.cwd(), 'resource', 'metadata.xml'),
            path.resolve(__dirname, '..', 'resource', 'metadata.xml'),
            path.resolve(__dirname, '..', '..', 'resource', 'metadata.xml')
        ];

        const existing = candidates.find((candidate) => fs.existsSync(candidate));
        return existing || candidates[0];
    }

    private toArray<T>(value?: T | T[]): T[] {
        if (!value) {
            return [];
        }
        return Array.isArray(value) ? value : [value];
    }

    private getAnnotationString(node: XmlNode, term: string): string | undefined {
        for (const annotation of this.toArray(node.Annotation)) {
            if (annotation?.$?.Term === term) {
                return annotation.$.String || '';
            }
        }
        return undefined;
    }

    private normalizeParameters(parameters: Parameter[]): Parameter[] | Parameter | undefined {
        if (parameters.length === 0) {
            return undefined;
        }
        if (parameters.length === 1) {
            return parameters[0];
        }
        return parameters;
    }

    private formatError(error: unknown): string {
        if (error instanceof Error) {
            return error.stack ?? error.message;
        }
        return String(error);
    }

    private async ensureParsed(caller: string): Promise<void> {
        if (this.init) {
            return;
        }
        this.logger.debug(`Schema cache is cold. Triggering parse from ${caller}.`);
        await this.parse();
    }

    private resetCache(): void {
        this.schema = {
            EntityContainer: {
                EntitySet: [],
                FunctionImport: []
            },
            EntityType: [],
            ComplexType: [],
            EnumType: []
        };
        this.boundOperations = [];
        this.init = false;
        this.logger.debug('Metadata parser cache has been reset.');
    }

    public setMetadataBasePath(basePath: string): void {
        const metadataPath = path.join(basePath, 'resource', 'metadata.xml');
        this.setMetadataFilePath(metadataPath);
    }

    public setMetadataFilePath(filePath: string): void {
        const resolvedPath = path.resolve(filePath);
        if (this.xmlFilePath === resolvedPath) {
            this.logger.debug(`Metadata file path is unchanged: ${resolvedPath}`);
            return;
        }
        this.logger.info(`Metadata file path changed from ${this.xmlFilePath} to ${resolvedPath}`);
        this.xmlFilePath = resolvedPath;
        this.resetCache();
    }

    private async parse(): Promise<void> {
        this.logger.info(`Parsing Service Layer metadata from: ${this.xmlFilePath}`);
        try {
            const xmlParser = new xml2js.Parser({ explicitArray: false });
            const xmlData = fs.readFileSync(this.xmlFilePath, 'utf-8');
            const parsedXml = await xmlParser.parseStringPromise(xmlData) as Record<string, unknown>;
            const edmxNode = parsedXml['edmx:Edmx'] as Record<string, unknown> | undefined;
            if (!edmxNode) {
                this.logger.error(`Invalid metadata XML: missing 'edmx:Edmx' root node in ${this.xmlFilePath}`);
                throw new Error("Invalid metadata XML: missing 'edmx:Edmx' root node");
            }

            const dataServices = edmxNode['edmx:DataServices'] as { Schema?: XmlNode } | undefined;
            if (!dataServices) {
                this.logger.error(`Invalid metadata XML: missing 'edmx:DataServices' node in ${this.xmlFilePath}`);
                throw new Error("Invalid metadata XML: missing 'edmx:DataServices' node");
            }

            const schema = dataServices.Schema as XmlNode | undefined;
            if (!schema) {
                this.logger.error(`Invalid metadata XML: missing 'Schema' node in ${this.xmlFilePath}`);
                throw new Error("Invalid metadata XML: missing 'Schema' node");
            }

            const entityContainerNode = schema.EntityContainer;
            const entityContainer = Array.isArray(entityContainerNode)
                ? entityContainerNode[0]
                : entityContainerNode;

            if (!entityContainer) {
                this.logger.error(`Invalid metadata XML: missing 'EntityContainer' node in ${this.xmlFilePath}`);
                throw new Error("Invalid metadata XML: missing 'EntityContainer' node");
            }

            const functionMap = new Map<string, XmlNode>();
            for (const fn of this.toArray(schema.Function)) {
                if (fn.$?.Name) {
                    functionMap.set(fn.$.Name, fn);
                }
            }

            const actionMap = new Map<string, XmlNode>();
            for (const action of this.toArray(schema.Action)) {
                if (action.$?.Name) {
                    actionMap.set(action.$.Name, action);
                }
            }

            const normalizedEntitySets: EntitySet[] = this.toArray(entityContainer.EntitySet).map((entitySet) => ({
                $: {
                    Name: entitySet.$?.Name || '',
                    EntityType: entitySet.$?.EntityType || '',
                    ServiceCode: this.getAnnotationString(entitySet, 'SAPB1.ServiceCode'),
                    TableName: this.getAnnotationString(entitySet, 'SAPB1.TableName')
                }
            }));

            const functionImportsFromFunctions: FunctionImport[] = this.toArray(entityContainer.FunctionImport).map((fnImport) => {
                const functionFullName = fnImport.$?.Function || '';
                const functionName = functionFullName.split('.').pop() || '';
                const fnDefinition = functionMap.get(functionName);
                const parameters = this.toArray(fnDefinition?.Parameter).map((parameter) => ({
                    $: {
                        Name: parameter.$?.Name || '',
                        Type: parameter.$?.Type || ''
                    }
                }));
                return {
                    $: {
                        Name: fnImport.$?.Name || functionName,
                        ReturnType: fnDefinition?.ReturnType?.$?.Type,
                        ServiceCode: this.getAnnotationString(fnImport, 'SAPB1.ServiceCode'),
                        HttpMethod: 'GET',
                        IsBindable: fnDefinition?.$?.IsBound === 'true',
                        ImportSource: 'FunctionImport'
                    },
                    Parameter: this.normalizeParameters(parameters)
                };
            });

            // OData v4 metadata also exposes action imports; normalize them to FunctionImport-like shape.
            const functionImportsFromActions: FunctionImport[] = this.toArray(entityContainer.ActionImport).map((actionImport) => {
                const actionFullName = actionImport.$?.Action || '';
                const actionName = actionFullName.split('.').pop() || '';
                const actionDefinition = actionMap.get(actionName);
                const parameters = this.toArray(actionDefinition?.Parameter).map((parameter) => ({
                    $: {
                        Name: parameter.$?.Name || '',
                        Type: parameter.$?.Type || ''
                    }
                }));
                return {
                    $: {
                        Name: actionImport.$?.Name || actionName,
                        ReturnType: actionDefinition?.ReturnType?.$?.Type,
                        ServiceCode: this.getAnnotationString(actionImport, 'SAPB1.ServiceCode'),
                        HttpMethod: 'POST',
                        IsBindable: actionDefinition?.$?.IsBound === 'true',
                        ImportSource: 'ActionImport'
                    },
                    Parameter: this.normalizeParameters(parameters)
                };
            });

            // Bound operations are defined at schema level (not in EntityContainer imports).
            const normalizedBoundFunctions: FunctionImport[] = this.toArray(schema.Function)
                .filter((fn) => fn.$?.IsBound === 'true')
                .map((fn) => {
                    const parameters = this.toArray(fn.Parameter).map((parameter) => ({
                        $: {
                            Name: parameter.$?.Name || '',
                            Type: parameter.$?.Type || ''
                        }
                    }));
                    return {
                        $: {
                            Name: fn.$?.Name || '',
                            ReturnType: fn.ReturnType?.$?.Type,
                            HttpMethod: 'GET',
                            IsBindable: true,
                            ImportSource: 'BoundFunction'
                        },
                        Parameter: this.normalizeParameters(parameters)
                    };
                });

            const normalizedBoundActions: FunctionImport[] = this.toArray(schema.Action)
                .filter((action) => action.$?.IsBound === 'true')
                .map((action) => {
                    const parameters = this.toArray(action.Parameter).map((parameter) => ({
                        $: {
                            Name: parameter.$?.Name || '',
                            Type: parameter.$?.Type || ''
                        }
                    }));
                    return {
                        $: {
                            Name: action.$?.Name || '',
                            ReturnType: action.ReturnType?.$?.Type,
                            HttpMethod: 'POST',
                            IsBindable: true,
                            ImportSource: 'BoundAction'
                        },
                        Parameter: this.normalizeParameters(parameters)
                    };
                });

            const normalizedEntityTypes: EntityType[] = this.toArray(schema.EntityType).map((entityType) => ({
                $: {
                    Name: entityType.$?.Name || ''
                },
                Key: {
                    PropertyRef: this.toArray(entityType.Key?.PropertyRef).map((propertyRef) => ({
                        $: {
                            Name: propertyRef.$?.Name || ''
                        }
                    }))
                },
                Property: this.toArray(entityType.Property).map((property) => ({
                    $: {
                        Name: property.$?.Name || '',
                        Type: property.$?.Type || 'Edm.String',
                        Alias: property.$?.Alias,
                        Nullable: property.$?.Nullable || 'true'
                    }
                }))
            }));

            const normalizedComplexTypes: ComplexType[] = this.toArray(schema.ComplexType).map((complexType) => ({
                $: {
                    Name: complexType.$?.Name || ''
                },
                Property: this.toArray(complexType.Property).map((property) => ({
                    $: {
                        Name: property.$?.Name || '',
                        Type: property.$?.Type || 'Edm.String',
                        Alias: property.$?.Alias,
                        Nullable: property.$?.Nullable || 'true'
                    }
                }))
            }));

            const normalizedEnumTypes: EnumType[] = this.toArray(schema.EnumType).map((enumType) => ({
                $: {
                    Name: enumType.$?.Name || ''
                },
                Member: this.toArray(enumType.Member).map((member) => ({
                    $: {
                        Name: member.$?.Name || '',
                        // For metadata.xml, valid persisted enum value is carried by SAPB1.ValidValue annotation.
                        Value: this.getAnnotationString(member, 'SAPB1.ValidValue') || member.$?.Value || ''
                    }
                }))
            }));

            this.schema = {
                EntityContainer: {
                    EntitySet: normalizedEntitySets,
                    FunctionImport: [...functionImportsFromFunctions, ...functionImportsFromActions]
                },
                EntityType: normalizedEntityTypes,
                ComplexType: normalizedComplexTypes,
                EnumType: normalizedEnumTypes
            };
            this.boundOperations = [...normalizedBoundFunctions, ...normalizedBoundActions];
            this.init = true;
            this.logger.info(
                `Metadata parse completed. entitySets=${normalizedEntitySets.length}, functionImports=${this.schema.EntityContainer.FunctionImport.length}, boundOperations=${this.boundOperations.length}, entityTypes=${normalizedEntityTypes.length}, complexTypes=${normalizedComplexTypes.length}, enumTypes=${normalizedEnumTypes.length}`
            );
        } catch (error) {
            this.logger.error(`Failed to parse metadata from ${this.xmlFilePath}: ${this.formatError(error)}`);
            throw error;
        }
    }

    // get the function imports
    async getFunctionImports(): Promise<FunctionImport[]> {
        await this.ensureParsed('getFunctionImports');
        const functionImports = this.schema.EntityContainer.FunctionImport;
        return functionImports;
    }

    async getGlobalFunctionImportList(): Promise<string[]> {
        await this.ensureParsed('getGlobalFunctionImportList');
        const functionImports = this.schema.EntityContainer.FunctionImport;
        const unbindFunctionImports = functionImports.filter((functionImport) => !functionImport.$.IsBindable);

        const entityContainer = this.schema.EntityContainer;
        const entitySets: EntitySet[] = entityContainer.EntitySet;

        // For each unbindFunctionImports, check if its service code is in the entitySets
        const filteredFunctionImports = [];
        for (const functionImport of unbindFunctionImports) {
            if (!functionImport.$.ServiceCode) {
                continue;
            }
            if (entitySets.find((entitySet) => entitySet.$.ServiceCode === functionImport.$.ServiceCode)) {
                continue;
            }
            filteredFunctionImports.push(functionImport);
        }
        const functionNames = filteredFunctionImports.map((functionImport) => functionImport.$.Name);
        return functionNames;
    }

    async getFunctionImportDetails(functionImportName: string): Promise<object | null> {
        await this.ensureParsed('getFunctionImportDetails');
        const functionImports = this.schema.EntityContainer.FunctionImport;
        const functionImport = functionImports.find((functionImport) => functionImport.$.Name === functionImportName);
        if (!functionImport) {
            this.logger.warn(`Function import not found: ${functionImportName}`);
            return null;
        }
        const functionImport2 = Array.isArray(functionImport.Parameter) ?
            Object.assign({}, functionImport.$, { Parameter: functionImport.Parameter.map((parameter) => parameter.$) }) :
            Object.assign({}, functionImport.$, { Parameter: functionImport.Parameter?.$ });
        delete functionImport2.ServiceCode;
        return {
            ODataFunctionCallInstruction: ODATA_FUNCTION_CALL_INSTRUCTION,
            ODataUnbindFunction: functionImport2,
        };
    }

    async getEntitySetList(): Promise<string[]> {
        await this.ensureParsed('getEntitySetList');
        const entityContainer = this.schema.EntityContainer;
        const entitySets: EntitySet[] = entityContainer.EntitySet;

        const entitySetNames = [];
        for (const entitySet of entitySets) {
            if (entitySet.$.Name.startsWith('U_')) {
                continue;
            }
            if (entitySet.$.Name.startsWith('B1Sessions')) {
                continue;
            }
            entitySetNames.push(entitySet.$.Name);
        }
        return entitySetNames;
    }

    async getEntitySetDetails(entitySetName: string): Promise<object | null> {
        await this.ensureParsed('getEntitySetDetails');
        const entityContainer = this.schema.EntityContainer;
        const entitySets: EntitySet[] = entityContainer.EntitySet;
        const entitySet = entitySets.find((entitySet) => entitySet.$.Name === entitySetName);
        if (!entitySet) {
            this.logger.warn(`EntitySet not found: ${entitySetName}`);
            return null;
        }
        const { properties, keyProperties } = await this.getEntityTypeProperties(entitySet.$.EntityType);
        const functionImports = this.schema.EntityContainer.FunctionImport;
        const unbindFunctionImports = functionImports.filter((functionImport) => !functionImport.$.IsBindable);

        // For each unbindFunctionImports, check if its service code is in the entitySets
        const filteredFunctionImports = [];
        for (const functionImport of unbindFunctionImports) {
            if (!functionImport.$.ServiceCode) {
                continue;
            }
            if (entitySet.$.ServiceCode !== functionImport.$.ServiceCode) {
                continue;
            }
            functionImport.$.IsBindable = false;

            const functionImport2 = Array.isArray(functionImport.Parameter) ?
                Object.assign({}, functionImport.$, { Parameter: functionImport.Parameter.map((parameter) => parameter.$) }) :
                Object.assign({}, functionImport.$, { Parameter: functionImport.Parameter?.$ });
            delete functionImport2.ServiceCode;
            filteredFunctionImports.push(functionImport2);
        }

        // handle the bindable function imports. Bindable function imports are those that are bound to an entity set
        const bindFunctionImports = this.boundOperations;
        const filteredBindFunctionImports = [];
        for (const functionImport of bindFunctionImports) {
            const parameter = functionImport.Parameter;
            if (!parameter) {
                continue;
            }
            const bindParameter = Array.isArray(parameter) ? parameter[0] : parameter;
            if (bindParameter.$.Type !== entitySet.$.EntityType) {
                continue;
            }

            const functionImport2 = Array.isArray(functionImport.Parameter) ?
                Object.assign({}, functionImport.$, { Parameter: functionImport.Parameter.map((parameter) => parameter.$) }) :
                Object.assign({}, functionImport.$, { Parameter: functionImport.Parameter?.$ });

            delete functionImport2.ServiceCode;
            filteredBindFunctionImports.push(functionImport2);
        }

        const ret = {
            Name: entitySet.$.Name,
            ServiceCode: entitySet.$.ServiceCode || '',
            TableName: entitySet.$.TableName || '',
            EntityType: {
                Name: entitySet.$.EntityType,
                KeyProperties: keyProperties,
                Properties: properties
            },
            ODataFunctionCallInstruction: ODATA_FUNCTION_CALL_INSTRUCTION,
            ODataUnbindFunctions: filteredFunctionImports,
            ODataBindableFunctions: filteredBindFunctionImports
        };
        return ret;
    }

    async getEntityTypeProperties(entityTypeName: string): Promise<{ properties: { Name: string; Type: string }[]; keyProperties: string[] }> {
        await this.ensureParsed('getEntityTypeProperties');
        const shortEntityTypeName = entityTypeName.split('.').pop();

        const entityTypes = this.schema.EntityType;
        const entityType = entityTypes.find((entityType) => entityType.$.Name === shortEntityTypeName);
        if (!entityType) {
            this.logger.error(`EntityType not found while reading properties: ${entityTypeName}`);
            throw new Error(`EntityType ${entityTypeName} not found`);
        }

        const properties = [];
        for (const property of entityType.Property) {
            if (property.$.Name.startsWith('U_')) {
                continue;
            }
            properties.push({
                Name: property.$.Name,
                Type: property.$.Type
            });
        }

        const keyProperties = Array.isArray(entityType.Key.PropertyRef)
            ? entityType.Key.PropertyRef.map((propertyRef) => propertyRef.$.Name)
            : [entityType.Key.PropertyRef.$.Name];

        return { properties: properties, keyProperties: keyProperties };
    }

    async getTypeDetails(typeName: string): Promise<object | null> {
        await this.ensureParsed('getTypeDetails');
        const properties = [];
        const shortTypeName = typeName.split('.').pop();

        const complexTypes = this.schema.ComplexType;
        const complexType = complexTypes.find((complexType) => complexType.$.Name === shortTypeName);
        if (complexType) {
            for (const property of complexType.Property) {
                if (property.$.Name.startsWith('U_')) {
                    continue;
                }
                properties.push({
                    Name: property.$.Name,
                    Type: property.$.Type
                });
            }
            return {
                typeCategory: 'ComplexType',
                typeName: typeName,
                properties: properties
            };
        }

        const entityTypes = this.schema.EntityType;
        const entityType = entityTypes.find((entityType) => entityType.$.Name === shortTypeName);
        if (entityType) {
            for (const property of entityType.Property) {
                if (property.$.Name.startsWith('U_')) {
                    continue;
                }
                properties.push({
                    Name: property.$.Name,
                    Type: property.$.Type
                });
            }

            const keyProperties = Array.isArray(entityType.Key.PropertyRef)
                ? entityType.Key.PropertyRef.map((propertyRef) => propertyRef.$.Name)
                : [entityType.Key.PropertyRef.$.Name];
            return {
                typeCategory: 'EntityType',
                typeName: typeName,
                properties: properties,
                keyProperties: keyProperties
            };
        }

        const enumTypes = this.schema.EnumType;
        const enumType = enumTypes.find((enumType) => enumType.$.Name === shortTypeName);
        if (enumType) {
            for (const member of enumType.Member) {
                properties.push({
                    Name: member.$.Name,
                    Value: member.$.Value
                });
            }
            return {
                typeCategory: 'EnumType',
                typeName: typeName,
                members: properties
            };
        }
        this.logger.error(`Type not found while reading details: ${typeName}`);
        throw new Error(`Type '${typeName}' not found`);
    }

    async validateProperties(entityTypeName: string, propertyList: string[]): Promise<string[]> {
        await this.ensureParsed('validateProperties');
        const shortEntityTypeName = entityTypeName.split('.').pop();
        const entityTypes = this.schema.EntityType;
        const entityType = entityTypes.find((entityType) => entityType.$.Name === shortEntityTypeName);
        if (!entityType) {
            this.logger.error(`EntityType not found while validating properties: ${entityTypeName}`);
            throw new Error(`EntityType ${entityTypeName} not found`);
        }
        const invalidProperties = [];
        const properties = entityType.Property;
        for (const propertyName of propertyList) {
            if (!properties.find((property) => property.$.Name === propertyName)) {
                invalidProperties.push(propertyName);
            }
        }
        return invalidProperties;
    }

    async validateComplexTypeProperty(complexTypeName: string, propertyList: string[]): Promise<string[]> {
        await this.ensureParsed('validateComplexTypeProperty');
        const shortComplexTypeName = complexTypeName.split('.').pop();
        const complexTypes = this.schema.ComplexType;
        const complexType = complexTypes.find((complexType) => complexType.$.Name === shortComplexTypeName);
        if (!complexType) {
            this.logger.error(`ComplexType not found while validating properties: ${complexTypeName}`);
            throw new Error(`ComplexType ${complexTypeName} not found`);
        }

        const invalidProperties = [];
        const properties = complexType.Property;
        for (const propertyName of propertyList) {
            if (!properties.find((property) => property.$.Name === propertyName)) {
                invalidProperties.push(propertyName);
            }
        }
        return invalidProperties;
    }

    async validateEntitySet(entitySetName: string): Promise<boolean> {
        await this.ensureParsed('validateEntitySet');
        const entityContainer = this.schema.EntityContainer;
        const entitySets: EntitySet[] = entityContainer.EntitySet;
        return Boolean(entitySets.find((entitySet) => entitySet.$.Name === entitySetName));
    }

    async validateEntitySetProperties(entitySetName: string, propertyList: string[]): Promise<string[]> {
        await this.ensureParsed('validateEntitySetProperties');

        const entityContainer = this.schema.EntityContainer;
        const entitySets: EntitySet[] = entityContainer.EntitySet;
        const entitySet = entitySets.find((entitySet) => entitySet.$.Name === entitySetName);
        if (!entitySet) {
            this.logger.error(`EntitySet not found while validating properties: ${entitySetName}`);
            throw new Error(`EntitySet ${entitySetName} not found`);
        }
        return this.validateProperties(entitySet.$.EntityType, propertyList);
    }
}