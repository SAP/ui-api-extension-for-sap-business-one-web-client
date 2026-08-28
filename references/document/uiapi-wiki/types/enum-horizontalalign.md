---
title: "b1.sdk.HorizontalAlign"
category: enum
available_from: "FP 2405"
tags: [types-enums, controls]
source_count: 2
---

## Values

| Value | Description |
|---|---|
| `Begin` | Locale-specific positioning at the beginning of the line |
| `Center` | Centered alignment |
| `End` | Locale-specific positioning at the end of the line |
| `Left` | Hard left alignment |
| `Right` | Hard right alignment |

## Where used

- [[b1sdk-grid]] via [[type-column]] — `hAlign` property on Column (default: `Begin`)

## Notes

Similar to [[enum-textalign]] but without `Initial`. Used for container/column alignment, whereas TextAlign targets text content within an input. Controls with their own `textAlign` do NOT inherit `hAlign` from the Column — set `textAlign` directly on the cell template control if needed.

## Sources

- [[06a-types-enums]] — enum definition
- [[06b-types-aggregations]] — Column `hAlign` usage identified
