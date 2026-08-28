---
title: "b1.sdk.MenuItem"
category: aggregation-type
available_from: "FP 2502"
tags: [aggregations, controls]
source_count: 1
---

## Shape

| Property | Type | Mandatory | Default | ReadOnly | Description |
|---|---|---|---|---|---|
| `guid` | string | **Yes** | N/A | **Yes** | Global unique identifier |
| `key` | string | No | `''` | No | Key for programmatic identification |
| `text` | string | No | `''` | No | Display text of the menu item |
| `icon` | string | No | `''` | No | RFC3986 URI for an icon (e.g. `sap-icon://edit`) |
| `enabled` | boolean | No | `true` | No | Whether the item is interactive |
| `startsSection` | boolean | No | `false` | No | Renders a visual separator before this item |
| `visible` | boolean | No | `true` | No | Whether the item is shown |
| `textDirection` | b1.sdk.TextDirection | No | `Inherit` | No | Text direction — see [[enum-textdirection]] |

**Events**: `press` — fired after the item is pressed.  
**Methods**: getter/setter for each property; `focus()`; `firePress()` (FP2508).

## Where used

- [[b1sdk-menubutton]] — `items[]` aggregation (inline in layout JSON)

## Usage

```json
{
  "ctrlType": "b1.sdk.MenuItem",
  "guid": "eg32RCctDCiH3wrXzi8uJp",
  "key": "MenuItem1",
  "text": "Edit",
  "icon": "sap-icon://edit",
  "startsSection": false,
  "press": {
    "before": "beforePress",
    "procName": "onPress",
    "after": "afterPress"
  }
}
```

## Notes

`startsSection: true` adds a horizontal separator line above the item — useful for grouping related menu actions.

## Sources

- [[06b-types-aggregations]] — full property table and usage example
