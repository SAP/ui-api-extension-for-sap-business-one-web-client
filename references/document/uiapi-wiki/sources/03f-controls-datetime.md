---
title: "WebClient UIAPI Reference — 03f: Controls — DatePicker, TimePicker"
tags: [controls, datetime]
---

## Summary

Covers the two date/time input controls. Both arrived in FP2502 and share the same dual-format model: a **`valueFormat`** (internal storage format, ReadOnly) and a **`displayFormat`** (user-facing format, writable). The `valueFormat` is ReadOnly — its default (`yyyyMMdd` for dates, `HHmm` for times) applies unless explicitly overridden in the layout JSON.

DatePicker adds calendar-specific features: `minDate`/`maxDate` as JavaScript `Date` objects, a `displayFormatType` for calendar systems (Gregorian, Persian, etc.), and `showCurrentDateButton` for a "Today" shortcut. TimePicker mirrors the pattern with `showCurrentTimeButton` but omits the date-range and calendar-type properties.

Both controls fire `change` with `value`/`oldValue` strings; `fireChange` is FP2508.

## Key facts

- **Both controls**: `valueFormat` is **ReadOnly** — set in layout JSON to change the storage format; `focus()` availability unstated in source; `hideLabel` ReadOnly; `fireChange` FP2508
- **DatePicker**: `valueFormat` default `'yyyyMMdd'`; `displayFormat` default = locale medium format; `displayFormatType` accepts calendar type string (e.g. `"Gregorian"`, `"Persian"`); `minDate`/`maxDate` are JS `Date` objects (not strings); JS `Date` months are **0-indexed** (January = 0)
- **TimePicker**: `valueFormat` default `'HHmm'`; `displayFormat` default `'HH:mm'`; no `minDate`/`maxDate`; no `displayFormatType`
- `value` property is writable on both (the stored string in `valueFormat` notation)
- Source example shows `valueFormat` set in layout JSON — even though ReadOnly, it can be set at layout time (ReadOnly means no runtime setter)
- Source note: `Date(year, monthIndex, day)` — `monthIndex` starts from 0

## Controls covered

[[b1sdk-datepicker]], [[b1sdk-timepicker]]

## Concepts covered

[[control-object-model]]

## Types covered

Forward refs: [[enum-valuestate]], [[enum-textalign]], [[enum-calendartype]]

## Connections to existing wiki

- Adds two new control pages.
- Continues the `hideLabel` ReadOnly pattern.
- `valueFormat` ReadOnly is a new variant of the ReadOnly pattern — it affects the shape of `value` strings throughout the control's lifecycle.
- `displayFormatType` introduces `b1.sdk.CalendarType` enum — forward ref filed; will be resolved when `06a-types-enums.md` is ingested.

## Open questions

- `focus()` availability: which FP? Not stated.
- Does `minDate`/`maxDate` interact with data binding, or must they always be set as JS Date objects?
