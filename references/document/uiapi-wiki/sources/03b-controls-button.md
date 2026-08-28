---
title: "WebClient UIAPI Reference — 03b: Controls — Button, MenuButton, SegmentedButton"
tags: [controls, input]
---

## Summary

This source documents three button-family controls. Button (FP 2405) is the basic action trigger; MenuButton (FP 2502) adds a dropdown menu in Regular or Split mode; SegmentedButton (FP 2502) is a horizontal multi-segment selector.

A recurring pattern across all three: `focus()` is available on each, and programmatic `fire*()` methods were added in FP 2508. Items aggregations (MenuItem for MenuButton, SegmentedButtonItem for SegmentedButton) are accessible at runtime via `getItems()`, and individual item properties can be mutated directly on the returned objects.

## Key facts

- **Button** `buttonType` uses `b1.sdk.ButtonType`; **MenuButton** uses `type` (not `buttonType`) for the same enum — property name differs between the two.
- **SegmentedButton** `hideLabel` is **ReadOnly** — setter is a no-op.
- `fireSelectionChange` on SegmentedButton has an unusual nested parameter shape: `{ item?, selectionChange?: { oldValue?, value? } }`.
- `focus()` on Button is FP 2502; `firePress()` on Button is FP 2508.
- MenuButton `buttonMode: Split` enables a separate `defaultAction` event from the main button; `useDefaultActionOnly` only takes effect in Split mode.
- MenuButton items are inline `MenuItem[]` in the layout JSON (not separate overlay entries).
- SegmentedButton `mandatory` shows a red asterisk before the label.

## Controls covered

[[b1sdk-button]], [[b1sdk-menubutton]], [[b1sdk-segmentedbutton]]

## Types covered

`b1.sdk.ButtonType`, `b1.sdk.MenuButtonMode`, `b1.sdk.PopupDock`, `b1.sdk.TextDirection` — forward references; to be documented with `06a-types-enums.md`.
`b1.sdk.MenuItem`, `b1.sdk.SegmentedButtonItem` — aggregation types; to be documented with `06b-types-aggregations.md`.

## Connections to existing wiki

All three controls use [[control-object-model]] conventions. Events wired via [[overlay-mechanism]]. Retrieved at runtime via [[sdk-env]] `ActiveView()` typed getters.

## Open questions

None.
