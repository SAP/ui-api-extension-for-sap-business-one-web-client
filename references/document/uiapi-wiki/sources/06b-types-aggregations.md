---
title: "WebClient UIAPI Reference — 06b: Types — Aggregations"
tags: [aggregations, types-enums, controls, grid, table]
---

## Summary

Defines all aggregation types (child objects used in control aggregations) and the two parameter types (SDKEnv, Event). 8 aggregation types are documented: Item, SubSection, Group, Row, Column, LightBoxItem, MenuItem, SegmentedButtonItem, FormContainer, Token. Also fully documents the `Event` parameter type, including `preventDefault()`.

The most operationally significant new facts:
- **`oEvent.preventDefault()`** is now fully documented — call it in a `before` handler to block the system action (e.g. prevent an "Add & View" button from executing its default save behaviour).
- **`b1.sdk.Column`** has a `hAlign` property using `b1.sdk.HorizontalAlign` — resolves the forward reference from the enum source.
- **`b1.sdk.Group`** `width` property only accepts `6` or `12` (two groups per row vs. full-width single group).
- Grid `columns[]` is the aggregation key name for Column children.
- `b1.sdk.Row` exposes typed control accessors (e.g. `Input(guid)`) — this is what `oRow.Input("guid")` calls internally.

## Key facts

- **`b1.sdk.Item`** (FP2405): key (mandatory), text, enabled, additionalText — used by ComboBox, RadioButtonGroup, ChooseFromList, etc.
- **`b1.sdk.SubSection`** (FP2405): guid (mandatory/ReadOnly), visible, text, groups[] — second level of Section hierarchy
- **`b1.sdk.Group`** (FP2405): guid (mandatory/ReadOnly), visible, text, align (left/right), items[], width (6 or 12 only) — `width: 12` = full row, `width: 6` = two per row (default)
- **`b1.sdk.Row`** (FP2405): no properties; methods: `getIndex()` → int, typed control accessors (e.g. `Input(sCtrlGuid)`), `focus()` FP2502 — accessed via `oGrid.Row(index)`
- **`b1.sdk.Column`** (FP2405): guid (mandatory/ReadOnly), text, tooltip, width (CSS), minWidth (px), visible, useDefaultSort, sortProperty, filterProperty, filtered (ReadOnly), hAlign (HorizontalAlign, default Begin) — `columns` is the JSON aggregation key on Grid; `template` child is the cell control
- **`b1.sdk.LightBoxItem`** (FP2502): guid (mandatory/ReadOnly), imageSrc (mandatory), alt, subtitle, title — if `imageSrc` not set, popup will not open
- **`b1.sdk.MenuItem`** (FP2502): guid (mandatory/ReadOnly), key, text, icon, enabled, startsSection, visible, textDirection; events: `press`; `firePress()` FP2508
- **`b1.sdk.SegmentedButtonItem`** (FP2502): guid (mandatory/ReadOnly), key, text, icon, enabled, visible, width, textDirection; events: `press`; `firePress()` FP2508; supports aggregation binding via template
- **`b1.sdk.FormContainer`** (FP2502): guid (mandatory/ReadOnly), title, visible, items[] — grouping unit inside Form
- **`b1.sdk.Token`** (FP2602): guid (mandatory/ReadOnly), key, text — no events, no methods beyond getters/setters
- **`Event` type methods**: `getId()`, `getSource()`, `getParameters()`, `getParameter(name)`, **`preventDefault()`** — all return Promises
- **`oEvent.preventDefault()`** — call in `before` handler to block system action; documented with Sales Quotation "Add & View" example

## Controls covered

No new controls. Aggregation types resolve forward refs from all control pages.

## Concepts covered

[[event-flow]] — `Event` type and `preventDefault()` fully documented here; update needed.

## Types covered

New pages: [[type-item]], [[type-subsection]], [[type-group]], [[type-row]], [[type-column]], [[type-lightboxitem]], [[type-menuitem]], [[type-segmentedbuttonitem]], [[type-formcontainer]], [[type-token]]

Updated: [[enum-horizontalalign]] — Column `hAlign` identified as the consumer.

## Connections to existing wiki

- **[[b1sdk-grid]]**: `columns[]` is the JSON aggregation key; `b1.sdk.Column` fully documented; `filtered` property is ReadOnly; `useDefaultSort: false` means sort logic is in the `sort` event handler.
- **[[b1sdk-section]]**: SubSection and Group property tables now fully defined; `width` on Group is 6/12 only.
- **[[b1sdk-image]]**: `imageContent[]` holds `LightBoxItem[]` — `imageSrc` mandatory on LightBoxItem; if not set, popup won't open.
- **[[b1sdk-menubutton]]**: MenuItem properties fully defined including `startsSection` for visual separators.
- **[[b1sdk-segmentedbutton]]**: SegmentedButtonItem supports aggregation binding (template example confirmed).
- **[[b1sdk-form]]**: FormContainer has no methods beyond getters/setters.
- **[[b1sdk-multiinput]]**: Token type (key, text) confirmed — no events or methods.
- **[[event-flow]]**: `Event.preventDefault()` — the mechanism for `before` handler cancellation now fully understood; update event-flow page.

## Open questions

None.
