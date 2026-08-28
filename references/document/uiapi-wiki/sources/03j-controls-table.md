---
title: "WebClient UIAPI Reference — 03j: Controls — Grid"
tags: [controls, table, grid]
---

## Summary

Covers the Grid control — the most method-rich control in the SDK. Grid is a full-featured data table available since FP2405. `rowsData` is a ReadOnly mandatory property used exclusively for data binding. The control has a rich selection API, programmatic filter/sort, row and column access methods, and a 2D clipboard paste event.

The most critical access pattern distinction: **`getSelectedIndices()` returns UI-layer indices (what's visible), while `getAllSelectedIndices()` returns actual data indices** — these differ when the grid is sorted or filtered. Row cells are accessed via `oGrid.Row(index)` then `oRow.ControlType("guid")`, not via `oView.ControlType("guid")`.

Source code comments (`//? no this exposed method`) confirm that `setColumnHeaderVisible`, `setEnableSelectAll`, and `setShowNoData` are not exposed as setters — only their `get*` counterparts work.

## Key facts

- **`rowsData` is ReadOnly and mandatory** — the data binding property; cannot be changed at runtime
- **`selectionMode` default is `multiple`** — not single; set explicitly if single-row selection is needed
- **`selectionBehavior` type is `b1.sdk.Grid.SelectionBehavior`** — scoped to Grid, not a top-level enum
- **`getSelectedIndices()` vs `getAllSelectedIndices()`**: former returns visible (UI) indices; latter returns actual data indices (accounts for sort/filter)
- **Row cell access pattern**: `oGrid.Row(index)` → `oRow.ControlType("guid")` — NOT via `oView.ControlType()`
- **Column access**: `oGrid.Column("guid")` or `oGrid.getColumns()`
- **`setFilter({filters, and})`**: programmatic filter; `and` boolean determines logical AND/OR combination
- **`paste` event `data`**: `string[][]` — 2D array (first dimension = rows, second = cells)
- `scrollToRowIndex(index)` FP2608 — the only FP2608 method on Grid
- All `fire*` events are FP2508
- **`setColumnHeaderVisible`, `setEnableSelectAll`, `setShowNoData` are not exposed** — source confirms with `//? no this exposed method`; only `get*` counterparts work; configure in layout JSON
- `getEditable()` is getter-only — `editable` is not a layout JSON property and has no setter

## Controls covered

[[b1sdk-grid]]

## Concepts covered

[[control-object-model]], [[overlay-mechanism]] (FP2511 grid cell template patching)

## Types covered

Forward refs: [[type-row]], [[type-column]], [[enum-selectionmode]], [[enum-selectionbehavior-grid]]

## Connections to existing wiki

- Adds one new control page — the last of the 26+ controls series.
- [[overlay-mechanism]] already documents FP2511 grid cell template patching via Column GUID + `template` block; this source provides the runtime API complement.
- Grid is explicitly forbidden inside a Form (documented in [[b1sdk-form]]).
- `b1.sdk.Grid.SelectionBehavior` is an unusual sub-namespace — the only enum scoped to a specific control class rather than the top-level `b1.sdk`.

## Open questions

None.
