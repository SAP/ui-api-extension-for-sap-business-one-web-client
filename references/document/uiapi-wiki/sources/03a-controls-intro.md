---
title: "WebClient UIAPI Reference — 03a: Controls Introduction"
tags: [controls, extension-architecture]
---

## Summary

This source defines the structural contract that every `b1.sdk` control follows. Controls are UI elements (buttons, inputs, grids, etc.) that handle user interaction, maintain state, and manage data. All controls adhere to SAP Fiori design guidelines.

Every control exposes four building blocks: **Properties** (visual/behavioural values), **Aggregations** (child control relationships), **Events** (user interaction triggers), and **Methods** (programmatic actions). Properties have implicit getter and setter methods following camelCase convention (`getValue` / `setValue`), but these are not documented per control in the source — only additional specific methods are listed.

Calling a setter on a read-only property has no effect and does not raise an error.

## Key facts

- All controls have: Properties, Aggregations, Events, Methods.
- Every property generates `get<Property>()` and `set<Property>()` methods automatically — not listed in the per-control docs.
- Setter on a read-only property: **silent no-op** — no error thrown.
- Naming convention: camelCase for all getter/setter methods.
- All controls follow SAP Fiori design guidelines.

## Concepts covered

[[control-object-model]]

## Controls covered

_None — this source covers the general model, not individual controls._

## Types covered

_None._

## Connections to existing wiki

Foundational contract for all control pages to follow. Informs the structure of every `wiki/controls/*.md` page. Clarifies why getter/setter methods are omitted from per-control documentation.
