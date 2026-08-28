---
title: "b1.sdk.Group"
category: aggregation-type
available_from: "FP 2405"
tags: [aggregations, controls, layout]
source_count: 1
---

## Shape

| Property | Type | Mandatory | Default | ReadOnly | Description |
|---|---|---|---|---|---|
| `guid` | string | **Yes** | N/A | **Yes** | Global unique identifier |
| `visible` | boolean | No | `true` | No | Whether the group is shown |
| `text` | string | No | `''` | No | Group title |
| `align` | string | No | `'left'` | No | Label alignment: `'left'` or `'right'` only |
| `items` | Control[] | No | `[]` | No | Controls inside this group |
| `width` | int | No | `6` | No | Column span: **6** = two groups per row, **12** = full row |

**Events**: none.  
**Methods**: getter/setter for each property (`getVisible`/`setVisible`, `getText`/`setText`, `getAlign`/`setAlign`, `getWidth`/`setWidth`). Group objects are obtained at runtime via `subSection.getGroups()` (FP2608).

## Where used

- [[b1sdk-section]] — via [[type-subsection]] `groups[]` (third level of Section → SubSection → Group → items)

## Notes

**`width` only accepts `6` or `12`** — no other values documented. Default `6` places two groups side-by-side per row. Setting `width: 12` makes the group span the full row width.

`align` is a string literal with exactly two values: `"left"` (default) and `"right"` — not an enum.

## Sources

- [[06b-types-aggregations]] — full property table and usage example
