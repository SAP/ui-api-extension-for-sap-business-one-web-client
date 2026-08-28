---
title: "b1.sdk.SegmentedButton"
type: control
available_from: "FP 2502"
tags: [controls, input]
source_count: 1
---

## What it is

A horizontal row of mutually exclusive buttons (segments). The selected segment is identified by `selectedKey`. Useful for switching between views or filter states inline in a form.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Field label / title |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `mandatory` | boolean | `false` | No | Shows a red asterisk before the label when `true` |
| `selectedKey` | string | `''` | No | Key of the currently selected segment |
| `enabled` | boolean | `true` | No | Whether the control is interactive |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `width` | string | `''` | No | CSS width (e.g. `"30rem"`) |
| `items` | SegmentedButtonItem[] | `[]` | No | Segments — see [[type-segmentedbuttonitem]] |

## Events

| Event | Parameters | Description |
|---|---|---|
| `selectionChange` | `item`, `selectionChange.value`, `selectionChange.oldValue` | Fired when the user selects a segment |

## Methods

| Method | Available | Description |
|---|---|---|
| `getSelectedText()` | FP 2502 | Returns the text of the currently selected segment |
| `focus()` | FP 2502 | Sets focus to the control |
| `fireSelectionChange(mParameters)` | FP 2508 | Programmatically fires `selectionChange` |

### fireSelectionChange parameter shape

```typescript
fireSelectionChange(mParameters: {
  item?: object,
  selectionChange?: {
    oldValue?: string,
    value?: string
  }
}): Promise<void>
```

Note the unusual nesting: `value` and `oldValue` live inside a nested `selectionChange` key within `mParameters`.

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "SEG_BTN_GUID",
  "ctrlType": "b1.sdk.SegmentedButton",
  "label": "View Mode",
  "selectedKey": "Key2",
  "width": "30rem",
  "items": [
    { "guid": "ITEM1_GUID", "ctrlType": "b1.sdk.SegmentedButtonItem", "key": "Key1", "text": "List" },
    { "guid": "ITEM2_GUID", "ctrlType": "b1.sdk.SegmentedButtonItem", "key": "Key2", "text": "Card",
      "press": { "procName": "onCardPress" } }
  ],
  "selectionChange": {
    "before": "beforeChange",
    "procName": "onSelectionChange",
    "after": "afterChange"
  }
}
```

**Controller:**
```javascript
const oSeg = await oView.SegmentedButton("SEG_BTN_GUID");
await oSeg.setSelectedKey("Key3");
console.log(await oSeg.getSelectedText());

// Mutate a child item directly
const items = await oSeg.getItems();
await items[1].setText("New Label");
await items[1].setTextDirection(b1.sdk.TextDirection.RTL);
```

## Gotchas and traps

- **`hideLabel` is ReadOnly** — calling `setHideLabel()` has no effect. Configure it only in the layout JSON.
- `fireSelectionChange` nests `value`/`oldValue` under a `selectionChange` key inside `mParameters` — this differs from most other `fire*` methods that put parameters at the top level.
- Individual `SegmentedButtonItem` instances from `getItems()` can have their properties mutated directly (text, icon, key, enabled, visible, width, textDirection).

## Relationships

Related controls: [[b1sdk-button]], [[b1sdk-menubutton]]
Aggregation type: [[type-segmentedbuttonitem]]
Types used: [[enum-textdirection]]

## Sources

- [[03b-controls-button]] — full property/event/method reference and usage examples
