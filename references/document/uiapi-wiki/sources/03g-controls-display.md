---
title: "WebClient UIAPI Reference — 03g: Controls — ObjectStatus, ObjectNumber, ProgressIndicator, MessageStrip, Image"
tags: [controls, display]
---

## Summary

Covers the five display-only controls. These controls present information rather than collecting it. All arrived in FP2502.

Key surprise: **MessageStrip `visible` defaults to `false`** — unlike every other control. It must be explicitly shown. **ObjectStatus `state`** accepts two different enum types: `b1.sdk.ValueState` and `b1.sdk.IndicationColor`. Image introduces the **`LightBoxItem`** aggregation type for popup display. ProgressIndicator separates `percentValue` (the actual fill level) from `displayValue` (the text shown inside the bar) — these are independent.

## Key facts

- **ObjectStatus**: `state` accepts `b1.sdk.ValueState` OR `b1.sdk.IndicationColor` (two enums for one property); `inverted` flips color from text to background; `active: true` makes it clickable (fires `press`); `firePress` FP2508; has `value` and `text` as separate properties; `hideLabel` ReadOnly
- **ObjectNumber**: no events; `active` default `false` (opposite of ObjectStatus); `emphasized` default `true`; `state` typed as `string` in source (not enum); no `label`/`hideLabel`; `textDirection` default `Inherit`
- **ProgressIndicator**: `percentValue` (float, 0–100) drives fill; `displayValue` is independent text shown in bar; `displayOnly` mode changes visualization and blocks focus; `displayAnimation` enables animated transitions; `hideLabel` ReadOnly; no events
- **MessageStrip**: **`visible` defaults to `false`** — must explicitly show; `type` uses `b1.sdk.MessageType` enum; `close()` is an action method (programmatic close); `close` event fires when user clicks close button; `fireClose` FP2508; no `label`/`hideLabel`
- **Image**: `imageContent` aggregation holds `b1.sdk.LightBoxItem[]` for lightbox popup; `src` must comply with CSP for external URLs; `lazyLoading`; `fireLoad`/`firePress` FP2508; `LightBoxItem` has `imageSrc`, `alt`, `subtitle`, `title` fields
- Source has `b1.sdk.VaueState` typo again on ObjectStatus

## Controls covered

[[b1sdk-objectstatus]], [[b1sdk-objectnumber]], [[b1sdk-progressindicator]], [[b1sdk-messagestrip]], [[b1sdk-image]]

## Concepts covered

[[control-object-model]]

## Types covered

Forward refs: [[enum-valuestate]], [[enum-indicationcolor]], [[enum-messagetype]], [[enum-emptyindicatormode]], [[enum-textdirection]], [[type-lightboxitem]]

## Connections to existing wiki

- Adds five new control pages. Total display controls documented.
- **New enum type**: `b1.sdk.IndicationColor` — ObjectStatus `state` accepts this OR ValueState. High priority forward ref.
- **New enum type**: `b1.sdk.MessageType` — MessageStrip `type`. Forward ref filed.
- **New enum type**: `b1.sdk.EmptyIndicatorMode` — used by ObjectStatus and ObjectNumber.
- **New aggregation type**: `b1.sdk.LightBoxItem` — used by Image `imageContent`.
- MessageStrip `visible` default `false` is a unique exception to the universal `visible: true` default across all other controls.

## Open questions

- Does `ProgressIndicator.focus()` work when `displayOnly: true` is set? Source says `displayOnly` prevents focus.
- `ObjectNumber.state` is typed as `string` in source — is this intentional or a documentation error?
