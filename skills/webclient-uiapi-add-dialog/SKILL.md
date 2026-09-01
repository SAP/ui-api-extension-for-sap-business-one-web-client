---
name: webclient-uiapi-add-dialog
description: Step-by-step guide for adding a new dialog (JSON definition + TypeScript controller + manifest registration + caller wiring) to an existing SAP Business One Web Client UI API project.
user-invocable: true
---

# SAP B1 WebClient UI API — Add a Dialog Skill

## Role and Purpose

You are a specialist assistant for SAP Business One Web Client UI API projects.
When invoked, guide the user through every step needed to add a new dialog to an existing project:

1. Analyze the existing project structure
2. Create the dialog JSON definition
3. Create the TypeScript controller
4. Register the dialog in `manifest.json`
5. Wire up the caller (open / handle result)
6. Validate and remind about build

Do not skip steps. Do not guess file paths — always read the actual project first.

---

## Phase 0 — Intent Parsing

Run this phase immediately when the skill is invoked, before any guided steps.

### 0.1 Extract Fields from the User's Message

Scan the user's message for the following signals:

| Field | How to detect |
|---|---|
| **Module name** | Explicitly stated target module (e.g., "to the Sales module", "in Purchasing") |
| **Dialog ID** | Any name given for the dialog (e.g., "dialog called myFeature", "add a coupon dialog") |
| **Dialog title** | Any title phrase (e.g., "title 'Select Coupon'", "header should say Feature Details") |

If a dialog title was not stated but a dialog ID was, infer a default title by spacing and capitalizing the ID (e.g., `myFeature` → `My Feature`).

### 0.2 Pre-fill Summary

After parsing, display a Markdown table summary of what was understood **before asking anything**. Use the `Source` column to show how each value was determined:

| Field | Value | Source |
|-------|-------|--------|
| Module | Sales | from your message |
| Dialog ID | myFeature | from your message |
| Dialog Title | My Feature | inferred from ID |

> Does this look right? If yes, I'll ask only for the missing fields. If anything is wrong, tell me what to change.

- If the user confirms, skip directly to collecting only the **missing** fields.
- If the user corrects a field, update it and display the revised summary before continuing.
- If nothing was parseable from the user's message, skip the summary and begin the guided flow from Phase 1.

---

## Phase 1 — Understand the Existing Project

Before writing any code, read the project to understand its conventions.

### 1.1 Discover all modules

Call `WebClientUIAPI_getCurrentAppInformation` to get the app context and the full list of modules with their existing views and dialogs.

If the module was not already confirmed in Phase 0:
- If only one module exists, infer it automatically.
- Otherwise, list the modules and ask the user which one to add the dialog to. Wait for their answer before proceeding.

### 1.2 Read an existing dialog pair (if any)

Check the `dialogs` array for the chosen module in the `WebClientUIAPI_getCurrentAppInformation` response.

- **If dialogs exist**: read one dialog JSON (using the `layoutFile` path from the response) and its paired controller (using the `controllerFile` path) to match the project's exact coding style.
- **If no dialogs exist**: check `src/controller/` for any existing controller to infer the import style and TypeScript conventions, then follow the templates in Phase 2 and Phase 3 of this skill.

### 1.3 Ask the user for the new dialog spec

Use `vscode_askQuestions` to collect the dialog spec. Controls and returned data are not asked — files are generated from templates and customized afterwards.

Use the `views` array for the chosen module from the `WebClientUIAPI_getCurrentAppInformation` response. If exactly one view exists, use its `controllerFile` as the caller controller without asking. If multiple views exist, include the `callerController` question below (list the `controllerFile` values as options).

```typescript
await vscode_askQuestions({
  questions: [
    // Skip if already confirmed in Phase 0:
    {
      header: "dialogId",
      question: "What is the dialog ID?",
      message: "Use a unique short name without a suffix, such as myFeature.",
    },
    // Skip if already confirmed in Phase 0:
    {
      header: "dialogTitle",
      question: "What title should appear in the dialog header?",
    },
    // Include only when multiple views (and thus multiple controllers) exist:
    {
      header: "callerController",
      question: "Which controller should open this dialog?",
      message: "Select the controller from the views in the current module.",
    }
  ]
});
```

After collecting answers:
- Derive the controller class name from the dialog ID: PascalCase the ID (e.g. `myFeature` → `MyFeature`). This value is used as the TypeScript class name, the filename (`MyFeature.ts`), and the `controllerName` template variable.
- **Caller controller file**: the `controllerFile` path from the chosen view in the `WebClientUIAPI_getCurrentAppInformation` response (e.g. `Sales/src/controller/SalesOrderDetail.ts`) is used directly. Record this path — Phase 5 will edit this specific file.
- Restate the captured spec back to the user in a short structured summary, preferably as a Markdown table, and ask for explicit confirmation before creating any files. Do not proceed until the user confirms.

---

## Phase 2 — Create the Dialog JSON Definition

### Generation steps

1. **Read the template** at `skills/webclient-uiapi-add-dialog/templates/complexDialog.json.template`.

2. **Substitute all `{{...}}` variables** directly in your output — do not generate a script:

   | Variable | Value |
   |----------|-------|
   | `{{namespace}}` | `namespace` from `moduleDetails` in the tool response (e.g. `MyCompany.HelloWorld.Sales`) |
   | `{{controllerName}}` | PascalCased dialog ID without suffix (e.g. `MyFeature`) |
   | `{{title}}` | Dialog title from user input |

3. **Replace `{{GUID}}` placeholders**: count every occurrence of `"{{GUID}}"` in the template after variable substitution, call `WebClientUIAPI_generateUUID` once with that count, then replace each `{{GUID}}` in order with the returned UUIDs. Do not reuse values or invent them manually.

