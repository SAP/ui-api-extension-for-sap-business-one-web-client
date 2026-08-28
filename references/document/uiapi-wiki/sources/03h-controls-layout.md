---
title: "WebClient UIAPI Reference — 03h: Controls — Section, HBox"
tags: [controls, layout]
---

## Summary

Covers the two layout controls. Section is the top-level structural container for object page views; HBox is a horizontal flex container for arbitrary control composition.

Section establishes the deep nesting hierarchy used in object page layouts: `Section → SubSection[] → Group[] → items[]`. All three levels (Section, SubSection, Group) are distinct aggregation types with their own GUIDs. Section has no controller interaction pattern in the source — it is effectively layout-only. SubSection and Group are forward refs to `06b-types-aggregations.md`.

HBox is the only container that holds a heterogeneous `items[]` of arbitrary control types. Child controls declared inside an HBox are still registered in the view by GUID — they can be accessed either through `getItems()` or directly via `oView.Button("guid")`. The `width` percentage caveat is important: percentage widths only work if the parent container has a defined width.

## Key facts

- **Section**: FP2405; hierarchy is `Section → SubSection[] → Group[] → items[]`; all levels have their own GUIDs; no events, no `focus()`; `showTitle` controls title visibility; `text` default documented as `"Start"` — likely a documentation error (should be `''`)
- **Section**: no controller interaction shown; primarily a layout structure declaration in JSON
- **HBox**: FP2502; `items[]` holds mixed control types inline; three flexbox layout properties: `direction` (FlexDirection), `justifyContent` (FlexJustifyContent), `alignItems` (FlexAlignItems); no events, no `focus()`
- **HBox**: child controls are accessible both via `getItems()[n]` and directly via `oView.ControlType("guid")` — GUIDs are view-registered regardless of nesting
- **HBox**: `width` percentage requires parent container to have defined width
- **HBox**: `hideLabel` ReadOnly

## Controls covered

[[b1sdk-section]], [[b1sdk-hbox]]

## Concepts covered

[[control-object-model]], [[overlay-mechanism]]

## Types covered

Forward refs: [[type-subsection]], [[type-group]], [[enum-flexdirection]], [[enum-flexjustifycontent]], [[enum-flexalignitems]]

## Connections to existing wiki

- Adds two new control pages.
- Section's three-level hierarchy (Section/SubSection/Group) resolves the structural container model that was referenced implicitly in overlay examples.
- HBox's `items[]` pattern is the third variant of the "controls-inside-controls" pattern (after RadioButtonGroup and ChooseFromList) — all use inline JSON declaration, all GUIDs are view-registered.
- New enum forward refs: FlexDirection, FlexJustifyContent, FlexAlignItems — all to be resolved in `06a`.

## Open questions

None.
