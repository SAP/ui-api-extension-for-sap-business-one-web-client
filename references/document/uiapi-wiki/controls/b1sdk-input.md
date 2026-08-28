---
title: "b1.sdk.Input"
type: control
available_from: "FP 2405"
tags: [controls, input]
source_count: 1
---

## What it is

Single-line text or numeric input field. Supports value states, inline suggestions, currency display, and a read-only display mode (`editable: false`). Distinct from `enabled`: a disabled control is fully inactive; a non-editable control is still interactive but its value cannot be changed.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `enabled` | boolean | `true` | No | Whether the control is interactive at all |
| `editable` | boolean | `true` | No | Whether the value can be edited |
| `mandatory` | boolean | `false` | No | Shows a red asterisk before the label |
| `inputType` | enum | `String` | No | Input type — see [[enum-inputtype]] |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `label` | string | `''` | No | Field label |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `textDirection` | enum | `LTR` | No | Text directionality — see [[enum-textdirection]] |
| `textAlign` | enum | `Right`/`Begin`† | No | Text alignment — see [[enum-textalign]] |
| `maxLength` | number | `0` | No | Max chars; `0` = unlimited |
| `value` | string | `''` | No | Current field value |
| `wrapping` | boolean | `false` | No | Break to new line when not editable |
| `valueState` | enum | `None` | No | Validation state — see [[enum-valuestate]] |
| `valueStateText` | string | `''` | No | Text shown alongside the value state |
| `showSuggestion` | boolean | `false` | No | Enable inline suggestions |
| `suggestionItems` | Item[] | `[]` | No | Suggestion popup items — see [[type-item]] |
| `currency` | string | `null` | No | Currency symbol (`$`, `EUR`…); when bound, currency value is validated and cannot be empty |

†`textAlign` default is `Right` when `inputType` is a currency type; `Begin` for all other input types.

## Events

| Event | Parameters | Description |
|---|---|---|
| `change` | `value`, `oldValue` | Fired when the value changes and focus leaves or Enter is pressed |
| `suggest` | `suggestValue` | Fired on user input when `showSuggestion` is `true` |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | FP 2502 | Sets focus to the control |
| `fireChange({value?, oldValue?})` | FP 2508 | Programmatically fires `change` |
| `fireSuggest({suggestValue?})` | FP 2508 | Programmatically fires `suggest` |

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "INPUT_GUID",
  "ctrlType": "b1.sdk.Input",
  "label": "Quantity",
  "inputType": "String",
  "valueState": "None",
  "change": { "procName": "onInputChange" }
}
```

**Controller:**
```javascript
const oInput = await oView.Input("INPUT_GUID");
await oInput.setValue("new value");
await oInput.setValueState(b1.sdk.ValueState.Warning);
await oInput.setValueStateText("Value is too large");

// Reading event parameters in handler:
// onInputChange: async function(oEnv, oEvent) {
//   const value    = oEvent.getParameter("value");
//   const oldValue = oEvent.getParameter("oldValue");
// }
```

## Gotchas and traps

- **`hideLabel` is ReadOnly** — set it only in layout JSON.
- **`editable` ≠ `enabled`**: `enabled: false` disables the control entirely; `editable: false` keeps it interactive but prevents value editing.
- **`textAlign` default** depends on `inputType`: currency types default to `Right`; others to `Begin`.
- **`maxLength: 0`** means no limit, not zero characters.
- **`currency` binding**: when the `currency` property is bound, the currency value is validated and cannot be empty.

## Relationships

Related controls: [[b1sdk-textarea]], [[b1sdk-multiinput]], [[b1sdk-statictext]]
Types used: [[enum-inputtype]], [[enum-textdirection]], [[enum-textalign]], [[enum-valuestate]], [[type-item]]

## Sources

- [[03c-controls-text-input]] — full property/event/method reference and usage examples
