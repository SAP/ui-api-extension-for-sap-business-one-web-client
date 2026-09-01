---
name: webclient-uiapi-service-layer-playbook
description: Guide for SAP Business One Web Client UI API developers who need to call SAP Business One Service Layer from an extension, including manifest allowlists, SDKEnv usage, refresh, and metadata validation.
user-invocable: false
---

# Service Layer From UI API

Use this skill when a user wants a Web Client UI API app to read or write SAP Business One data through Service Layer.

## Primary Goal

Help the user implement the shortest correct path from a UI API controller to Service Layer while respecting the sandbox, manifest allowlists, and `SDKEnv`.

## What To Inspect First

Before suggesting code or changes, inspect:

1. The module `manifest.json` that will host the call
2. Existing controller patterns in the same module
3. The UI API wiki pages for `sdk-env`, `service-layer-api`, and `security`
4. Service Layer metadata when entity, function, or property names are uncertain

## Core Rules

- Prefer `oEnv.getService()` for all backend calls made from a UI API controller.
- Use `services.ServiceLayer` for SAP Business One Service Layer entities, bound operations, and unbound operations.
- Must use OData v4 syntax and conventions in all examples and generated guidance.
- Validate the target API against the module `manifest.json` before proposing code.
- Treat allowlists as module-scoped.
- CSRF is handled by the framework for SDK service clients.
- Call `await oEnv.refresh()` after successful writes.
- Wrap all async Service Layer calls in `oView.showBusy()` and `oView.hideBusy()`.

## Manifest Rules

Check `manifest.json` against `schema/manifest.schema.json` before recommending code.

- `allowedServiceLayerAPIs` must include every Service Layer entity or service the module reads or writes.
- Use `authorization: "readOnly"` when the module only reads data.
- Use `authorization: "full"` only when create, update, delete, or action calls are required.
- `"*"` is development-only and unsafe for production.

### Example Allowlist

For a module that reads `BusinessPartners` and updates `Orders`:

```json
{
	"allowedServiceLayerAPIs": [
		{
			"api": "BusinessPartners",
			"authorization": "readOnly",
			"description": "Read business partner master data"
		},
		{
			"api": "Orders",
			"authorization": "full",
			"description": "Read and update sales orders"
		}
	]
}
```

Add exact operation names for bound actions or unbound functions as separate entries.

## Service Layer Decision Tree

When answering the user, choose the right client first:

- SAP B1 entity CRUD, actions, or functions: `ServiceLayer`

If the user is unsure which Service Layer object to call, resolve metadata first by discovering available metadata tooling.

### Metadata Tooling

When programming with Service Layer, consulting the relevant metadata tools is always recommended before writing final queries, payloads, or operation calls.

Prefer validation over assumptions.

Use metadata to confirm entity set names, bound versus unbound operations, complex type fields, and enum members. For unbound functions with complex typed parameters, use the parameter name as the top-level body property. For bound actions, call the entity URL and omit the binding parameter from the body.

## Runtime Usage Pattern

Use this as the default controller pattern:

```javascript
const oView = await oEnv.ActiveView();
oView.showBusy();
try {
	const services = await oEnv.getService();
	const res = await services.ServiceLayer.get("Orders?$top=1");

	if (!res.isSuccess()) {
		throw new Error(`Service Layer request failed with status ${res.getStatus()}`);
	}

	const data = res.getData();
	console.log(data);
} finally {
	oView.hideBusy();
}
```

## Common Service Layer Scenarios

Use these patterns when the user asks for a concrete implementation.

### Read and write

Read by key or with a filter:

```javascript
const services = await oEnv.getService();
const res = await services.ServiceLayer.get("BusinessPartners('C20000')");

if (res.isSuccess()) {
	console.log(res.getData());
}
```

Update a document and refresh the view:

```javascript
const services = await oEnv.getService();
const res = await services.ServiceLayer.patch("Orders(123)", {
	Comments: "Updated from UI API"
});

if (res.isSuccess()) {
	await oEnv.refresh();
}
```

Call a bound action on the entity URL:

```javascript
const services = await oEnv.getService();
const res = await services.ServiceLayer.post("Orders(123)/Cancel", {});
```

Call an unbound function with the payload defined by metadata:

```javascript
const services = await oEnv.getService();
const res = await services.ServiceLayer.post("CompanyService_UpdateAdminInfo", {
	AdminInfo: {
		EnableWebhook: "tYES",
		ExcelFolderPath: "",
		XMLFileFolderPath: ""
	}
});
```

Validate the exact entity or function name before giving the final payload.

## Common OData Query Examples

Use these examples for read-only retrieval.

### Get all records with ordering and paging

```javascript
const services = await oEnv.getService();
const res = await services.ServiceLayer.get("Items?$select=ItemCode,ItemName&$top=3&$skip=2&$orderby=ItemCode asc");
```

### Filter by business data

