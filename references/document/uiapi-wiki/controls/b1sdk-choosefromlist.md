---
title: "b1.sdk.ChooseFromList"
type: control
available_from: "FP 2508"
tags: [controls, picker]
source_count: 1
---

## What it is

A picker control that opens a SAP B1 table lookup dialog. The user selects one (or multiple, if `multiSelection` is true) rows from the linked table. The `linkTo` property — mandatory and set at layout time only — specifies which B1 table to browse. An optional OData `filter` narrows the rows shown.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Field label |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `value` | string | `''` | No | The current selected value (key) |
| `editable` | boolean | `true` | No | Whether the control is editable |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `mandatory` | boolean | `false` | No | Whether a value is required |
| `multiSelection` | boolean | `false` | No | Whether multiple rows can be selected |
| `showLinkButton` | boolean | `false` | No | Whether to show the navigate-to-record link button |
| `linkTo` | string | N/A | **Yes** | The B1 table name to link to — **mandatory; set in layout JSON only** |
| `filter` | string | `''` | **Yes** | OData filter expression to narrow the table data — **set in layout JSON only** |
| `valueState` | enum | `None` | No | Validation state — see [[enum-valuestate]] |
| `valueStateText` | string | `''` | No | Additional text for `valueState` |

Note: the source documents `filter` default as `false` — this is a documentation error; treat the default as `''` (empty string = no filter).

## Events

| Event | Parameters | Description |
|---|---|---|
| `change` | `value`, `oldValue` | Fired when the selected value changes |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | †FP 2508 | Sets focus to the control |
| `getSelectedText()` | FP 2508 | Returns the description/display text of the selected value |
| `fireChange({ value?, oldValue? })` | FP 2508 | Programmatically fires `change` |

†Availability not explicitly stated in source; assumed FP2508 (control launch).

## Allowed `linkTo` values

`linkTo` must be one of the allowed table names. The list is versioned:

**FP 2508 base list (selection):** OACT, OADF, OBPL, OCRB, OCRD, OCRY, OCTG, OITB, OITM, OJDT, OPCH, OPOR, OPRJ, OQUT, ORDR, OWHS, OUSR — plus many others. Full list in the source.

**FP 2608 additions:** `DSC1`, `ITM2`

**UDT/UDO tables:** Any table name starting with `@` — e.g. `@NO_OBJECT`, `@OOTM`.

## Filter syntax

The `filter` property follows a limited OData filter syntax. Supported operators: `and`, `or`, `le`, `lt`, `ge`, `gt`, `eq`, `ne`. Parentheses supported.

Examples:
- `CardCode eq 'C40000' and Active eq 'Y'`
- `(CardCode lt 'C40000') or (Active ne 'Y')`

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "cPlWS734T9yalw1WBwIJhg",
  "ctrlType": "b1.sdk.ChooseFromList",
  "label": "Business Partner",
  "linkTo": "OCRD",
  "filter": "CardType eq 'C'",
  "editable": true,
  "multiSelection": false,
  "showLinkButton": false,
  "visible": true,
  "valueState": "None",
  "change": { "procName": "onBPChange" }
}
```

**Layout JSON (UDT table):**
```json
{
  "guid": "zY7JQi1tTUGYulPG0fJKAb",
  "ctrlType": "b1.sdk.ChooseFromList",
  "label": "Custom Table",
  "linkTo": "@NO_OBJECT",
  "filter": "Name gt '101'",
  "editable": true
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oCFL = await oView.ChooseFromList("cPlWS734T9yalw1WBwIJhg");

const value = await oCFL.getValue();
const selectedText = await oCFL.getSelectedText();
const filter = await oCFL.getFilter();   // ReadOnly — reflects layout value
const linkTo = await oCFL.getLinkTo();   // ReadOnly — reflects layout value

console.log(`Value: ${value}, Text: ${selectedText}, linkTo: ${linkTo}`);

await oCFL.setLabel("Updated Label");
await oCFL.setMultiSelection(true);
await oCFL.setShowLinkButton(true);
await oCFL.setValueState(b1.sdk.ValueState.Success);
```

## Gotchas and traps

- **`linkTo` is mandatory and ReadOnly** — must be set in layout JSON. Cannot be changed at runtime. If `linkTo` is not in the allowed list, the control will not work.
- **`filter` is ReadOnly** — can only be set in layout JSON. No runtime filter changes.
- **Not all tables support `showLinkButton`** — for unsupported tables, Web Client displays a warning message. This mirrors native Web Client behavior.
- **`multiSelection` in the change event**: the source only shows `value`/`oldValue` in the `change` event — it's not documented whether multi-selection changes the event shape.
- **Allowed table list is versioned** — check the list for your target FP. Using a table not in the list will fail.
- Source documentation error: `filter` default is listed as `false` — treat as `''`.

## Relationships

Related controls: [[b1sdk-combobox]], [[b1sdk-input]]
Types used: [[enum-valuestate]]

## Sources

- [[03e-controls-picker]] — full property/event/method reference and usage examples
