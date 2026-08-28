---
title: "b1.sdk.HBox"
type: control
available_from: "FP 2502"
tags: [controls, layout]
source_count: 1
---

## What it is

A horizontal flex container that holds a heterogeneous mix of controls side by side. Wraps the CSS flexbox model via three layout properties (`direction`, `justifyContent`, `alignItems`). The only container in the SDK that holds arbitrary control types in its `items[]`. Child controls are view-registered by GUID and can be accessed either through `getItems()` or directly via `oView.ControlType("guid")`.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Label displayed before the container |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `visible` | boolean | `true` | No | Whether the container is shown |
| `mandatory` | boolean | `false` | No | Shows a red asterisk before the label |
| `width` | string | `''` | No | Width in CSS units — see percentage caveat |
| `direction` | enum | `Row` | No | Main axis direction — see [[enum-flexdirection]] |
| `justifyContent` | enum | `Start` | No | Main axis alignment — see [[enum-flexjustifycontent]] |
| `alignItems` | enum | `Stretch` | No | Cross-axis alignment — see [[enum-flexalignitems]] |
| `items` | Control[] | `[]` | No | Child controls, any mix of control types — **HBox nesting not allowed** |

**Width percentage caveat**: when `width` is a percentage (e.g. `"80%"`), the surrounding container must have a defined width for the percentage to take effect.

## Events

None.

## Methods

Getter/setter for each property only. No `focus()`.

## Aggregations

| Name | Type | Notes |
|---|---|---|
| `items` | Control[] | Any mix of b1.sdk control types; declared inline in layout JSON — **HBox cannot be nested inside another HBox** |

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "evnqdpjrSWuDxXJOKNZj4A",
  "ctrlType": "b1.sdk.HBox",
  "label": "Amount",
  "width": "300px",
  "direction": "Row",
  "justifyContent": "End",
  "alignItems": "Start",
  "items": [
    {
      "guid": "H7ce3jFARd2ieEiDbplNyA",
      "ctrlType": "b1.sdk.Input",
      "inputType": "Currency",
      "editable": true
    },
    {
      "guid": "31QtGHfqScq3JHfZnuNKew",
      "ctrlType": "b1.sdk.Button",
      "text": "Confirm",
      "buttonType": "Emphasized"
    }
  ]
}
```

**Controller — two access patterns for child controls:**
```javascript
const oView = await oEnv.ActiveView();
const oHBox = await oView.HBox("evnqdpjrSWuDxXJOKNZj4A");

// Pattern 1: access via getItems() index
const items = await oHBox.getItems();
await items[0].setValue("1234.56");

// Pattern 2: access child directly by GUID (preferred for readability)
const oButton = await oView.Button("31QtGHfqScq3JHfZnuNKew");
await oButton.setText("Confirmed");

// Change layout properties
await oHBox.setJustifyContent(b1.sdk.FlexJustifyContent.Center);
await oHBox.setAlignItems(b1.sdk.FlexAlignItems.Baseline);
await oHBox.setDirection(b1.sdk.FlexDirection.Column);
await oHBox.setWidth("100%");
```

## Gotchas and traps

- **No nested HBox** — HBox cannot be placed inside another HBox's `items[]`.
- **`hideLabel` is ReadOnly** — set in layout JSON only.
- **`width` percentage requires defined parent width** — if the surrounding container has no explicit width, percentage widths will not render as expected.
- **Child GUIDs are view-registered** — you don't have to go through `getItems()`. Direct `oView.ControlType("guid")` access works for all children.
- No events on HBox itself — attach events to individual child controls.
- No `focus()` on HBox — focus the individual child controls instead.

## Relationships

Contains: any b1.sdk control
Related controls: [[b1sdk-section]]
Types used: [[enum-flexdirection]], [[enum-flexjustifycontent]], [[enum-flexalignitems]]

## Sources

- [[03h-controls-layout]] — full property/aggregation/usage reference
