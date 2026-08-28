---
title: "WebClient UIAPI Reference — 06a: Types — Enumerations"
tags: [types-enums, enumerations]
---

## Summary

Defines all `b1.sdk` enumeration types and the `int` primitive type. Resolves all forward references filed across the control pages. 19 enumerations are documented here, ranging from FP2405 to FP2502. Three enums are sub-namespaced under `b1.sdk.Grid` (SelectionMode, SelectionBehavior, ModelFilterOperator) — all others live at the top-level `b1.sdk` namespace.

The most operationally significant new fact: `b1.sdk.Grid.ModelFilterOperator` is the type for the `operator` field inside `setFilter({filters})` — previously the filter call was documented without naming the enum. Also notable: `b1.sdk.PopupDock` has a **breaking change in FP2605** (descriptions changed from lowercase phrases to PascalCase values due to a UI5 1.136.9 upgrade — same member names, different string content).

## Key facts

- **19 enumerations** documented; all live at `b1.sdk.*` except three Grid sub-namespace enums
- **Sub-namespaced (Grid only)**: `b1.sdk.Grid.SelectionMode`, `b1.sdk.Grid.SelectionBehavior`, `b1.sdk.Grid.ModelFilterOperator`
- **`b1.sdk.Grid.ModelFilterOperator`** (NEW): 14 operators (EQ, NE, GT, GE, LT, LE, BT, NB, Contains, NotContains, StartsWith, NotStartsWith, EndsWith, NotEndsWith) — used in `setFilter({filters: [{path, operator, value1}]})` on Grid
- **`b1.sdk.PopupDock` FP2605 breaking change**: descriptions changed from lowercase phrases to PascalCase — same member names, but if code depends on description strings, it may break on FP2605+
- **`b1.sdk.PageMode`** mirrors `$viewStatus` model fields: values are `addMode`, `editMode`, `viewMode` — used in SDKEnv `getPageMode()` (if such a method exists)
- **`b1.sdk.WrappingType`** (FP2405): for controls that wrap text with hyphenation support (Hyphenated / Normal) — distinct from `b1.sdk.Wrapping`
- **`b1.sdk.Wrapping`** (FP2502): TextArea `wrapping` property enum (Hard / None / Off / Soft)
- **`int` type**: JavaScript `number` without fractional part; constraint is advisory not enforced; default `0`
- **`b1.sdk.IndicationColor`**: 20 values (Indication01–Indication20); used as alternative to ValueState on ObjectStatus

## Controls covered

No new controls. All enum forward references from control pages are now resolved.

## Concepts covered

No new concepts.

## Types covered

New pages created for all 19 enums — see Types section in index.

## Connections to existing wiki

- **[[b1sdk-grid]]**: `b1.sdk.Grid.ModelFilterOperator` fills the gap in the `setFilter` documentation — `operator` field values now enumerable. Also confirms `selectionMode` type is `b1.sdk.Grid.SelectionMode` (sub-namespaced) and `selectionBehavior` type is `b1.sdk.Grid.SelectionBehavior`.
- **[[b1sdk-menubutton]]**: `b1.sdk.PopupDock` FP2605 change is relevant — MenuButton `dockAt` property uses this enum.
- **[[b1sdk-objectstatus]]**: `b1.sdk.IndicationColor` (Indication01–20) now fully documented — 20 values, semantic meaning is context-dependent.
- **[[b1sdk-textarea]]**: `b1.sdk.Wrapping` enum (Hard/None/Off/Soft) confirmed.
- **[[data-binding]]**: `b1.sdk.PageMode` aligns with `$viewStatus` — same three values.

## Open questions

None.
