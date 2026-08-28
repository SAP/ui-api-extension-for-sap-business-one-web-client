---
title: "WebClient UIAPI Reference — 03c: Controls — Input, TextArea, MultiInput, StaticText"
tags: [controls, input]
---

## Summary

This source documents four text-oriented controls. Input (FP 2405) and StaticText (FP 2405) are the foundational single-line text controls; TextArea (FP 2502) extends this to multi-line; MultiInput (FP 2602) adds a token-based multi-value pattern.

A consistent pattern across all four: `hideLabel` is ReadOnly — it can only be set in the layout JSON. All four support `focus()` (Input/StaticText from FP 2502). The `change` event always carries `value` and `oldValue` parameters.

## Key facts

- **`hideLabel` is ReadOnly** on all four controls — silent no-op on setter.
- **TextArea `wrapping`** is an enum (`b1.sdk.Wrapping` — e.g. `"Soft"`, `"Off"`) — **not** a boolean. StaticText `wrapping` is a boolean. Same property name, different types.
- **MultiInput tokens** do not auto-sync to the bound model even with TwoWay binding. Token changes must be handled in application logic.
- **Input `textAlign`** default is `Right` when `inputType` is a currency type; `Begin` for all other input types.
- **Input `maxLength` 0** = unlimited (feature switched off). Same for TextArea `maxLength`.
- **TextArea sizing precedence**: `width` wins over `cols`; `height` wins over `rows`. Do not use `growing` together with `height`.
- **StaticText** HTML/script content in `text` is automatically escaped — safe but no rich text.
- **StaticText `wrappingType`** only has an effect when `wrapping` is `true`.
- MultiInput `fireChange`, `fireSuggest`, `fireValueHelpRequest`, `fireTokenUpdate` — all available from FP 2602 (no separate FP callout in source).
- Input has both `editable` and `enabled` — they are distinct: `enabled` controls interactivity entirely; `editable` controls whether the value can be edited (still interactive when editable=false).

## Controls covered

[[b1sdk-input]], [[b1sdk-textarea]], [[b1sdk-multiinput]], [[b1sdk-statictext]]

## Types covered

`b1.sdk.InputType`, `b1.sdk.TextAlign`, `b1.sdk.ValueState`, `b1.sdk.TextDirection`, `b1.sdk.Wrapping`, `b1.sdk.WrappingType`, `b1.sdk.Item`, `b1.sdk.Token` — forward references; to be documented with `06a-types-enums.md` and `06b-types-aggregations.md`.

## Connections to existing wiki

All four use [[control-object-model]] conventions. `hideLabel` ReadOnly pattern matches [[b1sdk-segmentedbutton]]. Token handling relates to [[data-binding]] (TwoWay binding does not cover tokens automatically).

## Open questions

None.
