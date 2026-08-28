---
title: "b1.sdk.Column"
category: aggregation-type
available_from: "FP 2405"
tags: [aggregations, controls, grid, table]
source_count: 1
---

## Shape

| Property | Type | Mandatory | Default | ReadOnly | Description |
|---|---|---|---|---|---|
| `guid` | string | **Yes** | N/A | **Yes** | Global unique identifier. Columns get "COLUMN_" prefix; cell templates get "CELL_" prefix automatically |
| `text` | string | No | `''` | No | Column header label |
| `tooltip` | string | No | `''` | No | Tooltip for the column header |
| `width` | string | No | `''` | No | Column width in CSS units (e.g. `"100px"`, `"20%"`) |
| `minWidth` | int | No | `0` | No | Minimum width in pixels |
| `visible` | boolean | No | `true` | No | Whether the column is shown |
| `useDefaultSort` | boolean | No | `true` | No | If `false`, developer must implement sort logic in the `sort` event handler |
| `sortProperty` | string | No | `''` | No | Binding property to sort on (required when template has composite bindings) |
| `filtered` | boolean | No | `false` | **Yes** | ReadOnly — indicates if a filter is currently active on this column |
| `filterProperty` | string | No | `''` | No | Binding property to filter on |
| `hAlign` | b1.sdk.HorizontalAlign | No | `Begin` | No | Horizontal alignment of column content — see [[enum-horizontalalign]] |

**Note**: controls inside a Column template have their own text alignment (`textAlign`) and do NOT inherit `hAlign` — set text align directly on the template control if needed.

**Events**: none.  
**Methods**: getter and setter for each property; `focus()` (FP2502).

## Where used

- [[b1sdk-grid]] — `columns[]` aggregation (JSON key is `columns`)

## Column template structure

Each Column has a `template` child that defines the cell control:

```json
{
  "ctrlType": "b1.sdk.Column",
  "guid": "k12qZkmVovquw6fXLmRxqz",
  "text": "Name",
  "sortProperty": "name",
  "filterProperty": "name",
  "template": {
    "ctrlType": "b1.sdk.Input",
    "guid": "dcmfTcU59HCwny9WxkWMZy",
    "editable": "{=!${$viewStatus>/viewMode}}",
    "value": "{@@demo>name}"
  }
}
```

## Notes

- `filtered` is ReadOnly — it reflects whether the user or code has applied a filter; cannot be set programmatically.
- `useDefaultSort: false` is needed when you implement custom sort logic in the Grid `sort` event.
- GUID auto-prefixing: the framework prepends `COLUMN_` to column GUIDs and `CELL_` to cell template GUIDs internally.

## Sources

- [[06b-types-aggregations]] — full property table and usage example
