---
name: webclient-uiapi-create-app
description: Create a SAP Business One Web Client UI API app through a guided conversation. Use when the user wants to generate or scaffold a UI API app — including free-form requests like "create a UI API app named HelloWorld on top of sales order detail view". Parses user intent, infers missing fields where possible, confirms inferred values, then calls WebClientUIAPI_createApp with structured JSON.
user-invocable: true
---

# Create UI API App

This skill parses the user's request (free-form or structured), extracts and infers as many fields as possible, confirms the result, collects only what is still missing, and then generates the app.

## Core Rules

- Before collecting any app metadata, check the current VS Code workspace: if no workspace is open, execute `uiapi.createWorkspaceIfNotExist`; otherwise use the existing workspace as-is
- Parse the user's initial message for pre-fillable fields before asking anything
- Present a pre-fill summary of extracted and inferred values; ask the user to confirm or correct it
- Ask only for fields that could not be extracted or inferred
- Collect app metadata first, then modules, then views
- Use `vscode_askQuestions` for one field at a time when available; fall back to plain chat only when needed
- Ask for the first module and first view directly; do not ask for counts up front
- Use compact `Yes` / `No` choices for all add-another and confirmation prompts
- Silently transform `appName`, `appProvider`, `moduleName`, and `viewName` to PascalCase before storing, summarizing, or sending them to tools; do not mention the transformation unless the user explicitly asks
- Do not call `WebClientUIAPI_createApp` until the user explicitly confirms the final summary
- This skill is the default and required path for app creation intents. Do not bypass it by directly calling `WebClientUIAPI_createApp` unless the user explicitly requests direct tool usage

---

## Phase 0: Intent Parsing

Run this phase immediately when the skill is invoked, before any guided steps.

### 0.1 Extract Fields from the User's Message

Scan the user's message for the following signals:

| Field | How to detect |
|---|---|
| **App name** | A proper noun, CamelCase/PascalCase word, or quoted string that sounds like an app name (e.g., "HelloWorld", "MySalesApp") |
| **View reference** | Any phrase resembling a SAP B1 view name (e.g., "sales order detail", "purchase order detail view", "service call") |
| **Module name** | Explicitly stated module name (e.g., "in the Sales module", "under Purchasing") |
| **App provider** | Company or organization name mentioned as owner/provider |
| **App version** | A version string matching `MAJOR.MINOR.PATCH` |

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

If the module was **not** explicitly stated, infer it from the matched view name using this table:

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
|---|---|---|
| App Name | HelloWorld | from your message |
| App Provider | — | **missing** |
| App Version | 1.0.0 | default |
| Module | Sales | inferred from view |
| View Name | SalesOrderDetail | from your message |
| Base View | Sales Order Detail | matched in catalog |
| Category | System | default for standard views |

> Does this look right? If yes, I'll ask only for the missing fields. If anything is wrong, tell me what to change.

- If the user confirms, skip directly to collecting only the **missing** fields.
- If the user corrects a field, update it and display the revised summary before continuing.
- If nothing was parseable from the user's message, skip the summary and begin the guided flow from Step 1.

---

## Step 0: Ensure Workspace

Check the current VS Code workspace:
- If no workspace is open, run `uiapi.createWorkspaceIfNotExist` and wait until a workspace is available before continuing.
- If a workspace is already open, use it as-is and continue.

## Step 1: Explain the Inputs (skip if pre-fill summary was shown and confirmed)

Explain that the workflow will collect:

- App name
- App provider
- App version, optional, default `1.0.0`
- One or more modules, each with one or more views

State that generation happens only after the user approves the final summary.

## Step 2: Collect App Metadata

Collect **only the fields not already confirmed in Phase 0**, one at a time:

1. App Name
2. App Provider
3. App Version

Validation:

- App Name and App Provider are required and must not be empty
- Silently convert App Name and App Provider to PascalCase before storing them
- App Version defaults to `1.0.0`; if provided, it must match `MAJOR.MINOR.PATCH`
- If the user supplies multiple values in one response, extract them and continue from the next missing field
- Re-ask only the missing or invalid field

