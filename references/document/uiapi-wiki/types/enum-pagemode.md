---
title: "b1.sdk.PageMode"
category: enum
available_from: "FP 2502"
tags: [types-enums, sdk-env]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `addMode` | View is in the state of creating a business object |
| `editMode` | View is in the state of editing a business object |
| `viewMode` | View is in the state of viewing a business object |

## Where used

- [[sdk-env]] — `oView.getPageMode()` on Detail views; returns the current page mode

## Notes

Values mirror the `$viewStatus` pre-defined data model properties (`addMode`, `editMode`, `viewMode`). The difference: `$viewStatus` is a binding model with boolean flags; `b1.sdk.PageMode` is an enum for API/method return values.

## Sources

- [[06a-types-enums]] — full enum definition
