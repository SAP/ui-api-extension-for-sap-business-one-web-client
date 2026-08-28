---
title: "b1.sdk.SubSection"
category: aggregation-type
available_from: "FP 2405"
tags: [aggregations, controls, layout]
source_count: 2
---

## Shape

| Property | Type | Mandatory | Default | ReadOnly | Description |
|---|---|---|---|---|---|
| `guid` | string | **Yes** | N/A | **Yes** | Global unique identifier |
| `visible` | boolean | No | `true` | No | Whether the subsection is shown |
| `text` | string | No | `''` | No | Subsection title |
| `groups` | Group[] | No | `[]` | No | Groups contained in this subsection — see [[type-group]] |

## Methods

| Method | Signature | Available | Description |
|---|---|---|---|
| `getGroups()` | `() → Promise<Group[]>` | **FP2608** | Returns all Group objects in this SubSection |

Getter/setter for each property (`getVisible`/`setVisible`, `getText`/`setText`).  
**Events**: none.

## Usage pattern

```javascript
const oView = await oEnv.ActiveView();
const oSection = await oView.Section("sectionGuid");

// Get all SubSections
const subSections = await oSection.getSubSections();

// Toggle SubSection visibility
const subSection1 = subSections[0];
const isVisible = await subSection1.getVisible();
await subSection1.setVisible(!isVisible);

// Read SubSection title
const title = await subSection1.getText();

// Traverse Groups within a SubSection
const groups = await subSection1.getGroups();
const group0 = groups[0];
await group0.setText("New Title");
await group0.setVisible(false);

// Traverse multiple SubSections
const subSection2 = subSections[1];
const groups2 = await subSection2.getGroups();
const group10 = groups2[0];
const group10Text = await group10.getText();
```

## Where used

- [[b1sdk-section]] — accessed via `section.getSubSections()` (FP2608)

## Notes

The JSON aggregation key on Section is `subSection` (camelCase, no plural-s on "SubSection" but plural array). Groups within a SubSection can individually control their layout via `width` (6 or 12).

## Sources

- [[03h-controls-layout]] — SubSection first introduced as part of Section hierarchy
- [[06b-types-aggregations]] — full property table, usage example, getGroups() method (FP2608)
