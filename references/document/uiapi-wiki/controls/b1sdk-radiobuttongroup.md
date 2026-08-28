---
title: "b1.sdk.RadioButtonGroup"
type: control
available_from: "FP 2502"
tags: [controls, boolean]
source_count: 1
---

## What it is

A wrapper control that groups [[b1sdk-radiobutton]] instances together as an aggregation, enforcing single-selection semantics. Provides a shared label, column layout, and the `selectedIndex` property as the primary way to read and set the selection programmatically. The preferred approach when you need multiple radio options in a structured layout.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Label displayed above the group |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `editable` | boolean | `true` | No | Whether the group is editable |
| `enabled` | boolean | `true` | No | Whether the group is interactive |
| `visible` | boolean | `true` | No | Whether the group is shown |
| `selectedIndex` | int | `-1` | No | Zero-based index of the selected RadioButton; -1 = none selected |
| `textDirection` | enum | `LTR` | No | Text direction for the group — see [[enum-textdirection]] |
| `valueState` | enum | `None` | No | Validation state — see [[enum-valuestate]] |
| `width` | string | `''` | No | Width of the control |
| `columns` | int | `1` | No | Number of columns to arrange the radio buttons in |
| `items` | RadioButton[] | `[]` | No | The RadioButton controls within this group — declared inline in layout JSON |

## Events

| Event | Parameters | Description |
|---|---|---|
| `select` | `selectedIndex` (int) | Fired when the selection changes via user interaction |

Note: `selectedIndex` in the event is the zero-based index of the newly selected button.

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | FP 2502† | Sets focus to the control |
| `fireSelect({ selectedIndex? })` | FP 2508 | Programmatically fires the `select` event |

†Availability not explicitly stated in source; assumed FP2502 by analogy with other controls.

## Aggregations

| Name | Type | Notes |
|---|---|---|
| `items` | RadioButton[] | Child RadioButton controls; declared inline in layout JSON |

## Usage pattern

**Layout JSON (with inline RadioButton items):**
```json
{
  "guid": "t6C9qANmHC4NHxtWDEx5Ew",
  "ctrlType": "b1.sdk.RadioButtonGroup",
  "label": "Frequency",
  "hideLabel": false,
  "enabled": true,
  "editable": true,
  "visible": true,
  "selectedIndex": 1,
  "textDirection": "LTR",
  "valueState": "None",
  "width": "20rem",
  "columns": 2,
  "items": [
    {
      "guid": "PL7zsTkJRGGsbO8NVAn46A",
      "ctrlType": "b1.sdk.RadioButton",
      "text": "Daily",
      "key": "d",
      "enabled": true,
      "visible": true
    },
    {
      "guid": "BW4SOPbnRL6493h9hLJviQ",
      "ctrlType": "b1.sdk.RadioButton",
      "text": "Weekly",
      "key": "w",
      "enabled": true,
      "visible": true
    }
  ],
  "select": {
    "procName": "onFrequencySelect"
  }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oRBG = await oView.RadioButtonGroup("t6C9qANmHC4NHxtWDEx5Ew");

// Read selected index
console.log(await oRBG.getSelectedIndex());

// Set selection programmatically
await oRBG.setSelectedIndex(2);

// Access child items
const items = await oRBG.getItems();
console.log("Number of items:", items.length);

// Change group-level properties
await oRBG.setEditable(false);
await oRBG.setValueState(b1.sdk.ValueState.Warning);
await oRBG.setColumns(2);
await oRBG.focus();
```

**Event handler:**
```javascript
onFrequencySelect: function (oEnv, oEvent) {
    const idx = oEvent.getParameter("selectedIndex");
    console.log("Selected index:", idx);
}
```

## Gotchas and traps

- **Data binding available from FP2508 only** — RadioButtonGroup does not support data binding at FP2502 launch. If you need bound options, wait for FP2508 or implement manually.
- **`selectedIndex` defaults to -1** — no option is pre-selected unless you set it explicitly (in layout JSON or controller).
- **`hideLabel` is ReadOnly** — set in layout JSON only.
- **`items` are declared inline in layout JSON** — unlike controls that reference items by GUID elsewhere, RadioButton children live nested inside the RadioButtonGroup's JSON block.
- **`selected` on child RadioButtons is ReadOnly** — selection is always managed via `selectedIndex` on the group, not by setting `selected` on individual buttons.
- `textDirection` default is `LTR` (not `Inherit` as on standalone RadioButton).

## Relationships

Contains: [[b1sdk-radiobutton]]
Related controls: [[b1sdk-checkbox]]
Types used: [[enum-textdirection]], [[enum-valuestate]]

## Sources

- [[03d-controls-boolean]] — full property/event/method reference and usage examples
