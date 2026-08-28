---
title: "b1.sdk.Item"
category: aggregation-type
available_from: "FP 2405"
tags: [aggregations, controls]
source_count: 1
---

## Shape

| Property | Type | Mandatory | Default | ReadOnly | Description |
|---|---|---|---|---|---|
| `key` | string | **Yes** | N/A | No | Key of the item — used for selection |
| `text` | string | No | `''` | No | Display text |
| `enabled` | boolean | No | `true` | No | Whether the item is selectable |
| `additionalText` | string | No | `''` | No | Secondary text shown alongside the item |

**Events**: none.  
**Methods**: getter and setter for each property.

## Where used

- [[b1sdk-combobox]] — `items[]` aggregation (inline in layout or via aggregation binding)
- [[b1sdk-multicombobox]] — `items[]` aggregation (inline only — aggregation binding NOT supported)
- [[b1sdk-radiobuttongroup]] — `items[]` aggregation (holds RadioButton controls, not Items)
- [[b1sdk-choosefromlist]] — internal item type for selection results

## Usage

```json
{
  "ctrlType": "b1.sdk.ComboBox",
  "items": {
    "path": "@@data>/list",
    "template": {
      "ctrlType": "b1.sdk.Item",
      "key": "{@@data>key}",
      "text": "{@@data>text}"
    }
  }
}
```

## Sources

- [[06b-types-aggregations]] — full property table
