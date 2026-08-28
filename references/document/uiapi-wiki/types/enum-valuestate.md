---
title: "b1.sdk.ValueState"
category: enum
available_from: "FP 2405"
tags: [types-enums, controls]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `Error` | State is not valid |
| `Information` | State is informative |
| `Success` | State is valid |
| `Warning` | State is valid but with a warning |
| `None` | State is not specified |

## Where used

- [[b1sdk-input]] — `valueState` property
- [[b1sdk-textarea]] — `valueState` property
- [[b1sdk-multiinput]] — `valueState` property
- [[b1sdk-combobox]] — `valueState` property
- [[b1sdk-multicombobox]] — `valueState` property
- [[b1sdk-choosefromlist]] — `valueState` property
- [[b1sdk-datepicker]] — `valueState` property
- [[b1sdk-timepicker]] — `valueState` property
- [[b1sdk-objectstatus]] — `state` property (alternative to [[enum-indicationcolor]])

## Notes

Source files `03d`, `03e`, `03f`, `03g` contain a typo `b1.sdk.VaueState` (missing 'l') — this is a documentation error. The correct name is `b1.sdk.ValueState`.

ObjectStatus `state` accepts EITHER `b1.sdk.ValueState` OR `b1.sdk.IndicationColor` — two enum types for a single property.

## Sources

- [[06a-types-enums]] — full enum definition
