---
name: webclient-uiapi-add-module
description: Add a new module to an existing SAP Business One Web Client UI API app through a guided conversation. Use when the user wants to add a module — including free-form requests like "add a Sales module with sales order detail view". Parses user intent, infers missing fields where possible, confirms inferred values, then calls WebClientUIAPI_addModule with structured JSON.
user-invocable: true
---

# Add UI API Module

This skill parses the user's request (free-form or structured), extracts and infers as many fields as possible, confirms the result, collects only what is still missing, and then adds the module.

## Core Rules

- Operate only in an existing UI API app workspace.
- Call `WebClientUIAPI_getCurrentAppInformation` first to verify app context and load existing modules.
- Parse the user's initial message for pre-fillable fields before asking anything.
- Present a pre-fill summary of extracted and inferred values; ask the user to confirm or correct it.
- Ask only for fields that could not be extracted or inferred.
- Ask one field at a time with `vscode_askQuestions` when available; use plain chat only when needed.
- Use compact `Yes` / `No` choices for add-another and confirmation prompts.
- Normalize `moduleName` and `viewName` to PascalCase before storing, summarizing, or writing; do not mention the transformation unless the user explicitly asks.
- Collect all initial views before executing the add-module tool.
- Execute `WebClientUIAPI_addModule` only after explicit summary confirmation.
- This skill is the default and required path for module-addition intents. Do not bypass it by directly calling `WebClientUIAPI_addModule` unless the user explicitly requests direct tool usage.

---

## Phase 0: Intent Parsing

Run this phase immediately when the skill is invoked, before any guided steps.

### 0.1 Extract Fields from the User's Message

Scan the user's message for the following signals:

| Field | How to detect |
|---|---|
| **Module name** | Explicitly stated module name (e.g., "add a Sales module", "module called Purchasing", "under Inventory") |
| **View name** | Explicitly stated view name (e.g., "view named SalesOrderDetail", "call it PurchaseDetail") |
| **View reference** | Any phrase resembling a SAP B1 view name (e.g., "sales order detail", "purchase order detail view", "service call") |
| **Base view category** | Explicit mention of UDT, UDO, or System (e.g., "based on a UDT", "UDO called MyObject") |

### 0.2 View Fuzzy Matching

First, determine the Base View Category from the user's message:

- If the user mentions **UDT** or **UDO** (e.g., "based on a UDT", "UDO called MyObject"), set `baseViewCategory` to `UDT` or `UDO` accordingly and **skip the `skills/assets/viewsMeta.json` search entirely**.
  - Try to extract the **object/table code** from the user's message (e.g., "UDO called OOTM" → `OOTM`, "UDT @NO_OBJECT" → `NO_OBJECT`). Strip any leading `@` for storage; it will be re-added when constructing the name.
  - Try to detect the **view type** from the user's message: keywords like "list", "list view" → `LISTVIEW`; "detail", "form" → `DETAILVIEW`.
  - Construct `baseViewName` using the pattern:
    - UDO: `UDO_LISTVIEW_@<ObjectCode>` or `UDO_DETAILVIEW_@<ObjectCode>`
    - UDT: `UDT_LISTVIEW_@<TableName>` or `UDT_DETAILVIEW_@<TableName>`
  - If the object/table code or view type cannot be inferred, ask for them (see Step 3). Do not ask the user to type the full pattern — construct it from their answers.
- Otherwise, assume `System` category and proceed with the fuzzy match below.

**For System category only:**

1. Normalize: strip the word "view" / "views", trim whitespace, title-case the remainder.
2. Search `viewsMeta.json` names for an **exact match** first.
3. If no exact match, search for a **contains match** (e.g., "sales order detail" matches "Sales Order Detail").
4. If multiple candidates match, offer them as choices and ask the user to pick one.
5. If no match at all, tell the user and show the full list so they can pick.
6. Once matched, record the canonical `name` and set `baseViewCategory` to `System`.

### 0.3 Module Inference from View

If the module name was **not** explicitly stated, infer it from the matched view name using this table:

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

If the view cannot be matched to a module via this table, leave the module blank and ask for it.

### 0.4 Pre-fill Summary

After parsing, display a Markdown table summary of what was understood **before asking anything**. Use the `Source` column to show how each value was determined:

| Field | Value | Source |
|-------|-------|--------|
| Module Name | Sales | from your message |
| View Name | SalesOrderDetail | from your message |
| Base View | Sales Order Detail | matched in catalog |
| Category | System | default for standard views |

> Does this look right? If yes, I'll ask only for the missing fields. If anything is wrong, tell me what to change.

- If the user confirms, skip directly to collecting only the **missing** fields.
- If the user corrects a field, update it and display the revised summary before continuing.
- If nothing was parseable from the user's message, skip the summary and begin the guided flow from Step 1.

---

## Step 0: Ensure Context

- Ensure a workspace is open.
- Call `WebClientUIAPI_getCurrentAppInformation`.
- If no app is detected, stop and ask the user to open the target app workspace.
- Capture app metadata and existing module names for duplicate checks.

## Step 1: Explain Inputs (skip if pre-fill summary was shown and confirmed)

Explain that the workflow collects:

- New module name
- One or more views to add under the new module
- For each view: view name, base view category, and base view name

State that file updates happen only after final summary approval.

