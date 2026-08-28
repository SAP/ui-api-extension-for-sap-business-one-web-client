---
title: "WebClient UIAPI Reference — 03d: Controls — CheckBox, RadioButton, RadioButtonGroup"
tags: [controls, boolean]
---

## Summary

Covers the three boolean-type controls in the b1.sdk surface. CheckBox is a standalone FP2405 toggle; RadioButton and RadioButtonGroup both arrived in FP2502 and are designed to work together.

RadioButton has a critical property difference from CheckBox: `selected` is **ReadOnly** on RadioButton — you cannot call `setSelected()` to select a button directly. Selection state is managed by user interaction (or by setting `selectedIndex` on the containing RadioButtonGroup). The `groupName` property on standalone RadioButtons is the alternative to RadioButtonGroup when a formal wrapper is not used.

RadioButtonGroup is a wrapper aggregation: RadioButton instances are nested as `items[]` directly in the layout JSON. Data binding for the group is only available from FP2508 — not at FP2502 launch. `selectedIndex` defaults to -1 (nothing selected).

All three controls share `fireSelect` (available FP2508) and `focus()`. CheckBox `focus()` is FP2502; RadioButton and RadioButtonGroup `focus()` availability is unlabelled (assumed FP2502 by analogy, but not stated in source).

## Key facts

- **CheckBox**: `selected` is writable; `hideLabel` ReadOnly; `fireSelect(mParameters: { selected? })` FP2508
- **RadioButton**: `selected` is **ReadOnly** — cannot be set programmatically; use `groupName` to group standalone radio buttons or nest them in RadioButtonGroup
- **RadioButton**: has `textAlign`, `textDirection`, `valueState`, `useEntireWidth`, `width` — richer styling than CheckBox
- **RadioButton**: `key` property identifies a button within a group (string)
- **RadioButtonGroup**: `items` aggregation holds `RadioButton[]` declared inline in layout JSON
- **RadioButtonGroup**: `selectedIndex` (int, default -1) is the selection handle — zero-based index of selected item
- **RadioButtonGroup**: data binding available from **FP2508** only (noted in source)
- **RadioButtonGroup**: `hideLabel` ReadOnly; `columns` controls grid layout of the buttons
- Source has a typo: `b1.sdk.VaueState` should be `b1.sdk.ValueState` (missing 'l') — treat as ValueState
- CheckBox `select` event `selected` parameter is typed as `string` in source (likely a doc error — should be `boolean` based on RadioButton's matching event)

## Controls covered

[[b1sdk-checkbox]], [[b1sdk-radiobutton]], [[b1sdk-radiobuttongroup]]

## Concepts covered

[[control-object-model]]

## Types covered

Forward refs: [[enum-textalign]], [[enum-textdirection]], [[enum-valuestate]]

## Connections to existing wiki

- Adds three new control pages to the wiki.
- Confirms the `hideLabel` ReadOnly pattern (also seen in Button, TextArea, MultiInput, StaticText).
- `fireSelect` FP2508 pattern mirrors `firePress` FP2508 on Button — a consistent cross-control pattern.
- `focus()` pattern continues as FP2502 on CheckBox; availability not explicitly stated for RadioButton/RadioButtonGroup.
- Introduces the first **aggregation-as-items** pattern for non-table controls (RadioButtonGroup.items).

## Open questions

- Is `focus()` on RadioButton/RadioButtonGroup available since FP2502 or a later pack? Source doesn't label it.
- Can standalone RadioButtons (using `groupName`) and a RadioButtonGroup be mixed in the same view?
