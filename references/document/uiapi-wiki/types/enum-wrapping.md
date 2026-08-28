---
title: "b1.sdk.Wrapping"
category: enum
available_from: "FP 2502"
tags: [types-enums, controls, input]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `Hard` | Inserts actual line breaks at the wrap point |
| `None` | Standard browser wrapping behaviour |
| `Off` | Wrapping not allowed |
| `Soft` | Text stays on one line but displays across several lines visually |

## Where used

- [[b1sdk-textarea]] — `wrapping` property (type is this enum)

## Notes

Do not confuse with [[b1sdk-statictext]] `wrapping` — StaticText `wrapping` is a **boolean**, not this enum. Same property name, different types on different controls.

Also distinct from [[enum-wrappingtype]] (`b1.sdk.WrappingType`), which controls hyphenation behaviour.

## Sources

- [[06a-types-enums]] — full enum definition