## Step 2: Collect Module Metadata

Collect `moduleName` only if not already confirmed in Phase 0.

Validation:

- Require a non-empty value.
- Convert to PascalCase before storing.
- Reject duplicates against existing modules.
- Re-ask only the invalid field.

## Step 3: Collect Views For The New Module

At least one view is required for the new module.

- If view fields were confirmed in Phase 0, use them directly; otherwise ask for the first view.
- After each completed view, ask whether to add another.
- Continue until the user answers `No`.

Collect these fields for each view, one at a time (skip fields confirmed in Phase 0):

1. View Name
2. Base View Category
3. Base View Name

Validation:

- Require `viewName`.
- Convert `viewName` to PascalCase before storing.
- Accept only `System`, `UDT`, or `UDO` for `baseViewCategory`; prefer fixed choices.
- For **System** category: `baseViewName` must match a `name` entry in `skills/assets/viewsMeta.json`; prefer searchable or fixed choices.
- For **UDT** or **UDO** category: do not ask for the full name — ask for two sub-fields instead:
  1. **Object/table code** — the code without the `@` prefix (e.g., `OOTM`, `NO_OBJECT`)
  2. **View type** — offer `List View` / `Detail View` as fixed choices
  Then construct `baseViewName` as: `<CATEGORY>_<LISTVIEW|DETAILVIEW>_@<Code>` (e.g., `UDO_LISTVIEW_@OOTM`)
- If a field is invalid, explain allowed values and re-ask only that field.

## Step 4: Confirm Summary

Present a readable summary in Markdown tables using normalized values.

**New Module and Views:**

| Module | View | Base View Category | Base View Name |
|--------|------|--------------------|----------------|
| Sales | SalesOrderDetail | System | Sales Order Detail |

Ask: `Does this look correct? (Yes/No)`

- If `No`, update only affected fields and show the full summary again.
- If `Yes`, continue.

## Step 5: Execute Add Module

Use `WebClientUIAPI_addModule` to add the module and the currently collected views in one operation.

Call shape:

```json
{
  "moduleName": "Sales",
  "views": [
    {
      "viewName": "SalesQuotationDetail",
      "baseViewCategory": "System",
      "baseViewName": "Sales Quotation Detail"
    }
  ]
}
```

Execution rules:

- Build the payload from normalized values collected in Steps 2–4.
- Call `WebClientUIAPI_addModule` only after confirmation.
- If the tool returns an error, show the error, ask what to adjust, update only affected fields, then retry.
- Do not manually edit `app.json`, `mta.yaml`, module scaffolding files, or launch configuration before attempting the tool.
- After a successful tool call, treat `app.json`, `mta.yaml`, and launch configuration as tool-managed outputs and do not manually edit them unless the user explicitly requests a follow-up customization.
- You may review and adjust generated module view layout and controller TypeScript files when template output is not consistent with user intent.

## Step 6: Validate And Handoff

Before finishing, verify:

- The tool call succeeded.
- New module exists and matches project conventions.
- At least one new view was added to the module.
- All view names and module name are PascalCase.
- For System views: all selected Base View Names came from `skills/assets/viewsMeta.json`.
- For UDT/UDO views: all selected Base View Names follow the pattern `(UDT|UDO)_(LISTVIEW|DETAILVIEW)_@<Code>`.

Then state that `app.json`, `mta.yaml`, and launch configuration are already handled by `WebClientUIAPI_addModule` and generally do not require manual edits.
If needed, state that generated module view layout/controller files can be refined to match user intent.
- After all editing is done, rerun `npm start` in the app workspace — even if it is already running — and verify correctness by checking terminal output.

Then summarize created/updated files and remind user to run their build command.

---

## Tool Invocation Rules

- Call `WebClientUIAPI_getCurrentAppInformation` before collecting module/view inputs
- Call `WebClientUIAPI_addModule` exactly once for the target module, with all desired initial views in that single payload
- If required tools are unavailable, stop and tell the user exactly which tool is missing

---

## Quality Checks

Before making edits:

- Existing app context is verified
- Module name is unique in the current app
- Every view has valid Base View Category and Base View Name
- User confirmed the summary

After making edits:

- `WebClientUIAPI_addModule` completed successfully
- New module and view files exist in `src`
- No manual post-tool edits were made to `app.json`, `mta.yaml`, or launch configuration unless explicitly requested
- Any post-tool edits to generated module view layout/controller files are intent-driven and limited to aligning template output with user requirements
- `npm start` was rerun after editing (regardless of whether it was already running) and terminal output shows a healthy startup

---

## Example Prompts

**Free-form (skill infers and fills):**
- `Add a Sales module with sales order detail view.`
- `Add a Purchasing module based on purchase order detail view.`
- `Add a Service module for the service call view, name the view ServiceCallMain.`
- `Add a module for inventory transfer view.`

**Partial (skill infers what it can, asks for the rest):**
- `Add a module for sales order detail view.` *(module name inferred from view; view name missing — will ask)*
- `Add a Sales module.` *(no view — will ask for view details)*
- `I want to add a module based on a UDT called MyCustomTable.` *(module name missing — will ask)*

**Guided (skill asks all questions):**
- `Add a new module to my existing UI API app.`
- `Help me add a module and then add views interactively.`
- `Add module Sales and guide me to add two views.`
