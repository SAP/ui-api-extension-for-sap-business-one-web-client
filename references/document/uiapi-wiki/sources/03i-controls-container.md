---
title: "WebClient UIAPI Reference — 03i: Controls — Form, Dialog"
tags: [controls, container, dialog]
---

## Summary

Covers the two container controls. Form is a structured label-field layout used exclusively inside Simple Dialogs. Dialog is the popup mechanism — available in Simple (FP2502) and Complex (FP2508) variants — with its own controller lifecycle, separate JSON file, and manifest registration.

The Dialog source introduces the most complete multi-file workflow in the SDK so far: a dialog JSON file, a dialog controller, a manifest bundle registration, and a parent controller that opens it. `close(context)` passes data back to the caller, which is the primary mechanism for returning dialog results.

Form is notably constrained: it is not a standalone control and cannot be used in view layout files. Only valid inside a Simple Dialog's `content[]`. `leftLabel` and `gridLayoutData` are both ReadOnly.

## Key facts

- **Form**: **not standalone** — only valid inside a Simple Dialog's `content[]`; `leftLabel` ReadOnly; `gridLayoutData` ReadOnly (maps to UI5 ResponsiveGridLayout responsive grid); `formContainers` holds `FormContainer[]` (new aggregation forward ref), each with `title`, `visible`, `items[]`; forbidden inside Form: Section/SubSection/Group, Grid
- **Dialog**: `type` (`Simple`/`Complex`) is **ReadOnly and mandatory**; `controller` (fully qualified name) is **ReadOnly and mandatory**; `content[]` and `footer[]` are ReadOnly; `tabs` and `header` are ReadOnly (Complex only)
- **Dialog lifecycle**: separate JSON file in `webapp/dialog/`; controller in `webapp/controller/`; registered in `manifest.json` under `b1.bundles`
- **Dialog controller lifecycle hooks**: `onInit`, `onDataLoad`, `onExit`
- **Dialog open/close flow**: parent calls `oEnv.newDialog({id})` then `dialog.open()`; dialog controller calls `oView.getWindow()` then `oWindow.close(context)` to pass data back; parent receives returned data from `dialog.open()` return value
- **Simple dialog**: `content[]` holds `Form` controls; Simple only at FP2502
- **Complex dialog**: FP2508+; `tabs` holds `Section[]`; `header` holds `{ groups: Group[] }` (read-only display area); forbidden in Complex: MessageStrip, Form
- `oView.setCustomizedData(data, namespace)` / `oView.getCustomizedData(namespace)` used for data binding within dialog

## Controls covered

[[b1sdk-form]], [[b1sdk-dialog]]

## Concepts covered

[[sdk-env]] (newDialog method), [[control-object-model]]

## Types covered

Forward refs: [[type-formcontainer]], [[enum-valuestate]]

## Connections to existing wiki

- Adds two new control pages — the most architecturally complex source so far.
- `oEnv.newDialog({id})` was already documented in [[sdk-env]]; this source fills in the full end-to-end workflow.
- Introduces `oView.getWindow()` — a dialog-specific method only available inside dialog controllers. Documented in [[b1sdk-dialog]] and [[event-flow]].
- `oView.setCustomizedData` / `getCustomizedData` — new view methods for dialog data binding.
- Dialog `type` ReadOnly constraint is critical: you cannot change Simple↔Complex at runtime.
- Complex dialog restriction on MessageStrip is notable — cross-reference with [[b1sdk-messagestrip]].

## Open questions

None.
