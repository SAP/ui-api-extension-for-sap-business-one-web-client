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
- Present a pre-fill summary of extracted and inferred values, then proceed immediately to collecting only the missing fields
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
| **Extra intent** | Any request beyond scaffolding — e.g., adding UI elements, fetching data, calling Service Layer APIs (e.g., "and add a button to get the number of sales orders"). Store the verbatim phrasing for later. |

If **App name** cannot be detected from the user's message, read the current VS Code workspace folder name and use it (PascalCased) as a candidate. Show it in the pre-fill summary with source `inferred from workspace`. Do not use this fallback if no workspace is open.

### 0.2 View Fuzzy Matching

First, determine the Base View Category from the user's message:

- If the user mentions **UDT** or **UDO** (e.g., "based on a UDT", "UDO called MyObject"), set `baseViewCategory` to `UDT` or `UDO` accordingly and **skip the `skills/assets/viewsMeta.json` search entirely**.
  - Try to extract the **object/table code** from the user's message (e.g., "UDO called OOTM" → `OOTM`, "UDT @NO_OBJECT" → `NO_OBJECT`). Strip any leading `@` for storage; it will be re-added when constructing the name.
  - Try to detect the **view type** from the user's message: keywords like "list", "list view" → `LISTVIEW`; "detail", "form" → `DETAILVIEW`.
  - Construct `baseViewName` using the pattern:
    - UDO: `UDO_LISTVIEW_@<ObjectCode>` or `UDO_DETAILVIEW_@<ObjectCode>`
    - UDT: `UDT_LISTVIEW_@<TableName>` or `UDT_DETAILVIEW_@<TableName>`
  - If the object/table code or view type cannot be inferred, ask for them (see Step 4). Do not ask the user to type the full pattern — construct it from their answers.
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

After parsing, display a Markdown table, summarizing what was understood **before asking anything**. Use the `Source` column to show how each value was determined:

| Field | Value | Source |
|---|---|---|
| App Name | HelloWorld | from your message |
| App Provider | — | **missing** |
| App Version | 1.0.0 | default |
| Module | Sales | inferred from view |
| View Name | SalesOrderDetail | from your message |
| Base View | Sales Order Detail | matched in catalog |
| Category | System | default for standard views |

- After displaying the summary, proceed immediately to collecting only the **missing** fields.
- If nothing was parseable from the user's message, skip the summary and begin the guided flow from Step 2.
- **Extra intent**, if captured, is stored silently and not shown in the summary table — it will surface as a handoff offer after the app is ready.

---

## Step 1: Ensure Workspace

Check the current VS Code workspace:
- If no workspace is open, run `uiapi.createWorkspaceIfNotExist` and wait until a workspace is available before continuing.
- If a workspace is already open, use it as-is and continue.

## Step 2: Explain the Inputs (skip if pre-fill summary was shown)

Explain that the workflow will collect:

- App name
- App provider
- App version, optional, default `1.0.0`
- One or more modules, each with one or more views

State that generation happens only after the user approves the final summary.

## Step 3: Collect App Metadata

Collect **only the fields not already confirmed in Phase 0**, one at a time:

1. App Name
2. App Provider
3. App Version

Validation:

- App Name and App Provider are required and must not be empty
- App Version defaults to `1.0.0`; if provided, it must match `MAJOR.MINOR.PATCH`
- If the user supplies multiple values in one response, extract them and continue from the next missing field
- Re-ask only the missing or invalid field

## Step 4: Collect Modules and Views

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
- Base View Category must be `System`, `UDT`, or `UDO`; use fixed choices when possible
- For **System** category: Base View Name must match a `name` entry in `skills/assets/viewsMeta.json`; use a searchable or fixed-choice UI when possible
- For **UDT** or **UDO** category: do not ask for the full name — ask for two sub-fields instead:
  1. **Object/table code** — the code without the `@` prefix (e.g., `OOTM`, `NO_OBJECT`)
  2. **View type** — offer `List View` / `Detail View` as fixed choices
  Then construct `baseViewName` as: `<CATEGORY>_<LISTVIEW|DETAILVIEW>_@<Code>` (e.g., `UDO_LISTVIEW_@OOTM`)
- If a field is invalid, explain the allowed values and re-ask only that field

## Step 5: Present the Final Summary

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

Then use `vscode_askQuestions` to present a single confirmation question with compact choices:

- Question: "Does this look correct?"
- Choices: `Yes` / `No`

If the user selects **No**, update only the affected field, module, or view, then present the full summary again.

If the user selects **Yes**, call `WebClientUIAPI_createApp`. If the tool fails, report the error and stop.

Once the app is created, inform the user with a friendly message before installing dependencies, for example:

> "App created! Installing dependencies — this may take a moment..."

Then run `npm install` in the app folder using `vscode.runInTerminal` (or equivalent). When it completes:
- On success: tell the user the app is ready and show a follow-up tip — regardless of any deprecation warnings or vulnerabilities in the output, do not surface those warnings to the user (this is a development scaffold, not a production package). For example:
  > "All set! Your app is ready to use. To preview it in the browser, press **F5** or trigger the preview command by typing `/webclient-uiapi-preview` in the Copilot chat box."

  If **extra intent** was captured in Phase 0, append a short handoff offer immediately after, for example:
  > "You also mentioned: *'add a button to get the number of sales orders'* — want me to help with that now?"

  If the user says yes, continue in the same conversation to address the extra request by referencing the newly created `AGENTS.md` in the workspace for project context. If no, end the workflow.
- On failure: show the error output and suggest the user run `npm install` manually in the app folder.

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
- For **UDT** / **UDO** category views: Base View Name follows the pattern `(UDT|UDO)_(LISTVIEW|DETAILVIEW)_@<Code>`
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

**Free-form with extra intent (skill scaffolds then offers to continue):**
- `Create a UI API app for business partner detail view and add a button to get the number of sales orders.`
