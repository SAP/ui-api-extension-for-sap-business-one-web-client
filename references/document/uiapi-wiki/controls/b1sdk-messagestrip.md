---
title: "b1.sdk.MessageStrip"
type: control
available_from: "FP 2502"
tags: [controls, display]
source_count: 1
---

## What it is

An inline message banner for embedding application messages in a view. Shows a text with a semantic icon determined by `type`. Optionally shows a close button (the user can dismiss it). Unlike almost every other control, **`visible` defaults to `false`** — you must explicitly set it to show the strip.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `text` | string | `''` | No | The message text |
| `type` | enum | `Information` | No | Message type — determines icon and colour; see [[enum-messagetype]] |
| `visible` | boolean | **`false`** | No | Whether the strip is shown — **defaults to false** |
| `showCloseButton` | boolean | `false` | No | Whether a close (×) button appears in the top-right corner |
| `showIcon` | boolean | `false` | No | Whether the semantic type icon is shown |
| `customIcon` | string | `''` | No | Override icon URI (e.g. `sap-icon://edit`) — replaces the default type icon |

## Events

| Event | Parameters | Description |
|---|---|---|
| `close` | — | Fired when the user clicks the close button |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | †FP 2502 | Sets focus to the control |
| `close()` | FP 2502 | Programmatically closes (hides) the MessageStrip |
| `fireClose()` | FP 2508 | Programmatically fires the `close` event |

†Availability not explicitly stated in source; assumed FP2502 (control launch).

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "zFWw9mM8Q3OKukacE5jtjw",
  "ctrlType": "b1.sdk.MessageStrip",
  "text": "Please review before submitting.",
  "type": "Warning",
  "showIcon": true,
  "showCloseButton": true,
  "visible": true,
  "close": { "procName": "onStripClose" }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oMS = await oView.MessageStrip("zFWw9mM8Q3OKukacE5jtjw");

// Show a message
await oMS.setText("Validation failed. Please check required fields.");
await oMS.setType(b1.sdk.MessageType.Error);
await oMS.setVisible(true);

// Dismiss programmatically
await oMS.close();
```

## Gotchas and traps

- **`visible` defaults to `false`** — this is the only control in the SDK where `visible` is false by default. If you add a MessageStrip and nothing appears, check `visible`.
- **`close()` vs `fireClose()`**: `close()` actually closes/hides the strip; `fireClose()` only fires the event (does not close the strip by itself).
- **`showCloseButton: false` (default)** — the strip cannot be dismissed by the user unless you set this to `true`.
- No `label`/`hideLabel` properties — MessageStrip has no field label.

## Relationships

Related controls: [[b1sdk-objectstatus]]
Types used: [[enum-messagetype]]

## Sources

- [[03g-controls-display]] — full property/event/method reference and usage examples
