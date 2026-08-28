---
title: "b1.sdk.TextAlign"
category: enum
available_from: "FP 2405"
tags: [types-enums, controls]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `Begin` | Locale-specific positioning at the beginning of the line |
| `End` | Locale-specific positioning at the end of the line |
| `Left` | Hard left alignment |
| `Right` | Hard right alignment |
| `Center` | Centered text alignment |
| `Initial` | No text align set — browser default applies |

## Where used

- [[b1sdk-input]] — `textAlign` property (default depends on `inputType`: currency types → `Right`, others → `Begin`)

## Notes

`Begin` and `End` are locale-aware (in RTL locales, `Begin` is right-aligned). `Left` and `Right` are hard pixel alignments regardless of locale.

## Sources

- [[06a-types-enums]] — full enum definition
