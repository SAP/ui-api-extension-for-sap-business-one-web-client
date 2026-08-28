---
title: "b1.sdk.Button"
type: control
available_from: "FP 2405"
tags: [controls, input]
source_count: 1
---

## What it is

A clickable action trigger. Supports text, icon, or both. Styling is controlled via `buttonType`. Can be enabled/disabled; a disabled button appears inactive and cannot be pressed.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `enabled` | boolean | `true` | No | Whether the button is interactive |
| `text` | string | `''` | No | Display text |
| `buttonType` | enum | `Default` | No | Visual style — see [[enum-buttontype]] |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `icon` | string | `''` | No | RFC3986 URI (e.g. `sap-icon://accept`) |
| `visible` | boolean | `true` | No | Whether the button is shown |

## Events

| Event | Description |
|---|---|
| `press` | Fired when the user clicks or taps the button |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | FP 2502 | Sets focus to the button |
| `firePress()` | FP 2508 | Programmatically fires the `press` event |

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "CUSTOM_GUID",
  "ctrlType": "b1.sdk.Button",
  "text": "Click Me",
  "icon": "sap-icon://accept",
  "buttonType": "Default",
  "tooltip": "...",
  "press": { "procName": "onButtonClick" }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oButton = await oView.Button("CUSTOM_GUID");
await oButton.setText("New Label");
await oButton.setButtonType(b1.sdk.ButtonType.Accept);
await oButton.setEnabled(false);
await oButton.focus();
console.log(await oButton.getGuid());
```

## Gotchas and traps

- `buttonType` here vs `type` on MenuButton — the property names differ between the two controls for the same enum.
- `focus()` is not available until FP 2502 — calling it on earlier releases will fail.
- `firePress()` is FP 2508 — useful for programmatic testing or chaining actions.

## Relationships

Same button-type enum: [[b1sdk-menubutton]] (uses `type` instead of `buttonType`)
Related controls: [[b1sdk-menubutton]], [[b1sdk-segmentedbutton]]
Types used: [[enum-buttontype]]

## Sources

- [[03b-controls-button]] — full property/event/method reference and usage examples
