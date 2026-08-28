---
title: "b1.sdk.Dialog"
type: control
available_from: "FP 2502"
tags: [controls, container, dialog]
source_count: 1
---

## What it is

A modal popup that interrupts the current view and requires user interaction. Dialogs have their own separate JSON file, their own controller, and must be registered in `manifest.json`. They are opened by the parent view controller via `oEnv.newDialog()`.

Two dialog types exist:
- **Simple** (FP2502): uses one or more `Form` controls in `content[]` for a structured label-field layout
- **Complex** (FP2508): uses `Section[]` in `tabs[]` for tab-based layouts with a read-only `header`

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `type` | string | `'Simple'` | **Yes** | Dialog type: `Simple` or `Complex` — set in dialog JSON only |
| `controller` | string | N/A | **Yes** | Fully qualified dialog controller name — mandatory |
| `title` | string | `''` | No | Dialog title |
| `contentWidth` | string | `'80%'` | No | Width of the dialog content area |
| `contentHeight` | string | `'80%'` | No | Height of the dialog content area |
| `draggable` | boolean | `false` | No | Whether the dialog can be dragged |
| `resizable` | boolean | `true` | No | Whether the dialog can be resized |
| `showHeader` | boolean | `true` | No | Whether the header area is shown |
| `icon` | string | `''` | No | Icon shown in the dialog header |
| `state` | ValueState | `None` | No | Title state colour — see [[enum-valuestate]] |
| `horizontalScrolling` | boolean | `true` | No | Whether horizontal scrolling is enabled |
| `content` | array | `[]` | **Yes** | Simple dialog content (Form controls) — set in dialog JSON only |
| `footer` | array | `[]` | **Yes** | Footer buttons — set in dialog JSON only |
| `tabs` | array | `[]` | **Yes** | Complex dialog tabs (Section controls) — FP2508+ |
| `header` | object | `{}` | **Yes** | Complex dialog header (`{ groups: Group[] }`) — FP2508+ |

## Events

None.

## Methods

| Method | Signature | Description |
|---|---|---|
| `open(context?)` | `(any) → Promise<any>` | Opens the dialog; returns whatever data `close()` was called with |
| `close(context?)` | `(any) → Promise<void>` | Closes the dialog; passes data back to the `open()` caller |
| Plus getters/setters | — | For all non-ReadOnly properties |

## Dialog controller lifecycle hooks

| Hook | Description |
|---|---|
| `onInit(oEnv, oEvent)` | Called when the dialog is first initialised |
| `onDataLoad(oEnv, oEvent)` | Called to load data into the dialog view |
| `onExit(oEnv, oEvent)` | Called when the dialog is closed/destroyed |

Inside the dialog controller, use `oView.getWindow()` to get the dialog window object, then call `oWindow.close(data)` to close with return data.

## Type-specific restrictions

**Simple dialog** — forbidden in `content[]`:
- `Section` / `SubSection` / `Group`
- `Grid`

**Complex dialog** — forbidden in `tabs[]`:
- `MessageStrip`
- `Form`

## Setup workflow (5 steps)

1. **Create dialog folder**: `webapp/dialog/`
2. **Create dialog JSON** (e.g. `simple.dialog.json`) with `type`, `controller`, `content`/`footer`
3. **Create dialog controller** (e.g. `webapp/controller/SimpleDialog.js`) with lifecycle hooks
4. **Open dialog from parent controller** using `oEnv.newDialog({id})`
5. **Register in `manifest.json`** under `b1.bundles` with `id`, `view` path, optional `i18n`

## Usage pattern

**Dialog JSON (`webapp/dialog/simple.dialog.json`):**
```json
{
  "guid": "V2nRA0BBuKF54lqUAbqEA",
  "type": "Simple",
  "controller": "sapb1.MyApp.controller.SimpleDialog",
  "title": "My Dialog",
  "contentWidth": "800px",
  "contentHeight": "700px",
  "resizable": true,
  "content": [
    {
      "guid": "CFksI9gERAmLClCBSx6EZA",
      "ctrlType": "b1.sdk.Form",
      "formContainers": [ ... ]
    }
  ],
  "footer": [
    { "guid": "jWB3OltWTa2cHxWwZVr6zQ", "ctrlType": "b1.sdk.Button", "text": "Submit",
      "press": { "procName": "onSubmit" } },
    { "guid": "rK0V08FAQlmErncDwhoR2Q", "ctrlType": "b1.sdk.Button", "text": "Close",
      "press": { "procName": "onClose" } }
  ]
}
```

**Dialog controller (`webapp/controller/SimpleDialog.js`):**
```javascript
define([], function () {
  class Controller {
    async onInit(oEnv, oEvent) { /* setup */ }

    async onDataLoad(oEnv, oEvent) {
      const oView = await oEnv.ActiveView();
      await oView.setCustomizedData({ myDate: "10/16/2024" }, "demo");
    }

    async onClose(oEnv, oEvent) {
      const oView = await oEnv.ActiveView();
      const oWindow = await oView.getWindow();
      await oWindow.close();              // close with no data
    }

    async onSubmit(oEnv, oEvent) {
      const oView = await oEnv.ActiveView();
      const data = await oView.getCustomizedData("demo");
      const oWindow = await oView.getWindow();
      await oWindow.close(data);          // return data to caller
    }
  }
  return Controller;
});
```

**Parent controller (opening the dialog):**
```javascript
async onOpenDialog(oEnv, oEvent) {
  const dialog = await oEnv.newDialog({ id: "simple.dialog" });
  const dialogData = await dialog.open();   // blocks until dialog closes
  await dialog.close();                      // cleanup
  console.log("Returned data:", dialogData);
}
```

**manifest.json registration:**
```json
{
  "b1.bundles": [
    {
      "id": "simple.dialog",
      "view": "dialog/simple.dialog.json",
      "i18n": {
        "@@i18nDialog": ["sapb1.MyApp.i18n.i18n"]
      }
    }
  ]
}
```

**Complex dialog header (FP2508+):**
```json
"header": {
  "groups": [
    {
      "guid": "w21VGqOcTYqRSQZq7PRsxg",
      "ctrlType": "b1.sdk.Group",
      "text": "Document Info",
      "items": [
        { "guid": "...", "ctrlType": "b1.sdk.ObjectStatus", "text": "Active" }
      ]
    }
  ]
}
```

## Gotchas and traps

- **`type` and `controller` are ReadOnly** — set in dialog JSON only. You cannot change Simple↔Complex at runtime.
- **`content`, `footer`, `tabs`, `header` are all ReadOnly** — the dialog structure is fixed at declaration time.
- **`dialog.open()` returns the data passed to `oWindow.close(data)`** — this is the primary pattern for returning results from a dialog.
- **`oView.getWindow()` is dialog-controller-only** — this method is only available inside a dialog's own controller. Calling it from a regular view controller is not supported.
- **Dialog must be registered in `manifest.json`** under `b1.bundles` — without this, `oEnv.newDialog({id})` will fail.
- **Complex dialog forbids MessageStrip** — use ObjectStatus or other display controls in the header instead.
- Footer buttons are declared in the dialog JSON; their GUIDs are view-registered in the dialog's view scope.

## Relationships

Contains (Simple): [[b1sdk-form]]
Contains (Complex tabs): [[b1sdk-section]]
Opened via: [[sdk-env]] (`newDialog`)
Types used: [[enum-valuestate]], [[type-formcontainer]]

## Sources

- [[03i-controls-container]] — full property, method, lifecycle, and multi-file workflow reference
