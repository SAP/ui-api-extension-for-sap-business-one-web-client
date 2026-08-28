---
title: "b1.sdk.ProgressIndicator"
type: control
available_from: "FP 2502"
tags: [controls, display]
source_count: 1
---

## What it is

A horizontal bar that visualises process progress as a percentage fill. The fill level (`percentValue`) and the text shown inside the bar (`displayValue`) are independent — you control both separately. Supports animated transitions, a display-only mode with different rendering, and semantic state colouring.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Field label |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `enabled` | boolean | `true` | No | Whether the control is enabled |
| `state` | string | `None` | No | Semantic fill colour — see [[enum-valuestate]] |
| `percentValue` | float | `0` | No | Percentage fill level (0–100) |
| `displayValue` | string | `''` | No | Text displayed inside the bar (independent of `percentValue`) |
| `showValue` | boolean | `true` | No | Whether `displayValue` is shown inside the bar |
| `displayAnimation` | boolean | `true` | No | Whether percentage changes animate |
| `displayOnly` | boolean | `false` | No | Display-only mode: different rendering, cannot be focused |
| `height` | string | `''` | No | Height of the bar in CSS units |
| `width` | string | `''` | No | Width of the control in CSS units |
| `textDirection` | enum | `Inherit` | No | Text direction — see [[enum-textdirection]] |

## Events

None.

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | †FP 2502 | Sets focus to the control (not available when `displayOnly` is true) |

†Availability not explicitly stated in source; assumed FP2502 (control launch).

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "QgTYCt2AQrOD9Q8U3u3qrA",
  "ctrlType": "b1.sdk.ProgressIndicator",
  "label": "Completion",
  "percentValue": 25,
  "displayValue": "25%",
  "showValue": true,
  "state": "Success",
  "displayAnimation": true,
  "height": "40px",
  "width": "300px"
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oPI = await oView.ProgressIndicator("QgTYCt2AQrOD9Q8U3u3qrA");

// Update progress
await oPI.setPercentValue(88);
await oPI.setDisplayValue("88%");        // must be updated separately
await oPI.setState(b1.sdk.ValueState.Success);
await oPI.setDisplayAnimation(true);
await oPI.setHeight("500px");
await oPI.setWidth("100%");
```

## Gotchas and traps

- **`percentValue` and `displayValue` are independent** — setting `percentValue` to 88 does not automatically update `displayValue`. You must set both explicitly if you want the label to match the fill.
- **`displayOnly: true` prevents focus** — `focus()` has no effect in display-only mode.
- **`hideLabel` is ReadOnly** — set in layout JSON only.
- No events — ProgressIndicator is purely a display indicator.

## Relationships

Related controls: [[b1sdk-objectstatus]], [[b1sdk-objectnumber]]
Types used: [[enum-valuestate]], [[enum-textdirection]]

## Sources

- [[03g-controls-display]] — full property/event/method reference and usage examples
