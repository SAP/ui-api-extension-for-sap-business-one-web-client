---
title: "b1.sdk.MenuButton"
type: control
available_from: "FP 2502"
tags: [controls, input]
source_count: 1
---

## What it is

A button that opens a hierarchical dropdown menu. Supports two modes via `buttonMode`: **Regular** (the entire button opens the menu) and **Split** (left part fires `defaultAction`, right part opens the menu).

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `text` | string | `''` | No | Button label text |
| `icon` | string | `''` | No | RFC3986 URI (e.g. `sap-icon://customize`) |
| `enabled` | boolean | `true` | No | Whether the button is interactive |
| `visible` | boolean | `true` | No | Whether the button is shown |
| `type` | enum | `Transparent` | No | Visual style — see [[enum-buttontype]] (note: `type`, not `buttonType`) |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `buttonMode` | enum | `Regular` | No | `Regular` or `Split` — see [[enum-menubuttonmode]] |
| `useDefaultActionOnly` | boolean | `false` | No | In Split mode: if `true`, `defaultAction` always fires; if `false`, it only fires until a menu item has been selected. |
| `menuPosition` | enum | `BeginBottom` | No | Popup position — see [[enum-popupdock]] |
| `width` | string | `''` | No | CSS width (e.g. `"500px"`) |
| `textDirection` | enum | `Inherit` | No | Text directionality — see [[enum-textdirection]] |
| `items` | MenuItem[] | `[]` | No | Menu items — see [[type-menuitem]] |

## Events

| Event | Description |
|---|---|
| `itemSelected` | Fired when a menu item is selected |
| `loadItems` | Fired when the menu opens and item data is not yet loaded (lazy load pattern) |
| `defaultAction` | Fired in Split mode when the user presses the main (left) button |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | FP 2502 | Sets focus to the control |
| `fireItemSelected({item?})` | FP 2508 | Programmatically fires `itemSelected` |
| `fireLoadItems()` | FP 2508 | Programmatically fires `loadItems` |
| `fireDefaultAction()` | FP 2508 | Programmatically fires `defaultAction` |

## Usage pattern

**Layout JSON (items declared inline):**
```json
{
  "guid": "MENUBUTTON_GUID",
  "ctrlType": "b1.sdk.MenuButton",
  "text": "File",
  "type": "Accept",
  "buttonMode": "Regular",
  "menuPosition": "EndTop",
  "items": [
    {
      "guid": "MENUITEM_GUID",
      "ctrlType": "b1.sdk.MenuItem",
      "key": "edit",
      "text": "Edit",
      "icon": "sap-icon://edit",
      "press": { "procName": "onEdit" }
    }
  ],
  "itemSelected": {
    "before": "beforeItemSelected",
    "procName": "onItemSelected",
    "after": "afterItemSelected"
  }
}
```

**Controller:**
```javascript
const oMenuButton = await oView.MenuButton("MENUBUTTON_GUID");
await oMenuButton.setType(b1.sdk.ButtonType.Accept);
await oMenuButton.setButtonMode(b1.sdk.MenuButtonMode.Split);
await oMenuButton.setMenuPosition(b1.sdk.PopupDock.RightBottom);
await oMenuButton.setTextDirection(b1.sdk.TextDirection.RTL);
const items = await oMenuButton.getItems();
console.log(await items[0].getKey());
```

## Gotchas and traps

- The visual style property is **`type`**, not `buttonType` — this differs from [[b1sdk-button]] which uses `buttonType`. Both reference the same [[enum-buttontype]] enum.
- `useDefaultActionOnly` only has an effect when `buttonMode` is `Split` — ignored in `Regular` mode.
- Items are declared inline in the layout JSON as a nested array; they are not separate overlay entries with `before`/`after`.

## Relationships

Related controls: [[b1sdk-button]], [[b1sdk-segmentedbutton]]
Aggregation type: [[type-menuitem]]
Types used: [[enum-buttontype]], [[enum-menubuttonmode]], [[enum-popupdock]], [[enum-textdirection]]

## Sources

- [[03b-controls-button]] — full property/event/method reference and usage examples
