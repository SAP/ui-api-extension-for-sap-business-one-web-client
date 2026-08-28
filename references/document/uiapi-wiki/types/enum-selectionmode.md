---
title: "b1.sdk.Grid.SelectionMode"
category: enum
available_from: "FP 2405"
tags: [types-enums, controls, grid, table]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `Multiple` | Select multiple rows at a time (toggle behaviour) |
| `Single` | Select one row at a time |
| `None` | No rows can be selected |

## Where used

- [[b1sdk-grid]] — `selectionMode` property (default: `Multiple`)

## Notes

**Namespace**: `b1.sdk.Grid.SelectionMode` — scoped to Grid, not top-level `b1.sdk`. This is one of only three sub-namespaced enums in the SDK.

Default is `Multiple` — unlike most UI frameworks where `Single` is default. Set explicitly to `Single` if single-row selection is needed.

## Sources

- [[06a-types-enums]] — full enum definition
