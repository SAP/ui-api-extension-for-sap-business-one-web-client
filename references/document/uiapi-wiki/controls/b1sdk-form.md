---
title: "b1.sdk.Form"
type: control
available_from: "FP 2502"
tags: [controls, container]
source_count: 1
---

## What it is

A structured label-field layout that arranges controls into columns using a responsive grid. **Form is not a standalone control** — it can only be used inside a Simple Dialog's `content[]` array. It cannot be placed in a regular view layout file or a Complex Dialog.

The internal hierarchy is: `Form → FormContainer[] → items[]`.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `title` | string | `''` | No | Form title |
| `visible` | boolean | `true` | No | Whether the form is shown |
| `leftLabel` | boolean | `true` | **Yes** | Whether labels are left-aligned — set in dialog JSON only |
| `gridLayoutData` | object | `null` | **Yes** | Responsive grid layout configuration — set in dialog JSON only |
| `formContainers` | FormContainer[] | `[]` | No | Sections of the form — see [[type-formcontainer]] |

## `gridLayoutData` properties

Maps to UI5 `ResponsiveGridLayout`. Key settings:

| Name | Type | Default | Description |
|---|---|---|---|
| `columnsM` | int | `1` | Columns at medium screen size |
| `columnsL` | int | `2` | Columns at large screen size |
| `columnsXL` | int | `-1` | Columns at XL size (-1 = use columnsL) |
| `labelSpanM` | int | `2` | Label grid span at medium size |
| `labelSpanL` | int | `4` | Label grid span at large size |
| `labelSpanXL` | int | `-1` | Label grid span at XL (-1 = use labelSpanL) |
| `emptySpanL` | int | `0` | Empty cells at end of each row at large size |
| `emptySpanXL` | int | `-1` | Empty cells at XL (-1 = use emptySpanL) |
| `breakpointL` | int | `1024` | px breakpoint between M and L |
| `breakpointM` | int | `600` | px breakpoint between S and M |
| `breakpointXL` | int | `1440` | px breakpoint between L and XL |
| `adjustLabelSpan` | boolean | `true` | Adjusts label span based on number of containers per row |
| `singleContainerFullSize` | boolean | `true` | Single FormContainer fills the full form width |

## FormContainer (inline aggregation)

Declared nested inside `formContainers[]` in dialog JSON.

| Property | Type | Notes |
|---|---|---|
| `guid` | string | Required; view-registered |
| `ctrlType` | string | `"b1.sdk.FormContainer"` |
| `title` | string | Container section title |
| `visible` | boolean | Default `true` |
| `items` | Control[] | Leaf controls in this container |

## Events

None.

## Methods

Getter/setter for each property only.

## Restrictions

The following controls/types are **NOT allowed** inside a Form's `FormContainer.items[]`:
- `Section` / `SubSection` / `Group`
- `Grid`

## Usage pattern

**In dialog JSON (inside `content[]`):**
```json
{
  "guid": "CFksI9gERAmLClCBSx6EZA",
  "ctrlType": "b1.sdk.Form",
  "visible": true,
  "leftLabel": false,
  "gridLayoutData": {
    "columnsM": 1,
    "columnsL": 4,
    "columnsXL": 6,
    "labelSpanXL": 3,
    "labelSpanM": 3,
    "emptySpanL": 2,
    "emptySpanXL": 6
  },
  "formContainers": [
    {
      "ctrlType": "b1.sdk.FormContainer",
      "guid": "TPXf6QRSSOQ2SYEiJNMbGw",
      "title": "General",
      "visible": true,
      "items": [
        {
          "guid": "NvryTZC0TQi17fBsRWGN1A",
          "ctrlType": "b1.sdk.DatePicker",
          "label": "Date",
          "editable": true
        }
      ]
    }
  ]
}
```

## Gotchas and traps

- **Form is not standalone** — it cannot be placed in a regular view layout. It is only valid inside a Simple Dialog's `content[]`.
- **`leftLabel` and `gridLayoutData` are ReadOnly** — configure them in the dialog JSON; they cannot be changed at runtime.
- **Forbidden controls**: Section, SubSection, Group, and Grid are not allowed inside FormContainer items.
- For Form layout details, see the UI5 [ResponsiveGridLayout](https://ui5.sap.com/#/api/sap.ui.layout.form.ResponsiveGridLayout) documentation.

## Relationships

Used inside: [[b1sdk-dialog]] (Simple dialog `content[]` only)
Contains: [[type-formcontainer]]
Forbidden with: [[b1sdk-section]], [[b1sdk-grid]]

## Sources

- [[03i-controls-container]] — full property/usage reference
