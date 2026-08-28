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

## Phase 1 — Understand the Existing Project

Before writing any code, read the project to understand its conventions.

### 1.1 Discover all modules

A UI API app may contain multiple independent modules. Each module has a `manifest.json` under its `src/` folder. Find only the source manifests — never the compiled copies under `webapp/` or `dist/`:

```bash
find . -path "*/src/manifest.json" -not -path "*/node_modules/*"
```

List the modules found (by folder name and manifest `name` field), then **ask the user which module they want to add the dialog to**. Wait for their answer before proceeding.

If only one module exists, confirm with the user rather than assuming.

### 1.2 Read the chosen module's manifest.json

Read `<module>/src/manifest.json` to learn:
- Existing bundle IDs (avoid collisions)
- The `name` field (used as the controller namespace, e.g. `sapb1.DialogAppTS.Module1`)
- Any existing dialog entries under `"b1.bundles"` — there may be none

### 1.3 Read an existing dialog pair (if any)

Check whether `src/dialog/` exists inside the chosen module and contains any dialog JSON files.

- **If dialogs exist**: read one dialog JSON and its paired controller to match the project's exact coding style.
- **If no dialogs exist**: check `src/controller/` for any existing controller to infer the import style and TypeScript conventions, then follow the templates in Phase 2 and Phase 3 of this skill.

### 1.4 Ask the user for the new dialog spec

Use `vscode_askQuestions` to collect the dialog spec. Controls and returned data are not asked — files are generated from templates and customized afterwards.

Before presenting questions, scan `src/layout/` for all `*.layout.json` files and read the top-level `"controller"` field from each. If exactly one layout file exists, use its `"controller"` value as the caller controller without asking. If multiple layout files exist, include the `callerController` question below (list the controller values found as options).

```typescript
await vscode_askQuestions({
  questions: [
    {
      header: "dialogId",
      question: "What is the dialog ID?",
      message: "Use a unique short name without a suffix, such as myFeature.",
    },
    {
      header: "dialogTitle",
      question: "What title should appear in the dialog header?",
    },
    // Include this question only when multiple layout files (and thus multiple controllers) exist:
    {
      header: "callerController",
      question: "Which controller should open this dialog?",
      message: "Select the controller from the layout files found in src/layout/.",
    }
  ]
});
```

After collecting answers:
- Normalize empty width/height answers to `800px` and `500px`.
- Derive the controller class name from the dialog ID: PascalCase the ID (e.g. `myFeature` → `MyFeature`). This value is used as the TypeScript class name, the filename (`MyFeature.ts`), and the `controllerName` template variable.
- **Resolve the caller controller file**: take the `callerController` value (a namespace string such as `Sapb1.HelloWorld.Sales.controller.SalesOrderDetail`), extract the last segment (`SalesOrderDetail`), and confirm that `<module>/src/controller/SalesOrderDetail.ts` exists. If it does not exist, report the mismatch to the user and stop. Record this resolved path — Phase 5 will edit this specific file.
- Restate the captured spec back to the user in a short structured summary, preferably as a Markdown table or similarly user-friendly layout, and ask for explicit confirmation before creating any files. Do not proceed until the user confirms.

---

## Phase 2 — Create the Dialog JSON Definition

### Generation steps

1. **Read the template** at `skills/uiapi-add-dialog/templates/complexDialog.json.template`.

2. **Substitute all `<%= ... %>` variables**:

   | Variable | Value |
   |----------|-------|
  | `namespace` | `name` field from `manifest.json` (e.g. `Sapb1.HelloWorld.Sales`) |
   | `controllerName` | PascalCased dialog ID without suffix (e.g. `MyFeature`) |
   | `title` | Dialog title from user input |
   | `width` | use default value `800px`) |
   | `height` | use default value `500px`) |
   | `draggable` | `true` |
   | `resizable` | `true` |

3. **Replace `<GUID>` placeholders**: count every occurrence of `"<GUID>"` in the template after variable substitution, call `WebClientUIAPI_generateUUID` once with that count, then replace each `<GUID>` in order with the returned UUIDs. Do not reuse values or invent them manually.

4. **Write** the file to `<module>/src/dialog/<dialogId>.dialog.json` (e.g. ID `myFeature` → `myFeature.dialog.json`).

---

## Phase 3 — Create the TypeScript Controller

### Generation steps

1. **Read the template** at `skills/uiapi-add-dialog/templates/complexDialog.controller.ts.template`.

2. **Substitute all `<%= ... %>` variables**:

   | Variable | Value |
   |----------|-------|
   | `controllerName` | PascalCased dialog ID without suffix (e.g. `MyFeature`) — same value used in Phase 2 |
   | `ID` | The dialog ID as-is (e.g. `myFeature`) |

3. **Write** the file to `<module>/src/controller/<controllerName>.ts`.

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

Add an entry to the `"b1.bundles"` array:

```json
{
  "id": "<dialogId>",
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
  { "id": "myCoupon", "view": "dialog/myCoupon.dialog.json" },
  { "id": "myFeature", "view": "dialog/myFeature.dialog.json" }
]
```

---

## Phase 5 — Wire the Caller

Open the caller controller file resolved in Phase 1.4 (e.g. `<module>/src/controller/SalesOrderDetail.ts`) and add a method that opens the dialog.

### Minimal opener

```typescript
import Dialog from "sbo/ui/core/Dialog";

async onOpenMyDialog(oEnv: SDKEnv, oEvent: Event): Promise<void> {
  let dialog: Dialog = null;
  try {
    dialog = await oEnv.newDialog({ id: "myFeature" });
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
- [ ] `manifest.json` has a new entry under `b1.bundles` with the correct `id` and `view` path
- [ ] Parent controller has an opener method that calls `oEnv.newDialog({ id: "myFeature" })` with the exact same ID
- [ ] If opened via a UI button: layout JSON has a Button with `press.procName` pointing to the opener

### Build reminder

```bash
# Dev build (compile only)
npx gulp debug

```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `id` in `newDialog()` doesn't match `manifest.json` entry | They must be identical strings |
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
    manifest.json                   ← EDIT: add bundle entry { "id": "myFeature", "view": "dialog/myFeature.dialog.json" }
  (parent controller).ts            ← EDIT: add opener method calling oEnv.newDialog({ id: "myFeature" })
```
