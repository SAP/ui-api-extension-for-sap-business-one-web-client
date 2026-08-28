---
title: "b1.sdk.WrappingType"
category: enum
available_from: "FP 2405"
tags: [types-enums, controls]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `Hyphenated` | Words broken on syllables where possible |
| `Normal` | Standard wrapping — words not broken by hyphenation |

## Where used

- [[b1sdk-statictext]] — `wrappingType` property; controls hyphenation when `wrapping` is `true`

## Notes

Distinct from [[enum-wrapping]] (`b1.sdk.Wrapping`), which is the TextArea wrapping enum. `WrappingType` controls the hyphenation behaviour of text wrapping; `Wrapping` controls the line-break strategy.

## Sources

- [[06a-types-enums]] — full enum definition
