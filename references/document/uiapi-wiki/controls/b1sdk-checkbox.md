---
title: "b1.sdk.CheckBox"
type: control
available_from: "FP 2405"
tags: [controls, boolean]
source_count: 1
---

## What it is

A standalone boolean toggle control. Users click to check or uncheck, firing a `select` event. The most basic boolean input in the b1.sdk surface.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Control label text |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `selected` | boolean | `false` | No | Whether the checkbox is checked |
| `editable` | boolean | `true` | No | Whether the user can interact with the control |
| `visible` | boolean | `true` | No | Whether the control is shown |

## Events

| Event | Parameters | Description |
|---|---|---|
| `select` | `selected` (boolean) | Fired when the checkbox is checked or unchecked |

Note: the source documents `selected` as type `string` in the event parameters table — this appears to be a documentation error; treat it as `boolean` consistent with RadioButton's matching event.

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | FP 2502 | Sets focus to the control |
| `fireSelect({ selected? })` | FP 2508 | Programmatically fires the `select` event |

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "tbmGK6QJaacC7EkYUWUt8K",
  "ctrlType": "b1.sdk.CheckBox",
  "label": "Accept terms",
  "hideLabel": false,
  "tooltip": "Check to accept",
  "editable": true,
  "visible": true,
  "select": {
    "procName": "onCheckBoxSelect"
  }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oCheckBox = await oView.CheckBox("tbmGK6QJaacC7EkYUWUt8K");

// Toggle selection
await oCheckBox.setSelected(!await oCheckBox.getSelected());
await oCheckBox.setEditable(true);
await oCheckBox.setLabel("Updated label");
await oCheckBox.setTooltip("New hint");
await oCheckBox.setVisible(true);

console.log("selected:", await oCheckBox.getSelected());
await oCheckBox.focus();
```

**Event handler:**
```javascript
onCheckBoxSelect: function (oEnv, oEvent) {
    const selected = oEvent.getParameter("selected");
    console.log("CheckBox selected:", selected);
}
```

## Gotchas and traps

- **`hideLabel` is ReadOnly** — set in layout JSON only; the setter is a silent no-op.
- **`select` event `selected` param**: source types it as `string` — likely a documentation error. Treat it as `boolean`.
- Unlike RadioButton, `selected` is writable — you can toggle it programmatically.
- No `enabled` property — use `editable` to prevent interaction (consistent with [[b1sdk-input]]).

## Relationships

Related controls: [[b1sdk-radiobutton]], [[b1sdk-radiobuttongroup]]
Concept: [[control-object-model]]

## Sources

- [[03d-controls-boolean]] — full property/event/method reference and usage examples
