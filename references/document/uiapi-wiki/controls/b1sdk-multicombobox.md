---
title: "b1.sdk.MultiComboBox"
type: control
available_from: "FP 2602"
tags: [controls, picker]
source_count: 1
---

## What it is

A multi-select dropdown where the user can choose multiple items. Selected items are tracked as an array of keys (`selectedKeys`). Supports optional secondary text, a "Select All" checkbox, and lazy item loading via the `loadItems` event. Similar to [[b1sdk-multiinput]] but selection-based (keys) rather than token-based.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Field label |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `enabled` | boolean | `true` | No | Whether the control is interactive |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `selectedKeys` | string[] | `[]` | No | Keys of currently selected items |
| `showSecondaryValues` | boolean | `false` | No | Whether `additionalText` is displayed in the dropdown |
| `showSelectAll` | boolean | `false` | No | Whether a Select All checkbox appears at the top of the dropdown |
| `items` | Item[] | `[]` | No | Dropdown items — see [[type-item]]; **aggregation binding not supported** |
| `valueState` | enum | `None` | No | Validation state — see [[enum-valuestate]] |
| `valueStateText` | string | `''` | No | Additional text displayed for `valueState` |

## Events

| Event | Parameters | Description |
|---|---|---|
| `selectionChange` | `changedItem`, `changedItems[]`, `selected`, `selectAll` | Fired when a single item's selection state changes |
| `selectionFinish` | `selectedItems[]` | Fired when the dropdown closes — provides the full final selection |
| `loadItems` | — | Fired when the dropdown opens to allow dynamic item loading |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | †FP 2602 | Sets focus to the control |
| `fireSelectionChange({ changedItem?, changedItems?, selected?, selectAll? })` | FP 2602 | Programmatically fires `selectionChange` |
| `fireSelectionFinish({ selectedItems? })` | FP 2602 | Programmatically fires `selectionFinish` |
| `fireLoadItems()` | FP 2602 | Programmatically fires `loadItems` |

†Availability not explicitly stated in source; assumed FP2602 (control launch).

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "5JvixMiFSQujuXdbNkj7UA",
  "ctrlType": "b1.sdk.MultiComboBox",
  "label": "Currency",
  "showSelectAll": true,
  "selectedKeys": ["L", "C"],
  "items": [
    { "key": "L", "text": "Local Currency",  "enabled": true },
    { "key": "S", "text": "System Currency", "enabled": true },
    { "key": "C", "text": "BP Currency",     "enabled": true }
  ],
  "selectionFinish": { "procName": "onSelectionFinish" },
  "loadItems":       { "procName": "onLoadItems" }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oMCB = await oView.MultiComboBox("5JvixMiFSQujuXdbNkj7UA");

// Read current selection
console.log(await oMCB.getSelectedKeys());

// Set selection
await oMCB.setSelectedKeys(["S"]);
await oMCB.setValueState(b1.sdk.ValueState.Error);
await oMCB.setShowSelectAll(true);
await oMCB.focus();
```

**Event handlers:**
```javascript
onSelectionFinish: async function (oEnv, oEvent) {
    const selectedItems = oEvent.getParameter("selectedItems");
    // selectedItems is an array of Item objects
},

onLoadItems: async function (oEnv, oEvent) {
    const oMCB = await oEvent.getSource();
    // Populate items dynamically here
    // (aggregation binding is NOT supported for items)
}
```

## Gotchas and traps

- **`items` does NOT support aggregation binding** — even with data binding configured, the `items` aggregation cannot be bound. Use the `loadItems` event for dynamic item loading.
- **`selectionChange` vs `selectionFinish`**: `selectionChange` fires on each item toggle (useful for real-time feedback); `selectionFinish` fires once when the dropdown closes (the final selection batch). For model updates, prefer `selectionFinish`.
- **`hideLabel` is ReadOnly** — set in layout JSON only.
- `selectedKeys` is a `string[]` — set the full array to replace the selection, not individual keys.
- No `editable` property — use `enabled` to disable interaction.

## Relationships

Related controls: [[b1sdk-combobox]], [[b1sdk-multiinput]]
Types used: [[type-item]], [[enum-valuestate]]

## Sources

- [[03e-controls-picker]] — full property/event/method reference and usage examples
