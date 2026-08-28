---
title: "b1.sdk.Row"
category: aggregation-type
available_from: "FP 2405"
tags: [aggregations, controls, grid, table]
source_count: 2
---

## Shape

No properties. Row is a runtime object returned by `oGrid.Row(index)` — it is not defined in layout JSON.

## Methods

### Utility

| Method | Signature | Available | Description |
|---|---|---|---|
| `getIndex()` | `() → number` | FP2405 | Returns the row's index in the Grid |
| `focus()` | `() → Promise<void>` | FP2502 | Sets focus to the row |

### Typed cell accessors

Each method takes an optional `sCtrlGuid` string (the GUID of the cell control) and returns a Promise resolving to that control type.

| Method | Available |
|---|---|
| `Input(sCtrlGuid?)` | FP2405 |
| `Button(sCtrlGuid?)` | FP2405 |
| `CheckBox(sCtrlGuid?)` | FP2405 |
| `ComboBox(sCtrlGuid?)` | FP2405 |
| `StaticText(sCtrlGuid?)` | FP2405 |
| `MessageStrip(sCtrlGuid?)` | FP2502 |
| `HBox(sCtrlGuid?)` | FP2502 |
| `DatePicker(sCtrlGuid?)` | FP2502 |
| `TimePicker(sCtrlGuid?)` | FP2502 |
| `ObjectStatus(sCtrlGuid?)` | FP2502 |
| `MenuButton(sCtrlGuid?)` | FP2502 |
| `MenuItem(sCtrlGuid?)` | FP2502 |
| `Image(sCtrlGuid?)` | FP2502 |
| `TextArea(sCtrlGuid?)` | FP2502 |
| `LightBoxItem(sCtrlGuid?)` | FP2502 |
| `RadioButton(sCtrlGuid?)` | FP2502 |
| `RadioButtonGroup(sCtrlGuid?)` | FP2502 |
| `ObjectNumber(sCtrlGuid?)` | FP2502 |
| `ProgressIndicator(sCtrlGuid?)` | FP2502 |
| `SegmentedButton(sCtrlGuid?)` | FP2502 |
| `SegmentedButtonItem(sCtrlGuid?)` | FP2502 |
| `ChooseFromList(sCtrlGuid?)` | FP2508 |
| `MultiComboBox(sCtrlGuid?)` | FP2602 |
| `MultiInput(sCtrlGuid?)` | FP2602 |
| `Token(sCtrlGuid?)` | FP2602 |

## Where used

- [[b1sdk-grid]] — returned by `oGrid.Row(index)` — see Row Cell Access Pattern

## Critical access note

Row cell controls are **NOT view-registered**. They must be accessed via the Row object:

```javascript
const oRow = await oGrid.Row(0);
const oInput = await oRow.Input("cellGuid");  // correct
// await oView.Input("cellGuid");             // WRONG — cell controls are Row-scoped
```

## Sources

- [[03j-controls-table]] — Row access pattern introduced in Grid context
- [[06b-types-aggregations]] — full method table including all 24 typed cell accessors
