---
title: "b1.sdk.FormContainer"
category: aggregation-type
available_from: "FP 2502"
tags: [aggregations, controls, dialog]
source_count: 2
---

## Shape

| Property | Type | Mandatory | Default | ReadOnly | Description |
|---|---|---|---|---|---|
| `guid` | string | **Yes** | N/A | **Yes** | Global unique identifier |
| `title` | string | No | `''` | No | Title of the form group |
| `visible` | boolean | No | `true` | No | Whether the container is shown |
| `items` | array | No | `[]` | No | Controls inside this container — see allowed types below |

**Events**: none.  
**Methods**: getter and setter for each property only — no additional methods.

## Allowed types in `items[]`

Button, CheckBox, Input, ComboBox, StaticText, MessageStrip, HBox, DatePicker, TimePicker, ObjectStatus, MenuButton, Image, TextArea, RadioButton, RadioButtonGroup, ObjectNumber, ProgressIndicator, SegmentedButton, FileUploader, ChooseFromList, MultiComboBox, MultiInput

**Not allowed**: Grid, Dialog, Section, FormContainer (no nesting), and the aggregation-only types (MenuItem, SegmentedButtonItem, LightBoxItem, Token).

## Where used

- [[b1sdk-form]] — `formContainers[]` aggregation

## Notes

FormContainer is the grouping unit inside a Form. It renders as a labeled section within the responsive grid layout.

FormContainer has no methods beyond property accessors — it is a pure layout container.

## Sources

- [[03i-controls-container]] — FormContainer first introduced as a forward ref when Form/Dialog were documented
- [[06b-types-aggregations]] — full property table, allowed items[] type list
