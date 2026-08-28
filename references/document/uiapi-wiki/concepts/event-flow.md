---
title: "Event Flow"
aliases: [event handler, lifecycle hooks, pre-event, post-event]
tags: [events, event-flow, lifecycle, handlers]
source_count: 2
---

## Definition

The event flow is the path from an event trigger (user interaction or programmatic API call) through optional pre-handlers, the main event handler, and optional post-handlers. All events in the Web Client UIAPI share the same handler signature and parameter envelope.

## How it works

### Event triggers

Events can be triggered in two ways:

1. **Manual user interaction** — clicking a button, changing an input, selecting a dropdown item, etc.
2. **Programmatic API calls** — value-change methods like `setValue()` **automatically fire the corresponding change event** after modifying the control.

This means calling `setValue()` inside a `change` event handler will fire `change` again — creating an infinite loop. Guard against this explicitly.

### Handler signature

Every event handler, regardless of which event or control, uses the same async signature:

```javascript
myHandler: async function (oEnv, oEvent) {
    const params = oEvent.getParameters();   // all event params as object
    const val    = oEvent.getParameter("value"); // single param by name
}
```

| Argument | Type | Description |
|---|---|---|
| `oEnv` | `SDKEnv` | Runtime context — same instance as in lifecycle hooks; gives access to `ActiveView`, services, etc. |
| `oEvent` | `Event` | Event instance; use `getParameters()` or `getParameter(key)` to read event data |

### Event parameters

Every event carries:
- **Built-in params** (internal): `sCtrlGuid`, `sViewGuid` — identify which control and view fired the event; for internal use only
- **Event-specific params**: defined per event (e.g., `change` carries `value` and `oldValue`; `rowSelectionChange` carries `rowIndex`, `rowIndices`, etc.)

### The `Event` type

All event handlers receive an `oEvent` argument of type `Event`. Full method table:

| Method | Signature | Description |
|---|---|---|
| `getId()` | `() → Promise<string>` | Get the event name |
| `getSource()` | `() → Promise<object>` | Get the source control that fired the event |
| `getParameters()` | `() → Promise<any>` | Get all event parameters as an object |
| `getParameter(name)` | `(string) → Promise<string>` | Get a single parameter value by name |
| `preventDefault()` | `() → Promise<void>` | **Prevent the default system action for this event** |

### `oEvent.preventDefault()`

Call this inside a `before` handler to block the system from executing its default action for the event. This is the documented cancellation mechanism for `before` handlers.

**Example** — intercepting a system button to validate before save:

```json
{
  "overlay": {
    "on": [
      {
        "guid": "49H8VADnVmWRK4aFa5TkYy",
        "press": {
          "before": "onAddnViewButtonClick"
        }
      }
    ]
  }
}
```

```javascript
async onAddnViewButtonClick(oEnv, oEvent) {
    const oView = await oEnv.ActiveView();
    const oInput = await oView.Input(GUIDCustomerReferenceNum);
    const sValue = await oInput.getValue();
    if (sValue === "") {
        await oEnv.showMessageBox("Information", "Please provide a Customer Ref. No.",
            { title: "Validation failed" });
        oEvent.preventDefault();  // blocks the system "Add & View" action
    }
}
```

### Pre/post handlers

Each event slot in the layout JSON supports three handler keys:

```json
{
  "press": {
    "before":   "beforeButtonPress",
    "procName": "onButtonPress",
    "after":    "afterButtonPress"
  }
}
```

| Key | When | Purpose |
|---|---|---|
| `before` | Before `procName` | Can modify event parameters or **prevent the event from dispatching** |
| `procName` | Main handler | Core business logic for the event |
| `after` | After `procName` | Additional logic after the main handler completes |

**Constraint on system buttons**: When a system view button already has a system-defined `procName` handler, partners **cannot** register their own `procName` on the same slot. However, partners **can** register `before` and/or `after` handlers alongside the system's handler via the `on` overlay operator. This is the correct pattern for intercepting system actions (e.g. the Save button):

```json
{
  "on": [
    {
      "guid": "49H8VADnVmWRK4aFa5TkYy",
      "ctrlType": "b1.sdk.Button",
      "press": {
        "before": "beforeSave"
      }
    }
  ]
}
```

`before`/`after` cannot be used on lifecycle hooks (`onInit`, `onDataLoad`, `onExit`) — those slots are reserved for the framework.

## Lifecycle hooks

Three predefined hooks called by the framework at fixed view lifecycle points:

| Hook | Signature | When called | Use for |
|---|---|---|---|
| `onInit` | `async function(oEnv, oEvent)` | View instantiated; controls already created | One-time init, binding event handlers, UI setup |
| `onDataLoad` | `async function(oEnv, oEvent)` | Asynchronously after `onInit`, when data loads | `setCustomizedData()`, model setup, populating controls |
| `onExit` | `async function(oEnv, oEvent)` | View destroyed | Resource cleanup, finalizing activities |

These same hooks apply to dialogs — see [[b1sdk-dialog]].

**Ordering**: `onInit` fires first, then `onDataLoad` fires asynchronously after data is available. Never put data-dependent setup in `onInit`.

## Why it matters

- **`setValue` fires the change event** — this is intentional for consistency, but creates a real infinite-loop risk. If your change handler calls `setValue` on the same control or a chain that loops back, add a guard flag.
- **`before` handler is a hook point for event cancellation** — useful for validation before a system action proceeds.
- **`onInit` vs `onDataLoad`**: a common mistake is setting up model-dependent UI in `onInit` before data has arrived. Always use `onDataLoad` for anything that depends on the loaded data.

## Tradeoffs and constraints

- `setValue` auto-fire is by design — it ensures UI and model stay in sync even with programmatic changes. The tradeoff is loop risk.
- The `before` handler cancels via `oEvent.preventDefault()` — this is the only supported mechanism.
- Custom handlers are blocked on system event slots — not all events on system views are open for partner use.

## Infinite-loop pattern to avoid

```javascript
// DANGEROUS: setValue fires 'change' → handler calls setValue again → infinite loop
onChange: async function(oEnv, oEvent) {
    const oView = await oEnv.ActiveView();
    const oInput = await oView.Input("myGuid");
    await oInput.setValue("sanitized"); // fires onChange again!
}

// SAFE: use a guard flag
onChange: async function(oEnv, oEvent) {
    if (this._updating) return;
    this._updating = true;
    const oView = await oEnv.ActiveView();
    const oInput = await oView.Input("myGuid");
    await oInput.setValue("sanitized");
    this._updating = false;
}
```

## Connections

Related concepts: [[control-object-model]], [[sdk-env]], [[data-binding]]
Lifecycle hooks in dialogs: [[b1sdk-dialog]]
Controls with change events: [[b1sdk-input]], [[b1sdk-checkbox]], [[b1sdk-combobox]], [[b1sdk-datepicker]]

## Sources

- [[05-event-flow]] — event trigger, parameter envelope, handler signature, pre/post handlers, lifecycle hooks
- [[06b-types-aggregations]] — Event type full method table, preventDefault() with example
