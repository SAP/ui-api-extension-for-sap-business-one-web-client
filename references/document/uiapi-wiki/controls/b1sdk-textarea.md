---
title: "b1.sdk.TextArea"
type: control
available_from: "FP 2502"
tags: [controls, input]
source_count: 1
---

## What it is

Multi-line text input. Supports auto-grow, exceeded-text display, live value updates, and configurable sizing via `rows`/`cols` or explicit CSS `height`/`width`. When sizing properties conflict, CSS dimensions win over character-based dimensions.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Field label |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `editable` | boolean | `true` | No | Whether the value can be edited |
| `mandatory` | boolean | `false` | No | Shows a red asterisk before the label |
| `textDirection` | enum | `LTR` | No | Text directionality — see [[enum-textdirection]] |
| `rows` | int | `4` | No | Visible line count (overridden by `height`) |
| `cols` | int | `1000` | No | Visible width in avg. char widths (overridden by `width`) |
| `maxLength` | int | `0` | No | Max characters; `0` = unlimited |
| `value` | string | `''` | No | Current text value |
| `valueState` | enum | `None` | No | Validation state — see [[enum-valuestate]] |
| `valueStateText` | string | `''` | No | Text shown in the value state popup |
| `growing` | boolean | `false` | No | Auto-grow/shrink with content (**do not use with `height`**) |
| `growingMaxLines` | int | `0` | No | Max lines when growing; `0` = unlimited |
| `height` | string | `''` | No | CSS height (e.g. `"100px"`) — wins over `rows` |
| `showExceededText` | boolean | `false` | No | Show characters beyond `maxLength` as visible overflow |
| `valueLiveUpdate` | boolean | `false` | No | Update `value` property on every keystroke (not just on change) |
| `wrapping` | enum | `None` | No | Text wrap mode — see [[enum-wrapping]] (e.g. `"Soft"`, `"Off"`) |
| `width` | string | `''` | No | CSS width (e.g. `"300px"`) — wins over `cols` |

## Events

| Event | Parameters | Description |
|---|---|---|
| `change` | `value`, `oldValue` | Fired when the value changes |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | FP 2502 | Sets focus to the control |
| `fireChange({value?, oldValue?})` | FP 2508 | Programmatically fires `change` |

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "TEXTAREA_GUID",
  "ctrlType": "b1.sdk.TextArea",
  "label": "Notes",
  "rows": 6,
  "maxLength": 500,
  "growing": true,
  "growingMaxLines": 10,
  "change": { "before": "beforeChange", "procName": "onChange", "after": "afterChange" }
}
```

**Controller:**
```javascript
const oTA = await oView.TextArea("TEXTAREA_GUID");
await oTA.setValue("updated text");
await oTA.setRows(10);
await oTA.setValueState(b1.sdk.ValueState.Warning);
await oTA.setWrapping(b1.sdk.Wrapping.Off);
await oTA.focus();
```

## Gotchas and traps

- **`hideLabel` is ReadOnly** — set in layout JSON only.
- **`wrapping` is an enum** (`b1.sdk.Wrapping`), not a boolean — unlike [[b1sdk-input]] and [[b1sdk-statictext]] which use boolean `wrapping`.
- **`growing` + `height`**: do not use both. `growing` auto-sizes the control; setting `height` contradicts that.
- **CSS wins over character units**: `width` overrides `cols`; `height` overrides `rows`.
- **`valueLiveUpdate`**: when `true`, the `value` property is updated on every keystroke, not just on focus-out/Enter. Useful for live character count but can cause frequent re-renders.

## Relationships

Related controls: [[b1sdk-input]], [[b1sdk-multiinput]], [[b1sdk-statictext]]
Types used: [[enum-textdirection]], [[enum-valuestate]], [[enum-wrapping]]

## Sources

- [[03c-controls-text-input]] — full property/event/method reference and usage examples