4. **Write** the substituted content directly to `<module>/src/dialog/<dialogId>.dialog.json` using the file write tool (e.g. ID `myFeature` → `myFeature.dialog.json`). Create the `dialog/` folder if it does not exist.

---

## Phase 3 — Create the TypeScript Controller

### Generation steps

1. **Read the template** at `skills/webclient-uiapi-add-dialog/templates/complexDialog.controller.ts.template`.

2. **Substitute all `{{...}}` variables** directly in your output — do not generate a script:

   | Variable | Value |
   |----------|-------|
   | `{{controllerName}}` | PascalCased dialog ID without suffix (e.g. `MyFeature`) — same value used in Phase 2 |
   | `{{ID}}` | The dialog ID as-is (e.g. `myFeature`) |

3. **Write** the substituted content directly to `<module>/src/controller/<controllerName>.ts` using the file write tool.

### Rules

- Every `procName` in the dialog JSON **must** have a matching `async` method in the controller.
- Always call `oView.setCustomizedData(data, "data")` in `onDataLoad` before any bindings render.
- Use `oView.showBusy()` / `oView.hideBusy()` around async Service Layer calls.
- Use `oWindow.close(result)` (not `dialog.close()`) to return data — `dialog.close()` is called by the **caller** for cleanup.

---

## Phase 4 — Register in manifest.json

### 4.0 Fetch the manifest schema first

Call `WebClientUIAPI_getSchemaFilePath` to get the **manifest schema** path, then read it before making any changes. Use it to verify that the new bundle entry is valid — correct field names, required properties, and allowed values — before writing to `<module>/src/manifest.json`.

### Add the bundle entry

Add an entry to the `"b1.bundles"` array. The `id` must use the `<dialogId>.dialog` suffix (matching the pattern used by views, which use `.layout`):

```json
{
  "id": "<dialogId>.dialog",
  "view": "dialog/<dialogId>.dialog.json"
}
```

- `id` must exactly match the `id` used in `oEnv.newDialog({ id: "..." })` in the caller.
- `view` is the relative path from the `webapp/` folder (same as `src/` after compilation).
- Validate the updated `b1.bundles` array against the manifest schema before saving.

**Example** (after adding dialog with ID `myFeature`):
```json
"b1.bundles": [
  { "id": "SalesOrderDetail.layout", "baseViewGuid": "...", "layout": "layout/SalesOrderDetail.layout.json" },
  { "id": "myCoupon.dialog", "view": "dialog/myCoupon.dialog.json" },
  { "id": "myFeature.dialog", "view": "dialog/myFeature.dialog.json" }
]
```

---

## Phase 5 — Wire the Caller

Open the caller controller file recorded in Phase 1.3 (e.g. `Sales/src/controller/SalesOrderDetail.ts`) and add a method that opens the dialog.

### Minimal opener

```typescript
import Dialog from "sbo/ui/core/Dialog";

async onOpenMyDialog(oEnv: SDKEnv, oEvent: Event): Promise<void> {
  let dialog: Dialog;
  try {
    dialog = await oEnv.newDialog({ id: "myFeature.dialog" });
  } catch (error) {
    console.error("Dialog id not found:", error);
    return;
  }

  let result: any = null;
  try {
    // Pass initial context; dialog receives it in onInit via oEvent.getParameter("context")
    result = await dialog.open({ /* initial params */ });
    console.log("Dialog returned:", JSON.stringify(result));
  } catch (error) {
    console.error("Dialog open failed:", error);
  }
  await dialog.close();
}
```

### Key points

- `dialog.open()` is async and **blocks until `oWindow.close(result)` is called inside the dialog**.
- Always call `dialog.close()` after `dialog.open()` resolves — it cleans up the dialog instance.

---

## Phase 6 — Validation Checklist

Before calling the task done, verify every item:

- [ ] Dialog JSON file created at `src/dialog/<id>.dialog.json`
- [ ] Every control has a unique `guid`
- [ ] Every `procName` in the JSON has a matching method in the controller
- [ ] Controller file created at `src/controller/<controllerName>.ts`
- [ ] `onDataLoad` initializes all `@@data` model fields used in bindings
- [ ] `onClose` calls `oWindow.close(result)` (not `oWindow.close()` unless no data needed)
- [ ] `manifest.json` has a new entry under `b1.bundles` with id `<dialogId>.dialog` and correct `view` path
- [ ] Parent controller has an opener method that calls `oEnv.newDialog({ id: "myFeature.dialog" })` with the exact same ID
- [ ] If opened via a UI button: layout JSON has a Button with `press.procName` pointing to the opener

- After all editing is done, run `npm start` in the app workspace and verify correctness by checking terminal output.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `id` in `newDialog()` doesn't match `manifest.json` entry | They must be identical strings including the `.dialog` suffix |
| Called `dialog.close()` inside the dialog controller | Use `oView.getWindow()` then `oWindow.close(result)` inside; `dialog.close()` is for the caller |
| Editing files in `webapp/` directly | `webapp/` is compiled output — always edit `src/` then rebuild |

---

## Quick Reference — File Checklist

For a dialog with ID `myFeature` and controller class `MyFeature`:

```
<module>/
  src/
    controller/
      MyFeature.ts                  ← NEW
    dialog/                         ← CREATE this folder if it doesn't exist
      myFeature.dialog.json         ← NEW
    manifest.json                   ← EDIT: add bundle entry { "id": "myFeature.dialog", "view": "dialog/myFeature.dialog.json" }
  (parent controller).ts            ← EDIT: add opener method calling oEnv.newDialog({ id: "myFeature.dialog" })
```
