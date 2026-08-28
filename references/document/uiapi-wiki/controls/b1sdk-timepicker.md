---
title: "b1.sdk.TimePicker"
type: control
available_from: "FP 2502"
tags: [controls, datetime]
source_count: 1
---

## What it is

A time input that supports both direct keyboard entry and a clock dial popup. Follows the same dual-format model as [[b1sdk-datepicker]]: `valueFormat` (internal storage, ReadOnly, default `'HHmm'`) and `displayFormat` (user-facing, writable, default `'HH:mm'`). Simpler than DatePicker — no calendar type, no min/max constraints.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Field label |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `value` | string | `''` | No | Time value in `valueFormat` notation |
| `mandatory` | boolean | `false` | No | Shows a red asterisk before the label |
| `displayFormat` | string | `'HH:mm'` | No | Format displayed in the input field (user-facing) |
| `valueFormat` | string | `'HHmm'` | **Yes** | Format of the `value` property — **set in layout JSON only** |
| `placeholder` | string | `''` | No | Placeholder text |
| `editable` | boolean | `true` | No | Whether the control is editable |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `valueState` | enum | `None` | No | Validation state — see [[enum-valuestate]] |
| `valueStateText` | string | `''` | No | Additional text for `valueState` |
| `textAlign` | enum | `Begin` | No | Text alignment — see [[enum-textalign]] |
| `showCurrentTimeButton` | boolean | `false` | No | Show a "Now" shortcut button in the time picker popup |

## Events

| Event | Parameters | Description |
|---|---|---|
| `change` | `value`, `oldValue` | Fired when the time value changes; both params are strings in `valueFormat` |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | †FP 2502 | Sets focus to the control |
| `fireChange({ value?, oldValue? })` | FP 2508 | Programmatically fires `change` |

†Availability not explicitly stated in source; assumed FP2502 (control launch).

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "VHLk7K8fQlqwH3XcLHXZFg",
  "ctrlType": "b1.sdk.TimePicker",
  "label": "Start Time",
  "valueFormat": "HH:mm:ss",
  "displayFormat": "HH:mm:ss",
  "value": "09:34:10",
  "mandatory": true,
  "showCurrentTimeButton": true,
  "change": { "procName": "onTimeChange" }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oTP = await oView.TimePicker("VHLk7K8fQlqwH3XcLHXZFg");

// Read value (string in valueFormat)
console.log(await oTP.getValue()); // e.g. "09:34:10" if valueFormat is "HH:mm:ss"

// Set new time value
await oTP.setValue("11:10:07");

await oTP.setDisplayFormat("HH mm ss");
await oTP.setValueState(b1.sdk.ValueState.Error);
await oTP.setShowCurrentTimeButton(true);
await oTP.focus();
```

## Gotchas and traps

- **`valueFormat` is ReadOnly** — default is `'HHmm'` (no separator). If your controller expects `"09:34"` or `"09:34:10"`, set `valueFormat` to the appropriate pattern in layout JSON. You cannot change it at runtime.
- **`displayFormat` and `valueFormat` are independent** — the user sees `displayFormat`; your code receives `value` in `valueFormat`. They can differ.
- **`hideLabel` is ReadOnly** — set in layout JSON only.
- No `minDate`/`maxDate` equivalent — time range constraints are not supported.
- No `displayFormatType` (calendar systems) — this is a time-only control.

## Relationships

Related controls: [[b1sdk-datepicker]], [[b1sdk-input]]
Types used: [[enum-valuestate]], [[enum-textalign]]

## Sources

- [[03f-controls-datetime]] — full property/event/method reference and usage examples
