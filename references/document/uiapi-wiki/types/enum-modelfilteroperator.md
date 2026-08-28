---
title: "b1.sdk.Grid.ModelFilterOperator"
category: enum
available_from: "FP 2405"
tags: [types-enums, controls, grid, table]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `BT` | Between (inclusive range) |
| `Contains` | Contains substring |
| `EQ` | Equals |
| `EndsWith` | Ends with |
| `GE` | Greater than or equal |
| `GT` | Greater than |
| `LE` | Less than or equal |
| `LT` | Less than |
| `NB` | Not Between |
| `NE` | Not equals |
| `NotContains` | Does not contain |
| `NotEndsWith` | Does not end with |
| `NotStartsWith` | Does not start with |
| `StartsWith` | Starts with |

## Where used

- [[b1sdk-grid]] — `operator` field in filter objects passed to `setFilter({ filters: [{path, operator, value1}], and })`

## Usage

```javascript
await oGrid.setFilter({
    filters: [
        { path: "Status", operator: "EQ", value1: "A" },
        { path: "Amount", operator: "GE", value1: "100" }
    ],
    and: true   // combine with AND; false = OR
});
```

## Notes

**Namespace**: `b1.sdk.Grid.ModelFilterOperator` — scoped to Grid, not top-level `b1.sdk`. This is one of three sub-namespaced Grid enums.

The `operator` value can be passed as a string literal (e.g. `"EQ"`) or via the enum (e.g. `b1.sdk.Grid.ModelFilterOperator.EQ`).

`BT` (Between) uses `value1` as the lower bound and `value2` as the upper bound.

## Sources

- [[06a-types-enums]] — full enum definition
