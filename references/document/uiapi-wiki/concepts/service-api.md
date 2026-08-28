---
title: "Service API (via getService)"
aliases: [getService, ServiceLayer, ViewLinkService, ExternalService, service clients]
tags: [service-layer, extension-architecture, sdk-env]
source_count: 2
---

## Definition

`oEnv.getService()` returns an object with three service clients for making HTTP calls from within an extension. All three return a `Response` object with a consistent interface.

## The three service types

| Client | Access via | HTTP methods | Backend |
|---|---|---|---|
| `ServiceLayer` | `services.ServiceLayer` | GET, POST, PUT, PATCH, DELETE | SAP B1 Service Layer (oData V4) |
| `ViewLinkService` | `services.ViewLinkService` | GET only | Web Client view link / variants API |
| `ExternalService` | `services.ExternalService` | GET, POST, PUT, PATCH, DELETE | Any external HTTP endpoint |

## Method signatures

### ServiceLayer and ExternalService

```typescript
get(url: string, headers?: object): Promise<Response>
post(url: string, data: object, headers?: object): Promise<Response>
put(url: string, data: object, headers?: object): Promise<void | Response>
patch(url: string, data: object, headers?: object): Promise<void | Response>
delete(url: string, headers?: object): Promise<void | Response>
```

ExternalService `get/post/put/patch/delete` accept an `options` object instead of bare `headers`:

| Option | Type | Notes |
|---|---|---|
| `headers` | `object` | Additional request headers |
| `mode` | `string` | CORS mode: `"cors"` (default), `"no-cors"`, `"same-origin"` |

### ViewLinkService

```typescript
get(url: string, headers?: object): Promise<Response>
```

The framework automatically prepends `/extn` to the URL, so all code uses `/api/...` paths. Two families of endpoints are available:

#### Object View endpoints

| Endpoint | Response | Purpose |
|---|---|---|
| `GET /api/Variants?objName=&objType=` | JSON `[{Guid, Name}]` | Saved list view variants for an object |
| `GET /api/objectsListView?objName=&objType=&variantGUID=` | text/html URL | Web Client list view URL |
| `GET /api/objectsDetailView?objName=&objType=&value=` | text/html URL | Detail view URL for a specific record |
| `GET /api/objectsDetailView?objName=Drafts&value=&subObjName=` | text/html URL | Detail view for a draft document |
| `GET /api/objectsDetailView?objName=Configuration&value=` | text/html URL | Configuration object detail view |

**Parameters:**
- `objType` — optional for System objects; values: `'System'`, `'UDO'`, `'UDT'`
- `objName` — for System objects use the system object name (see list below); for UDO use the UDO code as defined in B1 (e.g. `MyItem`); for UDT use the UDT code as defined in B1 (e.g. `2_AUTO_INCRE`)
- `variantGUID` — from the `Guid` field in the `/api/Variants` response
- `value` — the record's primary key: `DocEntry` (internal number, not DocNum) for documents; `ItemCode` for items; etc.

> **UDO gotcha:** for UDO detail views, the response URL uses the UDO's internal table name with `@` prefix (e.g. `@OOTM`), not the UDO code (`MyItem`) that was passed as `objName`.

**Draft `subObjName` values:** `PurchaseQuotations`, `ARDownPaymentInvoice`, `APDownPaymentRequest`, `Invoices`, `ReturnRequest`, `CreditNotes`, `DeliveryNotes`, `ReserveInvoices`, `PurchaseRequests`, `Returns`, `PurchaseReserveInvoices`, `Orders`, `PurchaseInvoices`, `GoodsReturnRequest`, `PurchaseCreditNotes`, `PurchaseDeliveryNotes`, `PurchaseReturns`, `PurchaseOrders`, `Quotations`

**Resolving DocNum → DocEntry** (DocEntry is the `value` param for most documents):
```javascript
// GET /b1s/v2/Orders?$filter=DocNum eq 1204&$select=DocEntry
// → { "value": [{ "DocEntry": 1217 }] }
```

#### Analytics View endpoints

| Endpoint | Response | Purpose |
|---|---|---|
| `GET /api/analyticsViews?analyticsType=` | JSON `[{viewId, text, description}]` | All view codes for an analytics type |
| `GET /api/analyticsViewVariants?viewCode=&analyticsType=` | JSON `[{Guid, Name}]` | Variants for a specific analytics view — same shape as `/api/Variants` |
| `GET /api/analyticsView?viewCode=&analyticsType=&variantGUID=` | text/html URL | Web Client analytics view URL |

**`analyticsType`** values: `'Dashboard'` or `'ChartContainer'`. Response varies by user authorization and database type.

#### System object names (objName values for System type)

