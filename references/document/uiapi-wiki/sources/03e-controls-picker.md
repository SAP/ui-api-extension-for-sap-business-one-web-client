---
title: "WebClient UIAPI Reference — 03e: Controls — ComboBox, MultiComboBox, ChooseFromList, FileUploader"
tags: [controls, picker]
---

## Summary

Covers the four picker-type controls. ComboBox and MultiComboBox are list-based selectors with optional secondary text filtering. ChooseFromList is a B1-table-driven picker with a mandatory `linkTo` property. FileUploader is the most complex control in the SDK surface to date with 20 properties, 4 events, and 7 methods.

The most important cross-control gotcha in this source: **MultiComboBox `items` does NOT support aggregation binding** — you must use the `loadItems` event to populate items dynamically. ChooseFromList has two ReadOnly-only properties set at layout time: `linkTo` (mandatory, the B1 table name) and `filter` (OData filter string). FileUploader's `value` (the selected file path) is also ReadOnly.

The event name `typeMissmatch` on FileUploader has a double-'s' spelling — this is the actual API name, not a typo to correct.

## Key facts

- **ComboBox**: `selectedKey` (string) is the selection handle; `getSelectedText()` reads display text; `filterSecondaryValues` extends search to `additionalText`; `loadItems` event for lazy-load dropdown; `fireChange`/`fireLoadItems` both FP2508; source has `b1.sdk.VaueState` typo (treat as ValueState)
- **MultiComboBox**: `selectedKeys` is `string[]`; `showSelectAll` adds select-all checkbox; **`items` does not support aggregation binding** — use `loadItems` event; `selectionChange` (per-item) fires before `selectionFinish` (batch, on close); `focus()` availability unstated
- **ChooseFromList**: FP2508; `linkTo` is **mandatory and ReadOnly** — must be set in layout JSON; `filter` is **ReadOnly** (OData filter, layout-only); allowed `linkTo` table list is versioned: FP2508 base list + FP2608 adds `DSC1`, `ITM2`; UDT/UDO tables via `@` prefix (e.g. `@NO_OBJECT`); `multiSelection` enables multi-row selection; not all tables support `showLinkButton`; `getSelectedText()` returns description of selected value; `focus()` availability unstated
- **FileUploader**: FP2508; `value` (file path) is **ReadOnly**; `uploadOnChange: true` = auto-upload on file select; `sendXHR` toggles XHR vs form-submit mechanism; `buttonOnly` renders as button without text field; `upload()`, `checkFileReadable()`, `clear()` are imperative action methods; `typeMissmatch` event name has intentional double-'s' (it's the actual API spelling); `style` accepts: `Transparent`, `Accept`, `Reject`, `Emphasized`
- Both ComboBox and ChooseFromList share `getSelectedText()` method (display text of selection)
- `editable` on FileUploader controls whether the text input path field is editable (not whether upload is allowed)

## Controls covered

[[b1sdk-combobox]], [[b1sdk-multicombobox]], [[b1sdk-choosefromlist]], [[b1sdk-fileuploader]]

## Concepts covered

[[control-object-model]]

## Types covered

Forward refs: [[enum-valuestate]], [[type-item]]

## Connections to existing wiki

- Adds four new control pages.
- `hideLabel` ReadOnly pattern continues across ComboBox, MultiComboBox, ChooseFromList, FileUploader.
- [[type-item]] forward ref strengthened — now used by ComboBox, MultiComboBox, and (via forward ref) [[b1sdk-multiinput]]. High priority to create this page when `06b` is ingested.
- MultiComboBox's aggregation binding restriction (`items` not supported) is a notable contrast to MultiInput's token model — both FP2602 controls with multi-value semantics but different binding constraints.
- ChooseFromList `linkTo` allowed table list will need updating as feature packs evolve; the current list is as of FP2508+FP2608.

## Open questions

- `focus()` on MultiComboBox, ChooseFromList: available from which FP? Source doesn't label them.
- ChooseFromList `filter` property has a suspicious DefaultValue of `false` in the source table (type is string, default should be `''`). Likely a documentation error.
- Does `multiSelection` on ChooseFromList affect the `change` event shape, or is it always a single `value`/`oldValue`?
- FileUploader `upload()` — does it respect `uploadUrl` set after layout? Any ordering constraints?