```javascript
const services = await oEnv.getService();
const res = await services.ServiceLayer.get("BusinessPartners?$filter=CardType eq 'cCustomer' and startswith(CardCode,'C00')");
```

### Expand navigation properties

```javascript
const services = await oEnv.getService();
const res = await services.ServiceLayer.get("Orders(1208)?$select=CardCode,BusinessPartner/MailAddress,BusinessPartner/Phone1&$expand=BusinessPartner");
```

Example response:

```json
{
	"@odata.context": "$metadata#Orders/$entity",
	"@odata.etag": "W/\"356A192B7913B04C54574D18C28D46E6395428AB\"",
	"BusinessPartner": {
		"MailAddress": "Plynarenska",
		"Phone1": "00421 2 582 56 33"
	},
	"CardCode": "C25000"
}
```

### Aggregate values

```javascript
const services = await oEnv.getService();
const res = await services.ServiceLayer.get("Orders?$apply=aggregate(DocRate with sum as TotalDocRate)");
```

Example response:

```json
{
	"@odata.context": "$metadata#Orders(TotalDocRate)",
	"value": [
		{
			"@odata.id": null,
			"TotalDocRate": 1254.26081
		}
	]
}
```

### Get max DocEntry from Orders

```javascript
const services = await oEnv.getService();
const res = await services.ServiceLayer.get("Orders?$apply=aggregate(DocEntry with max as MaxDocEntry)");
```

Example response:

```json
{
	"@odata.context": "$metadata#Orders(MaxDocEntry)",
	"value": [
		{
			"@odata.id": null,
			"MaxDocEntry": 12345
		}
	]
}
```

### Group records and aggregate together

```javascript
const services = await oEnv.getService();
const res = await services.ServiceLayer.get("Orders?$apply=groupby((CardCode), aggregate(DocNum with sum as TotalDocNum))");
```

### Filter before grouping

```javascript
const services = await oEnv.getService();
const res = await services.ServiceLayer.get("Orders?$apply=filter(CardCode eq 'c001')/groupby((CardCode), aggregate(DocNum with sum as TotalDocNum))");
```

Example response:

```json
{
  "@odata.context": "$metadata#Orders(CardCode,TotalDocNum)",
  "value": [
    {
      "@odata.id": null,
      "CardCode": "BA01",
      "TotalDocNum": 6025
    }
  ]
}
```

### Cross-join between entities

Use cross-joins when you need data from multiple entities in one query:

```javascript
const services = await oEnv.getService();
const res = await services.ServiceLayer.get("$crossjoin(Orders,BusinessPartners)?$expand=Orders($select=DocEntry,DocNum),BusinessPartners($select=CardCode)&$filter=Orders/CardCode eq BusinessPartners/CardCode and Orders/DocNum le 3 and startswith(BusinessPartners/CardCode,'c00')");
```

Validate the entity, fields, and aggregate functions against metadata before using them in the final request.

## OData Batch Example

Use batch requests when multiple operations must be sent together as a single POST to `/$batch`.

```http
POST $batch
OData-Version: 4.0
Content-Type: multipart/mixed;boundary=batch_36522ad7-fc75-4b56-8c71-56071383e77b

--batch_36522ad7-fc75-4b56-8c71-56071383e77b
Content-Type: application/http
Content-Transfer-Encoding: binary

GET Items('i001')

--batch_36522ad7-fc75-4b56-8c71-56071383e77b
Content-Type: multipart/mixed;boundary=changeset_77162fcd-b8da-41ac-a9f8-9357efbbd

--changeset_77162fcd-b8da-41ac-a9f8-9357efbbd
Content-Type: application/http
Content-Transfer-Encoding: binary
Content-ID: 1

POST Items
Content-Type: application/json

{ /* create payload */ }

--changeset_77162fcd-b8da-41ac-a9f8-9357efbbd
Content-Type: application/http
Content-Transfer-Encoding: binary
Content-ID: 2

PATCH $1
Content-Type: application/json

{ /* update payload */ }

--changeset_77162fcd-b8da-41ac-a9f8-9357efbbd--
--batch_36522ad7-fc75-4b56-8c71-56071383e77b--
```

Change sets roll back together if one request fails. Batch requests must use POST.

## Response Handling

Service Layer calls return a `Response` object.

- `isSuccess()` to gate success logic
- `getStatus()` for error reporting
- `getData()` for payload access
- `getHeaders()` for response metadata when needed

## Recommended Output Style

When responding, give the user:

1. The required manifest allowlist entries.
2. The runtime call pattern.
3. Any metadata or payload validation needed.
4. Whether a post-write `refresh()` is required.

If code is requested, provide a small controller-oriented example unless the user explicitly needs a standalone query or payload.

## Related Sources

- `references/document/uiapi-wiki/concepts/sdk-env.md`
- `references/document/uiapi-wiki/concepts/service-api.md`
- `references/document/uiapi-wiki/concepts/security.md`
- `schema/manifest.schema.json`
