---
title: "b1.sdk.DatePicker"
type: control
available_from: "FP 2502"
tags: [controls, datetime]
source_count: 1
---

## What it is

A date input that supports both direct keyboard entry and a calendar popup. Maintains two separate formats: `valueFormat` (the internal string format used in `value`, `change` event params, and data binding) and `displayFormat` (the user-facing format shown in the field). `valueFormat` is ReadOnly — set it in layout JSON if you need a non-default format.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Field label |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `value` | string | `''` | No | Date value in `valueFormat` notation |
| `mandatory` | boolean | `false` | No | Shows a red asterisk before the label |
| `displayFormat` | string | locale medium | No | Format displayed in the input field (user-facing) |
| `displayFormatType` | string | locale default | No | Calendar type for display — see [[enum-calendartype]] (e.g. `"Gregorian"`, `"Persian"`) |
| `valueFormat` | string | `'yyyyMMdd'` | **Yes** | Format of the `value` property — **set in layout JSON only** |
| `placeholder` | string | displayFormat | No | Placeholder text; defaults to the `displayFormat` pattern if not set |
| `editable` | boolean | `true` | No | Whether the control is editable |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `valueState` | enum | `None` | No | Validation state — see [[enum-valuestate]] |
| `valueStateText` | string | `''` | No | Additional text for `valueState` |
| `textAlign` | enum | `Begin` | No | Text alignment — see [[enum-textalign]] |
| `maxDate` | Date | `null` | No | Maximum selectable date (JS `Date` object) |
| `minDate` | Date | `null` | No | Minimum selectable date (JS `Date` object) |
| `showCurrentDateButton` | boolean | `false` | No | Show a "Today" shortcut button in the calendar popup |
| `showFooter` | boolean | `false` | No | Show the footer area of the calendar popup |

## Events

| Event | Parameters | Description |
|---|---|---|
| `change` | `value`, `oldValue` | Fired when the date value changes; both params are strings in `valueFormat` |

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
  "guid": "fJVmCeRu9xZrLAPxAC3zZT",
  "ctrlType": "b1.sdk.DatePicker",
  "label": "Start Date",
  "valueFormat": "yyyyMMdd",
  "displayFormat": "MM/dd/yyyy",
  "displayFormatType": "Gregorian",
  "value": "20241231",
  "mandatory": true,
  "showCurrentDateButton": true,
  "change": { "procName": "onDateChange" }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oDP = await oView.DatePicker("fJVmCeRu9xZrLAPxAC3zZT");

// Read the value (string in valueFormat)
console.log(await oDP.getValue()); // e.g. "20241231"

// Set a new date value (must match valueFormat)
await oDP.setValue("20241108");

// Set min/max dates — use JS Date objects
// Note: monthIndex is 0-based (Jan = 0, Dec = 11)
const minDate = new Date(2024, 9, 1);   // Oct 1, 2024
const maxDate = new Date(2024, 11, 31); // Dec 31, 2024
await oDP.setMinDate(minDate);
await oDP.setMaxDate(maxDate);

await oDP.setDisplayFormat("yyyy-MM-dd");
await oDP.setValueState(b1.sdk.ValueState.Error);
await oDP.focus();
```

## Gotchas and traps

- **`valueFormat` is ReadOnly** — the storage format for `value`, `change` event params, and data binding is fixed at layout time. Default is `'yyyyMMdd'`. To use a different format, set `valueFormat` in layout JSON; you cannot change it at runtime.
- **`minDate`/`maxDate` are JS `Date` objects** — not strings. Pass `new Date(year, monthIndex, day)`.
- **`monthIndex` is 0-based in JS Date** — January = 0, December = 11. `new Date(2024, 9, 1)` = October 1, 2024.
- **`displayFormat` ≠ `valueFormat`** — the user sees `displayFormat` in the field; your controller receives `value` in `valueFormat`. These are independent.
- **`hideLabel` is ReadOnly** — set in layout JSON only.

## Relationships

Related controls: [[b1sdk-timepicker]], [[b1sdk-input]]
Types used: [[enum-valuestate]], [[enum-textalign]], [[enum-calendartype]]

## Sources

- [[03f-controls-datetime]] — full property/event/method reference and usage examples
