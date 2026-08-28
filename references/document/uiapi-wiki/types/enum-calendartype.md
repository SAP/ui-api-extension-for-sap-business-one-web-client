---
title: "b1.sdk.CalendarType"
category: enum
available_from: "FP 2502"
tags: [types-enums, controls, datetime]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `Buddhist` | Thai Buddhist calendar |
| `Gregorian` | Gregorian calendar |
| `Islamic` | Islamic calendar |
| `Japanese` | Japanese emperor calendar |
| `Persian` | Persian Jalali calendar |

## Where used

- [[b1sdk-datepicker]] — `displayFormatType` property

## Notes

Controls the calendar system used for date display and selection in DatePicker. Does not affect the stored `value` format (which is always governed by `valueFormat`, defaulting to `yyyyMMdd`).

## Sources

- [[06a-types-enums]] — full enum definition
