---
title: "b1.sdk.SegmentedButtonItem"
category: aggregation-type
available_from: "FP 2502"
tags: [aggregations, controls]
source_count: 1
---

## Shape

| Property | Type | Mandatory | Default | ReadOnly | Description |
|---|---|---|---|---|---|
| `guid` | string | **Yes** | N/A | **Yes** | Global unique identifier |
| `key` | string | No | `''` | No | Key of the item |
| `text` | string | No | `''` | No | Display text |
| `icon` | string | No | `''` | No | RFC3986 URI for an icon |
| `enabled` | boolean | No | `true` | No | Whether the item is interactive |
| `visible` | boolean | No | `true` | No | Whether the item is shown |
| `width` | string | No | `''` | No | Width in CSS units |
| `textDirection` | b1.sdk.TextDirection | No | `Inherit` | No | Text direction — see [[enum-textdirection]] |

**Events**: `press` — fired when the user clicks this button.  
**Methods**: `focus()`; `firePress()` (FP2508). Note: no getter/setter explicitly listed (unlike other aggregation types).

## Where used

- [[b1sdk-segmentedbutton]] — `items[]` aggregation (inline or aggregation binding with template)

## Notes

SegmentedButtonItem supports **aggregation binding** via template — unlike most aggregation types which are inline-only. This allows dynamic population of segment options from a model.

## Sources

- [[06b-types-aggregations]] — full property table and aggregation binding example
