---
title: "b1.sdk.StaticText"
type: control
available_from: "FP 2405"
tags: [controls, display]
source_count: 1
---

## What it is

Display-only text control for embedding longer text paragraphs. Supports wrapping, whitespace preservation, and line clamping. HTML and script tags in the `text` value are automatically escaped — no rich text rendering.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Label displayed before the text |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `text` | string | `''` | No | The text content to display (HTML is escaped) |
| `maxLines` | number | N/A | No | Clamp to N lines; overflow shown as ellipsis (browser-dependent) |
| `renderWhitespace` | boolean | `true` | No | Preserve whitespace and tabs in the rendered output |
| `wrapping` | boolean | `true` | No | Enable text wrapping (boolean — not an enum) |
| `wrappingType` | enum | `Normal` | No | Wrap algorithm — see [[enum-wrappingtype]] (only applies when `wrapping` is `true`) |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `tooltip` | string | `''` | No | Hover tooltip text |

## Events

None.

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | FP 2502 | Sets focus to the control |

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "STATIC_GUID",
  "ctrlType": "b1.sdk.StaticText",
  "text": "This is a read-only paragraph.",
  "wrapping": true,
  "visible": true,
  "tooltip": "Informational text"
}
```

**Controller:**
```javascript
const oText = await oView.StaticText("STATIC_GUID");
await oText.setText("Updated content");
await oText.setWrapping(true);
await oText.setVisible(true);
console.log(await oText.getText());
await oText.focus();
```

## Gotchas and traps

- **`hideLabel` is ReadOnly** — set in layout JSON only.
- **HTML is escaped**: setting `text` to `"<b>bold</b>"` renders the literal string, not bold text. This is intentional for security.
- **`wrapping` is a boolean** — unlike [[b1sdk-textarea]] where `wrapping` is an enum (`b1.sdk.Wrapping`). Same property name, different type.
- **`wrappingType`** only has an effect when `wrapping: true`.
- **`maxLines` overflow**: uses CSS line-clamping; browsers that don't support it will simply hide overflow rather than showing an ellipsis.
- No `change` event — this is display-only. To make text editable, use [[b1sdk-input]] or [[b1sdk-textarea]].

## Relationships

Related controls: [[b1sdk-input]], [[b1sdk-textarea]]
Types used: [[enum-wrappingtype]]

## Sources

- [[03c-controls-text-input]] — full property/event/method reference and usage examples
