---
name: webclient-uiapi-add-view
description: Add a new view to an existing SAP Business One Web Client UI API module through a guided conversation. Use when the user wants to add a view — including free-form requests like "add a sales order detail view to the Sales module". Parses user intent, infers missing fields where possible, confirms inferred values, then calls WebClientUIAPI_addView with structured JSON.
user-invocable: true
---

# Add UI API View

This skill parses the user's request (free-form or structured), extracts and infers as many fields as possible, confirms the result, collects only what is still missing, and then adds the view.

## Core Rules

- Work only in an existing UI API app workspace.
- Call `WebClientUIAPI_getCurrentAppInformation` first to verify app context and load existing modules.
- Parse the user's initial message for pre-fillable fields before asking anything.
- Present a pre-fill summary of extracted and inferred values; ask the user to confirm or correct it.
- Ask only for fields that could not be extracted or inferred.
- Ask one field at a time with `vscode_askQuestions` when available; use plain chat only when needed.
- Use compact `Yes` / `No` choices for confirmation prompts.
- Normalize `moduleName` and `viewName` to PascalCase before storing, summarizing, or writing; do not mention the transformation unless the user explicitly asks.
- Validate `baseViewName` against the `name` values in `skills/assets/viewsMeta.json` and resolve its metadata (at minimum `viewId`).
- Never edit `webapp/`; source of truth is `<module>/src/`.
- Execute `WebClientUIAPI_addView` only after explicit summary confirmation.
- This skill is the default and required path for view-addition intents. Do not bypass it by directly calling `WebClientUIAPI_addView` unless the user explicitly requests direct tool usage.

---

## Phase 0: Intent Parsing

Run this phase immediately when the skill is invoked, before any guided steps.

### 0.1 Extract Fields from the User's Message

Scan the user's message for the following signals:

| Field | How to detect |
|---|---|
| **Module name** | Explicitly stated target module (e.g., "to the Sales module", "under Purchasing", "in Inventory") |
| **View name** | Explicitly stated view name (e.g., "view named SalesOrderDetail", "call it PurchaseDetail") |
| **View reference** | Any phrase resembling a SAP B1 view name (e.g., "sales order detail", "purchase order detail view", "service call") |
| **Base view category** | Explicit mention of UDT, UDO, or System (e.g., "based on a UDT", "UDO called MyObject") |

### 0.2 View Fuzzy Matching

First, determine the Base View Category from the user's message:

- If the user mentions **UDT** or **UDO** (e.g., "based on a UDT", "UDO called MyObject"), set `baseViewCategory` to `UDT` or `UDO` accordingly and **skip the `skills/assets/viewsMeta.json` search entirely** — instead, ask the user for the UDT/UDO name or ID directly. Do not attempt to match it against the catalog.
- Otherwise, assume `System` category and proceed with the fuzzy match below.

**For System category only:**

1. Normalize: strip the word "view" / "views", trim whitespace, title-case the remainder.
2. Search `viewsMeta.json` names for an **exact match** first.
3. If no exact match, search for a **contains match** (e.g., "sales order detail" matches "Sales Order Detail").
4. If multiple candidates match, offer them as choices and ask the user to pick one.
5. If no match at all, tell the user and show the full list so they can pick.
6. Once matched, record the canonical `name` and set `baseViewCategory` to `System`.

### 0.3 Module Inference from View

If the target module was **not** explicitly stated, use the existing modules from `WebClientUIAPI_getCurrentAppInformation` as the primary source for inference:

1. **Single module** — if the app has exactly one module, infer it automatically.
2. **View-based match** — use the table below to derive a candidate module name from the matched view, then check whether a module with that name exists in the app. If it does, infer it. If it does not, leave the module blank and ask (presenting the existing modules as choices).
3. **No table match** — if the view cannot be matched via the table, leave the module blank and ask (presenting the existing modules as choices).

| Matched view name contains… | Inferred module |
|---|---|
| Sales Quotation, Sales Order, Sales Draft | Sales |
| Delivery, Deliveries | Sales |
| A/R Invoice, A/R Credit Memo, A/R Reserve Invoice | Sales |
| Return (non-goods), Return Request | Sales |
| Docs in Approval Process | Sales |
| Purchase Order, Purchase Quotation, Purchase Request | Purchasing |
| Goods Receipt PO, Goods Return, Goods Return Request | Purchasing |
| A/P Invoice, A/P Credit Memo, A/P Reserve Invoice | Purchasing |
| Goods Issue, Goods Receipt (standalone), Inventory Counting, Inventory Transfer | Inventory |
| Service Contract, Service Call, Equipment Card, Solutions Knowledge Base | Service |
| Production Order, Issue for Production, Receipt from Production, Bill of Materials | Production |
| Journal Entry, Outgoing Payment, Incoming Payment, Recurring Journal, Journal Voucher | Finance |
| Business Partner | BusinessPartner |
| Activity, Time Sheet | Activity |
| Opportunity | Opportunity |
| Approval Decisions, Outgoing Payments in Approval Process | Finance |

