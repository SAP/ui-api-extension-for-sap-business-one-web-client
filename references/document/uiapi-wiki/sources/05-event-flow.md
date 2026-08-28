---
title: "WebClient UIAPI Reference — 05: Event Flow"
tags: [events, event-flow, lifecycle, handlers]
---

## Summary

Covers the event flow architecture: how events are triggered, what parameters they carry, the structure of event handlers, and the three lifecycle hooks. Establishes the unified handler signature `async function(oEnv, oEvent)` that applies to every event in the framework.

The most operationally significant fact: **`setValue` (and similar value-change API calls) automatically fires the corresponding change event**, creating a risk of infinite loops if an event handler itself calls `setValue`. This must be handled defensively.

The pre/post handler mechanism (`before`/`after` alongside `procName`) allows injecting logic before or after a system event handler — including the ability to modify or cancel the event in the `before` handler.

## Key facts

- **Event triggers**: manual user interaction OR programmatic API calls (`setValue`, etc.)
- **`setValue` fires the change event automatically** — calling it inside a change handler risks an infinite loop
- **Unified handler signature**: `async function(oEnv, oEvent)` — same shape for all events
- **`oEnv`**: `SDKEnv` instance — runtime context, access to `ActiveView`, services, etc.
- **`oEvent`**: `Event` instance — call `oEvent.getParameters()` to get all params, `oEvent.getParameter("key")` for a single param
- **Built-in params on every event**: `sCtrlGuid`, `sViewGuid` — internal use only
- **Event-specific params**: defined per event (e.g. `value`, `oldValue` on `change`)
- **Pre/post handlers**: defined in layout JSON alongside `procName` as `before` and `after` keys
  - `before`: can modify event parameters or prevent the event from dispatching
  - `after`: runs after the main handler; used for post-event business logic
  - Only valid when no system-defined handler is already in place for that event slot
- **Lifecycle hooks** (three, predefined):
  - `onInit(oEnv, oEvent)`: called when view is instantiated, controls already created; use for one-time init and event handler binding
  - `onDataLoad(oEnv, oEvent)`: called asynchronously after `onInit` when data loads; use for `setCustomizedData` and model setup
  - `onExit(oEnv, oEvent)`: called when view is destroyed; use for resource cleanup

## Controls covered

No new controls. Handler pattern applies universally.

## Concepts covered

[[event-flow]] (new), [[control-object-model]], [[sdk-env]]

## Types covered

Forward refs: `Event` type (getParameters, getParameter), `SDKEnv` — already documented in [[sdk-env]]

## Connections to existing wiki

- **[[data-binding]]**: `onDataLoad` is the canonical hook for `setCustomizedData` — confirmed here as the lifecycle event that fires "when data is loaded".
- **[[sdk-env]]**: `oEnv` in handlers is the same `SDKEnv` instance documented there.
- **[[b1sdk-dialog]]**: `onInit`/`onDataLoad`/`onExit` are also the dialog lifecycle hooks — this source provides the general contract that the dialog page already referenced.
- All control pages that document fire* methods: `fireXxx()` calls also trigger the event handler chain.

## Open questions

None.
