---
title: "b1.sdk.ObjectStatus"
type: control
available_from: "FP 2502"
tags: [controls, display]
source_count: 1
---

## What it is

A display control that shows a status label combining text, an icon, and a semantic colour state. When `active` is true, the control is clickable and fires a `press` event. Supports both ValueState and IndicationColor for the `state` property — these are two separate enum types.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Field label |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `text` | string | `''` | No | Status text displayed in the control |
| `value` | string | `''` | No | Additional value text |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `active` | boolean | `true` | No | Whether the control is clickable (fires `press` when true) |
| `state` | enum | `None` | No | Semantic colour — accepts [[enum-valuestate]] OR [[enum-indicationcolor]] |
| `icon` | string | `''` | No | Icon URI (e.g. `sap-icon://accept`) |
| `inverted` | boolean | `false` | No | If true, the `state` colour fills the background instead of colouring the text |
| `emptyIndicatorMode` | enum | `Off` | No | Whether to show a dash when text is empty — see [[enum-emptyindicatormode]] |
| `textDirection` | enum | `LTR` | No | Text direction — see [[enum-textdirection]] |

## Events

| Event | Parameters | Description |
|---|---|---|
| `press` | — | Fired when the user clicks the control (only when `active` is true) |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | †FP 2502 | Sets focus to the control |
| `firePress()` | FP 2508 | Programmatically fires `press` |

†Availability not explicitly stated in source; assumed FP2502 (control launch).

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "pAFX5CoGSlusNe2PzXSItg",
  "ctrlType": "b1.sdk.ObjectStatus",
  "label": "Status",
  "text": "Document Status",
  "state": "Success",
  "icon": "sap-icon://accept",
  "active": true,
  "inverted": true,
  "emptyIndicatorMode": "On",
  "press": { "procName": "onStatusPress" }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oOS = await oView.ObjectStatus("pAFX5CoGSlusNe2PzXSItg");

await oOS.setText("Approved");
await oOS.setState(b1.sdk.ValueState.Success);
// or use IndicationColor:
// await oOS.setState(b1.sdk.IndicationColor.Indication01);
await oOS.setIcon("sap-icon://accept");
await oOS.setInverted(true);
await oOS.focus();
```

## Gotchas and traps

- **`state` accepts two enum types**: `b1.sdk.ValueState` (None/Success/Warning/Error/Information) and `b1.sdk.IndicationColor` (Indication01–Indication10). These are distinct types; the property accepts either.
- **`inverted` flips the colour target**: when false, `state` colours the text/icon; when true, `state` fills the background. Affects readability significantly.
- **`active` defaults to `true`** — the control is clickable by default. Set `active: false` if you want a purely informational indicator with no click behaviour.
- **`hideLabel` is ReadOnly** — set in layout JSON only.

## Relationships

Related controls: [[b1sdk-objectnumber]], [[b1sdk-messagestrip]]
Types used: [[enum-valuestate]], [[enum-indicationcolor]], [[enum-emptyindicatormode]], [[enum-textdirection]]

## Sources

- [[03g-controls-display]] — full property/event/method reference and usage examples