`Activities`, `ApprovalRequests`, `BusinessPartners`, `CreditNotes`, `DeliveryNotes`, `Drafts`, `Invoices`, `Items`, `Orders`, `PurchaseCreditNotes`, `PurchaseDeliveryNotes`, `PurchaseInvoices`, `PurchaseOrders`, `PurchaseQuotations`, `PurchaseReturns`, `Quotations`, `ReserveInvoices`, `Returns`, `Opportunities`, `IncomingPayments`, `TimeSheets`, `SolutionsKnowledgeBase`, `ServiceCall`, `BusinessPartnerCatalogNumbers`, `OutgoingPayments`, `UserQueries`, `InventoryGenExit`, `CustomerEquipmentCards`, `ApprovalDecisions`, `OutgoingPaymentsInApprovalProcess`, `JournalEntries`, `ReturnRequest`, `GoodsReturnRequest`, `PurchaseRequests`, `InventoryCounting`, `ServiceContracts`, `InventoryGenEntry`, `ProductionOrders`, `IssueForProduction`, `ReceiptFromProduction`, `PurchaseReserveInvoice`, `BillOfMaterial`, `UserDefinedFields`, `Configuration`, `InventoryTransfer`, `RecurringPostings`, `JournalVoucher`, `ChartOfAccounts`, `InventoryTransferRequest`, `SalesAndPurchasingLandedCosts`, `Deposits`, `ExchangeRates`, `SalesBlanketAgreements`, `PurchaseBlanketAgreements`, `RecurringTransactions`, `RecurringTransactionsTemplates`, `ARDownPaymentInvoices`, `APDownPaymentInvoices`, `InventoryCountingDrafts`, `LandedCosts`, `PaymentRuns`, `ARCorrectionInvoices`, `APCorrectionInvoices`, `ARCorrectionInvoiceReversals`, `APCorrectionInvoiceReversals`, `InventoryPostings`, `InventoryOpeningBalances`, `InventoryOpeningBalanceDrafts`, `ChecksForPayment`, `VoidChecksForPayments`, `InternalReconciliations`, `Employees`, `ProjectManagement`, `InventoryRevaluation`, `Reconciliations`, `PreviousExternalReconciliations`, `Campaigns`, `Forecasts`, `MRPRuns`, `PickLists`, `Resources`, `DatevExport`, and ~15 more (see [[11-view-link-api]] for full list)

#### Two-step pattern for list views

```javascript
const { ViewLinkService } = await oEnv.getService();

// Step 1: get variants
const varRes = await ViewLinkService.get("/api/Variants?objName=Orders");
const variants = varRes.getData(); // [{Guid, Name}, ...]

// Step 2: get the list view URL
const urlRes = await ViewLinkService.get(
  "/api/objectsListView?objName=Orders&variantGUID=" + variants[0].Guid
);
const listViewURL = urlRes.getData();
```

## Response object

All three clients return the same `Response` shape:

| Method | Returns | Notes |
|---|---|---|
| `isSuccess()` | `boolean` | `true` if HTTP 2xx |
| `getStatus()` | `int` | HTTP status code |
| `getHeaders()` | `object` | Response headers (**not available for ExternalService**) |
| `getData()` | `object` | Response body |

## Usage patterns

### Service Layer CRUD

```javascript
const { ServiceLayer } = await oEnv.getService();

// Read
const res = await ServiceLayer.get("Orders?$filter=DocNum eq 1");

// Write
const res = await ServiceLayer.post("Orders", {
  CardCode: "C70000",
  DocDueDate: "2024-04-04",
  DocumentLines: [{ ItemCode: "A00001", Quantity: "10", UnitPrice: "30" }]
});

if (res.isSuccess()) {
  console.log(res.getData());
} else {
  console.error(res.getStatus());
}
```

### View Link API

See the two-step pattern in the ViewLinkService section above.

### External Service

```javascript
const { ExternalService } = await oEnv.getService();
const res = await ExternalService.get("https://my-api.example.com/data", {
  headers: { "Authorization": "Bearer <token>" },
  mode: "cors"
});
```

For production auth, use [[sdk-env]]'s `authenticateExternalService` instead of hardcoding tokens.

## Gotchas and traps

- **CORS**: ExternalService calls are cross-origin; the target server must enable CORS or the browser will block the call. This is a server-side requirement, not something the extension can work around.
- **URL pre-declaration**: Service Layer URLs must be in `allowedServiceLayerAPIs`, external URLs in `allowedExternalURLs` in `manifest.json` (see [[security]]).
- **`getHeaders()` on ExternalService**: not supported — returns nothing meaningful. Use only for Service Layer / ViewLinkService responses.
- **Auth tokens in code**: hardcoding for dev/test only. Use `oEnv.authenticateExternalService()` in production.
- **After writes, call `refresh()`**: Service Layer mutations don't automatically update the view; call `await oEnv.refresh()` after a successful write.

## Connections

Related concepts: [[sdk-env]], [[security]], [[data-binding]]

## Sources

- [[02-sdkenv]] — defines all three service clients, Response interface, and usage examples
- [[11-view-link-api]] — full ViewLinkService endpoint catalog, system object names, analytics APIs