## Step 3: Collect Modules and Views

At least one module is required. For each module:

1. If module name was inferred and confirmed in Phase 0, use it directly; otherwise collect Module Name
2. Ask for the first view directly (skip if already confirmed in Phase 0)
3. After each completed view, ask whether to add another view to the same module
4. After each completed module, ask whether to add another module

Collect these fields for each view, one at a time (skip fields confirmed in Phase 0):

1. View Name
2. Base View Category
3. Base View Name

Validation:

- Module Name and View Name are required
- Silently convert Module Name and View Name to PascalCase before storing them
- Base View Category must be `System`, `UDT`, or `UDO`; use fixed choices when possible
- For **System** category: Base View Name must match a `name` entry in `skills/assets/viewsMeta.json`; use a searchable or fixed-choice UI when possible
- For **UDT** or **UDO** category: skip the catalog entirely — just ask the user for the UDT/UDO name or ID and accept whatever they provide
- If a field is invalid, explain the allowed values and re-ask only that field

## Step 4: Present the Final Summary

Present a readable summary using normalized values, preferably as Markdown tables.

**App Summary:**

| Field | Value |
|-------|-------|
| App Name | MySalesApp |
| App Provider | MyCompany |
| App Version | 1.0.0 |

**Modules and Views:**

| Module | View | Base View Category | Base View Name |
|--------|------|--------------------|----------------|
| Sales | SalesOrderDetail | System | Sales Order Detail |

Then ask: "Does this look correct? (Yes/No)"

If the user says **No**, update only the affected field, module, or view, then present the full summary again.

If the user says **Yes**, call `WebClientUIAPI_createApp`. If the tool fails, report the error and stop.

## Step 5: Set Up and Launch

After successful app creation, execute `uiapi.openWorkspace` with the full path of the new app.

Then end the workflow.

---

## JSON Payload Shape

Use exactly this shape:

```json
{
  "appName": "MySalesApp",
  "appVersion": "1.0.0",
  "appProvider": "MyCompany",
  "modules": [
    {
      "moduleName": "Sales",
      "views": [
        {
          "viewName": "SalesOrderDetail",
          "baseViewCategory": "System",
          "baseViewName": "Sales Order Detail"
        }
      ]
    }
  ]
}
```

---

## Tool Invocation Rules

- If no workspace is open, run `uiapi.createWorkspaceIfNotExist` before collecting app parameters
- Pass the payload using the exact JSON schema above
- If any required tool is unavailable, stop and tell the user what is missing

---

## Quality Checks

Before calling the generation tool, verify:

- The workspace step has completed
- App name, provider, module names, and view names are present and normalized to PascalCase
- App version is present and in `MAJOR.MINOR.PATCH` form, using `1.0.0` by default when omitted
- At least one module exists, and every module has at least one view
- Every view has a valid Base View Category (`System`, `UDT`, or `UDO`)
- For **System** category views: Base View Name matches a `name` entry in `skills/assets/viewsMeta.json`
- For **UDT** / **UDO** category views: Base View Name is a non-empty user-provided name or ID (no catalog check)
- The user explicitly confirmed the final summary

---

## Example Prompts

**Free-form (skill infers and fills):**
- `Create a UI API app named HelloWorld on top of sales order detail view.`
- `Scaffold a MySalesApp for the purchase order detail view.`
- `Build a UI API extension called ServiceTracker based on service call view.`
- `Create a UI API app for inventory transfer view, call it StockMover.`

**Partial (skill infers what it can, asks for the rest):**
- `Create a UI API app for sales order detail view.` *(app name missing — will ask)*
- `Create a UI API app named HelloWorld.` *(no view — will ask for module and view)*
- `I want to extend the journal entry view.` *(app name and provider missing — will ask)*

**Guided (skill asks all questions):**
- `Scaffold a SAP B1 UI API application by asking me the required questions.`
- `Generate a UI API app, but confirm the modules and views with me before creating anything.`
