---
title: "b1.sdk.ObjectNumber"
type: control
available_from: "FP 2502"
tags: [controls, display]
source_count: 1
---

## What it is

A display control that shows a numeric value alongside a unit string (e.g. `"234506.79"` + `"AUD"`). Supports semantic colouring via `state`, bold rendering via `emphasized`, and optional click behaviour via `active`. No events.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `number` | string | `''` | No | The numeric value to display (as a string) |
| `unit` | string | `''` | No | The unit qualifier (e.g. currency code, UOM) |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `state` | string | `None` | No | Semantic colour state — see [[enum-valuestate]] (source types as `string`) |
| `active` | boolean | `false` | No | Whether the control is clickable |
| `textAlign` | enum | `Begin` | No | Horizontal alignment of number and unit — see [[enum-textalign]] |
| `textDirection` | enum | `Inherit` | No | Text direction — see [[enum-textdirection]] |
| `emptyIndicatorMode` | enum | `Off` | No | Whether to show a dash when number is empty — see [[enum-emptyindicatormode]] |
| `inverted` | boolean | `false` | No | If true, `state` colour fills background instead of text |
| `emphasized` | boolean | `true` | No | Whether the number renders in bold/emphasis style |

## Events

None.

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | †FP 2502 | Sets focus to the control |

†Availability not explicitly stated in source; assumed FP2502 (control launch).

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "IwPnSwnnShG81CaeM7o7dw",
  "ctrlType": "b1.sdk.ObjectNumber",
  "number": "234506.7891",
  "unit": "AUD",
  "state": "Warning",
  "active": true,
  "textAlign": "End",
  "emphasized": false
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oON = await oView.ObjectNumber("IwPnSwnnShG81CaeM7o7dw");

await oON.setNumber("5566.79");
await oON.setUnit("EUR");
await oON.setState(b1.sdk.ValueState.Success);
await oON.setEmphasized(true);
await oON.setTextAlign(b1.sdk.TextAlign.End);
await oON.focus();
```

## Gotchas and traps

- **`active` defaults to `false`** — unlike [[b1sdk-objectstatus]] where it defaults to `true`. ObjectNumber is non-interactive by default.
- **`emphasized` defaults to `true`** — bold rendering is on by default.
- **`state` is typed as `string` in source** (not enum) — may be a documentation error. Use `b1.sdk.ValueState` values in practice.
- **No `label` property** — unlike most other controls, ObjectNumber has no label field.
- No events — ObjectNumber is purely display-oriented.

## Relationships

Related controls: [[b1sdk-objectstatus]], [[b1sdk-statictext]]
Types used: [[enum-valuestate]], [[enum-textalign]], [[enum-textdirection]], [[enum-emptyindicatormode]]

## Sources

- [[03g-controls-display]] — full property/event/method reference and usage examples
