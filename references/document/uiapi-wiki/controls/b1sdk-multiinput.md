---
title: "b1.sdk.MultiInput"
type: control
available_from: "FP 2602"
tags: [controls, input]
source_count: 1
---

## What it is

A text input that accumulates multiple values as visible **tokens**. Users can type to get suggestions, select from them, or type free text that is converted to a token (when `enableTextToken` is true). Tokens can also be removed interactively. The value help button (🔍) fires `valueHelpRequest` for custom lookup dialogs.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Field label |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `enabled` | boolean | `true` | No | Whether the control is interactive |
| `editable` | boolean | `true` | No | Whether tokens can be added/removed |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `mandatory` | boolean | `false` | No | Shows a red asterisk before the label |
| `maxTokens` | int | `10` | No | Maximum number of tokens allowed |
| `showValueHelp` | boolean | `true` | No | Show the value help (🔍) indicator button |
| `showSuggestion` | boolean | `true` | No | Fire `suggest` event on user input |
| `enableTextToken` | boolean | `false` | No | Convert free-typed text into a token |
| `suggestionItems` | Item[] | `[]` | No | Suggestion popup items — see [[type-item]] |
| `tokens` | Token[] | `[]` | No | Currently displayed tokens — see [[type-token]] |

## Events

| Event | Parameters | Description |
|---|---|---|
| `change` | `value`, `oldValue` | Fired when input text changes and focus leaves or Enter is pressed |
| `valueHelpRequest` | `fromSuggestions` | Fired when the value help button is clicked |
| `tokenUpdate` | `type`, `addedTokens[]`, `removedTokens[]` | Fired when tokens are added or removed by the user |
| `suggest` | `suggestValue` | Fired on user input when `showSuggestion` is true |

## Methods

| Method | Signature | Description |
|---|---|---|
| `focus()` | `() → void` | Sets focus to the control |
| `fireChange({value?, oldValue?})` | — | Programmatically fires `change` |
| `fireSuggest({suggestValue?})` | — | Programmatically fires `suggest` |
| `fireValueHelpRequest({fromSuggestions?})` | — | Programmatically fires `valueHelpRequest` |
| `fireTokenUpdate({type?, addedTokens?, removedTokens?})` | — | Programmatically fires `tokenUpdate` |

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "MULTI_INPUT_GUID",
  "ctrlType": "b1.sdk.MultiInput",
  "label": "Tags",
  "maxTokens": 5,
  "showSuggestion": true,
  "tokens": [{ "key": "A", "text": "Alpha" }],
  "suggestionItems": [{ "key": "A", "text": "Alpha" }, { "key": "B", "text": "Beta" }],
  "tokenUpdate": { "procName": "onTokenUpdate" }
}
```

**Controller:**
```javascript
const oMI = await oView.MultiInput("MULTI_INPUT_GUID");

// Read current tokens
const tokens = await oMI.getTokens();
for (const tok of tokens) {
  console.log(await tok.getKey(), await tok.getText());
}

// Programmatically signal a token was added (does NOT update the model automatically)
await oMI.fireTokenUpdate({
  type: "added",
  addedTokens: [{ guid: "NEW_TOKEN_GUID", key: "C", text: "Gamma" }],
  removedTokens: []
});
```

## Gotchas and traps

- **Tokens are not auto-synced to the model** — even with TwoWay data binding, adding or removing tokens does not automatically update the bound model. The `tokenUpdate` handler must update the model explicitly in application logic.
- **`hideLabel` is ReadOnly** — set in layout JSON only.
- `tokenUpdate` event `type` is a string: `"added"` or `"removed"`.
- `enableTextToken: true` converts any typed text into a token on confirmation, bypassing suggestion selection.

## Relationships

Related controls: [[b1sdk-input]], [[b1sdk-textarea]], [[b1sdk-combobox]], [[b1sdk-multicombobox]]
Types used: [[type-item]], [[type-token]]
Binding caveat: [[data-binding]] (TwoWay binding does not cover token aggregation)

## Sources

- [[03c-controls-text-input]] — full property/event/method reference and usage examples