### 0.4 Pre-fill Summary

After parsing, display a Markdown table summary of what was understood **before asking anything**. Use the `Source` column to show how each value was determined:

| Field | Value | Source |
|-------|-------|--------|
| Module | Sales | inferred from view |
| View Name | SalesOrderDetail | from your message |
| Base View | Sales Order Detail | matched in catalog |
| Category | System | default for standard views |

> Does this look right? If yes, I'll ask only for the missing fields. If anything is wrong, tell me what to change.

- If the user confirms, skip directly to collecting only the **missing** fields.
- If the user corrects a field, update it and display the revised summary before continuing.
- If nothing was parseable from the user's message, skip the summary and begin the guided flow from Step 1.

---

## Step 0: Load App Context

- Call `WebClientUIAPI_getCurrentAppInformation`.
- If no app is detected, stop and ask the user to open the target workspace.
- Capture existing module names for validation and module inference verification.

## Step 1: Explain Inputs (skip if pre-fill summary was shown and confirmed)

Explain that the workflow collects:

- Target module name (must already exist in the app)
- View name
- Base view category and base view name

State that file updates happen only after final summary approval.

## Step 2: Collect Inputs

Collect only the fields not already confirmed in Phase 0, one at a time:

1. `moduleName` — must already exist in the app; present existing modules as choices when possible
2. `viewName` — required, PascalCase, must be unique in the target module
3. `baseViewCategory` — `System`, `UDT`, or `UDO`; prefer fixed choices
4. `baseViewName`:
   - For **System**: must match a `name` entry in `skills/assets/viewsMeta.json`; prefer searchable or fixed choices
   - For **UDT** / **UDO**: accept any user-provided name or ID; no catalog check

For invalid input, explain the issue and re-ask only that field.

## Step 3: Confirm Summary

Present a readable summary in a Markdown table using normalized values:

| Field | Value |
|-------|-------|
| Module | Sales |
| View Name | SalesOrderDetail |
| Base View Category | System |
| Base View Name | Sales Order Detail |

Ask: `Does this look correct? (Yes/No)`

- If `No`, update only affected fields and show the full summary again.
- If `Yes`, continue.

## Step 4: Execute Tool

Call `WebClientUIAPI_addView` only after confirmation.

Example payload:

```json
{
  "moduleName": "Sales",
  "viewName": "MyCustomSalesOrderView",
  "baseViewCategory": "System",
  "baseViewName": "Sales Order Detail"
}
```

If the tool fails, show the error, collect the correction, and retry.

## Step 5: Validate Output

Verify:

- `<module>/src/controller/<ViewName>.ts` exists
- `<module>/src/layout/<ViewName>.layout.json` exists
- `<module>/src/manifest.json` has one new `b1.bundles` entry for `<ViewName>.layout`
- no edits were made under `webapp/`

Then ensure `npm start` is running; if not, start it and check for healthy output.

## Recovery (If Tool Execution Fails)

If `WebClientUIAPI_addView` returns an error after retries:

- Show the error and collect only the corrected input field(s).
- Retry `WebClientUIAPI_addView` with updated values.
- If a manual fix is explicitly required, edit only `<module>/src/` files and validate any JSON edits against schemas from `WebClientUIAPI_getSchemaFilePath` (`Manifest`, `ViewLayout`, `Controls`, `Common`).

---

## Example Prompts

**Free-form (skill infers and fills):**
- `Add a sales order detail view to the Sales module.`
- `Add a purchase order detail view under Purchasing.`
- `Add a service call view to the Service module, call it ServiceCallMain.`
- `Add an inventory transfer view.`

**Partial (skill infers what it can, asks for the rest):**
- `Add a sales order detail view.` *(module inferred from view; view name missing — will ask)*
- `Add a view to the Sales module.` *(no view reference — will ask for view details)*
- `I want to add a view based on a UDT called MyCustomTable.` *(module and view name missing — will ask)*

**Guided (skill asks all questions):**
- `Add a new view to my existing UI API app.`
- `Help me add a view under the Sales module.`
- `Add a Business Partner detail extension view to an existing module.`
