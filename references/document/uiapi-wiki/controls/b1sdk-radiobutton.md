---
title: "b1.sdk.RadioButton"
type: control
available_from: "FP 2502"
tags: [controls, boolean]
source_count: 1
---

## What it is

A single radio button for selecting one option from a set. Can be grouped via the `groupName` property (standalone approach) or nested inside a [[b1sdk-radiobuttongroup]] wrapper (aggregation approach). Only one button in a group can be selected at a time.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `text` | string | `''` | No | Text displayed next to the radio button |
| `selected` | boolean | `false` | **Yes** | Whether this button is selected — **setter is a no-op** |
| `enabled` | boolean | `true` | No | Whether the button can be interacted with |
| `editable` | boolean | `true` | No | Whether the user can select this button |
| `visible` | boolean | `true` | No | Whether the button is shown |
| `key` | string | `''` | No | Unique key identifying this button within its group |
| `groupName` | string | `''` | No | Group name linking standalone radio buttons for mutual exclusion |
| `textAlign` | enum | `Begin` | No | Text alignment — see [[enum-textalign]] |
| `textDirection` | enum | `Inherit` | No | Text direction — see [[enum-textdirection]] |
| `useEntireWidth` | boolean | `false` | No | If true, `width` applies to the whole control; if false, only to the label |
| `valueState` | enum | `None` | No | Validation state — see [[enum-valuestate]] |
| `width` | string | `''` | No | Width of the button or its label (depending on `useEntireWidth`) |
| `tooltip` | string | `''` | No | Hover tooltip text |

## Events

| Event | Parameters | Description |
|---|---|---|
| `select` | `selected` (boolean) | Fired when the user selects this radio button |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | FP 2502† | Sets focus to the control |
| `fireSelect({ selected? })` | FP 2508 | Programmatically fires the `select` event |

†Availability not explicitly stated in source; assumed FP2502 by analogy with other controls.

## Usage pattern

**Layout JSON (standalone with groupName):**
```json
{
  "guid": "t6C9qANmHC4NHxtWDEx5Ez",
  "ctrlType": "b1.sdk.RadioButton",
  "text": "Option 1",
  "selected": false,
  "enabled": true,
  "visible": true,
  "key": "Key1",
  "groupName": "Group1",
  "textAlign": "Begin",
  "textDirection": "Inherit",
  "useEntireWidth": false,
  "valueState": "None",
  "width": "100%",
  "tooltip": "Select option 1",
  "select": {
    "procName": "onRadioButtonSelect"
  }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oRadioButton = await oView.RadioButton("t6C9qANmHC4NHxtWDEx5Ez");

// Read state (selected is ReadOnly — cannot set programmatically)
console.log(await oRadioButton.getSelected());
console.log(await oRadioButton.getKey());

// Change other properties
await oRadioButton.setText("Option 2");
await oRadioButton.setEnabled(false);
await oRadioButton.setGroupName("Group2");
await oRadioButton.setTextAlign(b1.sdk.TextAlign.Left);
await oRadioButton.setValueState(b1.sdk.ValueState.Error);
await oRadioButton.setWidth("300px");
await oRadioButton.focus();
```

## Gotchas and traps

- **`selected` is ReadOnly** — the most important trap on this control. Unlike [[b1sdk-checkbox]], you cannot call `setSelected()` to select a RadioButton programmatically. Selection is driven by user interaction or by setting `selectedIndex` on a containing [[b1sdk-radiobuttongroup]].
- **Two grouping patterns**: `groupName` (standalone, each button declared separately in layout) vs nesting inside RadioButtonGroup's `items[]`. Both achieve mutual exclusion; RadioButtonGroup additionally provides `selectedIndex`, `columns` layout, and label.
- **`key`** identifies the button within its group — useful for reading which option was selected in an event handler.
- Source has a typo: `b1.sdk.VaueState` should be `b1.sdk.ValueState` (missing 'l').
- `focus()` availability not explicitly stated in source.

## Relationships

Part of group: [[b1sdk-radiobuttongroup]] (when used as `items[]`)
Related controls: [[b1sdk-checkbox]]
Types used: [[enum-textalign]], [[enum-textdirection]], [[enum-valuestate]]

## Sources

- [[03d-controls-boolean]] — full property/event/method reference and usage examples
