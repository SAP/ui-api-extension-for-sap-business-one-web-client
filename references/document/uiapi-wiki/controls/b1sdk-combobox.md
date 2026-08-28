---
title: "b1.sdk.ComboBox"
type: control
available_from: "FP 2405"
tags: [controls, picker]
source_count: 1
---

## What it is

A single-select dropdown with a text input for filtering. Users can type to narrow the list or pick directly. Items carry a `key` and `text`; an optional `additionalText` field supports secondary filtering and display. The `selectedKey` property is the primary selection handle.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Field label |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `editable` | boolean | `true` | No | Whether the control is editable |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `mandatory` | boolean | `false` | No | Shows a red asterisk before the label |
| `selectedKey` | string | `''` | No | Key of the currently selected item |
| `filterSecondaryValues` | boolean | `false` | No | Whether the type-to-filter also searches `additionalText` |
| `showSecondaryValues` | boolean | `false` | No | Whether `additionalText` is displayed in the dropdown |
| `items` | Item[] | `[]` | No | Dropdown items — see [[type-item]] |
| `valueState` | enum | `None` | No | Validation state — see [[enum-valuestate]] |
| `valueStateText` | string | `''` | No | Additional text displayed for `valueState` |

## Events

| Event | Parameters | Description |
|---|---|---|
| `change` | `value`, `oldValue` | Fired when an item is selected |
| `loadItems` | — | Fired when the dropdown opens, for lazy-loading items |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | FP 2502 | Sets focus to the control |
| `getSelectedText()` | FP 2405 | Returns the display text of the selected item |
| `getItems()` | FP 2405 | Returns the current items array |
| `fireChange({ value?, oldValue? })` | FP 2508 | Programmatically fires `change` |
| `fireLoadItems()` | FP 2508 | Programmatically fires `loadItems` |

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "1PFitf7cF8uH6Sq5iPfXLk",
  "ctrlType": "b1.sdk.ComboBox",
  "label": "Currency",
  "selectedKey": "Y",
  "showSecondaryValues": true,
  "items": [
    { "key": "Y", "text": "Yes", "additionalText": "Affirmative", "enabled": true },
    { "key": "N", "text": "No",  "additionalText": "Negative",    "enabled": true }
  ],
  "change": { "procName": "onCurrencyChange" }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oComboBox = await oView.ComboBox("1PFitf7cF8uH6Sq5iPfXLk");

console.log("selected text:", await oComboBox.getSelectedText());
await oComboBox.setSelectedKey("N");
await oComboBox.setMandatory(true);
await oComboBox.setValueState(b1.sdk.ValueState.Information);
await oComboBox.focus();
```

**Event handler:**
```javascript
onChange: async function (oEnv, oEvent) {
    const value = oEvent.getParameter("value");
    const oldValue = oEvent.getParameter("oldValue");
    await oEvent.getSource().setSelectedKey(value);
}
```

## Gotchas and traps

- **`hideLabel` is ReadOnly** — set in layout JSON only.
- **`change` event fires with `value`/`oldValue`** (the key strings), not the item object. Use `getSelectedText()` separately to get the display text.
- **`loadItems` event** is the pattern for dynamic item loading — fire when the dropdown opens, then populate `items` programmatically.
- Source has a `b1.sdk.VaueState` typo for `valueState` type — treat as `b1.sdk.ValueState`.
- `filterSecondaryValues` and `showSecondaryValues` are independent flags — you can filter by `additionalText` without displaying it.

## Relationships

Related controls: [[b1sdk-multicombobox]], [[b1sdk-choosefromlist]], [[b1sdk-multiinput]]
Types used: [[type-item]], [[enum-valuestate]]

## Sources

- [[03e-controls-picker]] — full property/event/method reference and usage examples
