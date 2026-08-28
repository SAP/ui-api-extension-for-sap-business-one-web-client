---
title: "Control Object Model"
aliases: [control model, properties events methods aggregations, b1.sdk control contract]
tags: [controls, extension-architecture]
source_count: 1
---

## Definition

Every `b1.sdk` control exposes four building blocks: **Properties**, **Aggregations**, **Events**, and **Methods**. This is the uniform contract all controls in the SAP B1 Web Client UI API follow.

## The four pillars

### Properties

Values that govern the visual appearance or behaviour of a control. Examples: the text on a Button, whether a CheckBox is checked, the value state of an Input.

**Getter/setter convention:** Every property `foo` automatically has:
- `getFoo()` — reads the current value
- `setFoo(value)` — sets a new value

These derived getter/setter methods are **not listed in the per-control documentation** (see note below). Only additional specialised methods are documented per control.

**Read-only properties:** A small subset of properties are read-only. Calling `setFoo()` on a read-only property is a **silent no-op** — no error is thrown, no change occurs. Read-only properties are called out on individual control pages.

### Aggregations

Define parent–child relationships between controls. A control's aggregation holds one or more child controls of a specific type. Example: `b1.sdk.Grid` has a `columns` aggregation that holds `b1.sdk.Column` children.

Aggregations can be bound to a data model for dynamic rendering. See [[data-binding]].

### Events

Fired in response to user interactions or state changes. Examples: `press` on a Button, `change` on an Input.

Events are declared in the overlay JSON and handled in the controller. Each event passes an `oEvent` object to the handler; parameters are accessed via `oEvent.getParameter("name")`. Events support before/after hook patterns. See [[event-flow]].

### Methods

Functions that go beyond simple property get/set. Examples: `open()` / `close()` on a Dialog, `getSelectedItem()` on a ComboBox, `addRow()` on a Grid. These are explicitly documented on each control page.

## Naming convention

All getter/setter methods use **camelCase**:
- Property `value` → `getValue()` / `setValue()`
- Property `buttonType` → `getButtonType()` / `setButtonType()`
- Property `selectedIndex` → `getSelectedIndex()` / `setSelectedIndex()`

## Important note on documentation

The source documentation does **not** list getter/setter methods for each control — they are implicit from the property name. This wiki follows the same convention: control pages document **Properties** (as a table), **Events**, and **Methods** (additional/specialised only), with the understanding that all listed properties have implicit getters and setters unless marked read-only.

## Connections

Related concepts: [[data-binding]], [[event-flow]], [[overlay-mechanism]], [[sdk-env]]
All control pages: [[b1sdk-button]], [[b1sdk-input]], [[b1sdk-grid]], … (see index)

## Sources

- [[03a-controls-intro]] — defines the four-pillar model and getter/setter convention
