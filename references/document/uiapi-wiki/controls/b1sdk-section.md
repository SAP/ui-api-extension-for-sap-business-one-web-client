---
title: "b1.sdk.Section"
type: control
available_from: "FP 2405"
tags: [controls, layout]
source_count: 1
---

## What it is

The top-level structural container in object page layouts. Sections aggregate SubSections, which aggregate Groups, which hold individual controls. The full nesting hierarchy is:

```
Section
└── SubSection[]
    └── Group[]
        └── items[] (controls)
```

As of FP2608, the Section Hierarchy API allows programmatic traversal: `getSubSections()` returns the live SubSection objects, and from each SubSection `getGroups()` returns the live Group objects, giving full read/write access to the hierarchy at runtime.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `visible` | boolean | `true` | No | Whether the section is shown |
| `text` | string | `''`† | No | Section title text |
| `showTitle` | boolean | `true` | No | Whether the section title is displayed |
| `subSections` | SubSection[] | `[]` | No | Subsections within this section — see [[type-subsection]] |

†Source documents default as `"Start"` — likely a documentation error; treat as empty string.

## Events

None.

## Methods

| Method | Signature | Available | Description |
|---|---|---|---|
| `getSubSections()` | `() → Promise<SubSection[]>` | **FP2608** | Returns all SubSection objects in this Section |

Getter/setter for each property (getter/setter for `visible`, `text`, `showTitle`). No `focus()`.

## Aggregations

| Name | Type | Notes |
|---|---|---|
| `subSections` | SubSection[] | Each SubSection contains `groups[]`, each Group contains `items[]` |

### SubSection properties (inline)
Declared nested inside `subSections[]` in layout JSON.

| Property | Type | Notes |
|---|---|---|
| `guid` | string | Required; view-registered |
| `ctrlType` | string | `"b1.sdk.SubSection"` |
| `text` | string | Subsection title |
| `groups` | Group[] | See [[type-group]] |

### Group properties (inline)
Declared nested inside `groups[]` in layout JSON.

| Property | Type | Notes |
|---|---|---|
| `guid` | string | Required; view-registered |
| `ctrlType` | string | `"b1.sdk.Group"` |
| `text` | string | Group title |
| `align` | string | Optional; e.g. `"right"` for right-aligned group |
| `items` | Control[] | The leaf controls |

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "2uYDkRidQceMnh26HSuU61",
  "ctrlType": "b1.sdk.Section",
  "text": "My Section",
  "showTitle": true,
  "subSections": [
    {
      "guid": "15Tvy2ADMLsq7TJdJjEQDq",
      "ctrlType": "b1.sdk.SubSection",
      "text": "Details",
      "groups": [
        {
          "guid": "5mWFpvxL7BKRc2Vmm7PMwv",
          "ctrlType": "b1.sdk.Group",
          "text": "General",
          "items": [
            {
              "guid": "vB2cRy8RMqNRJTrnZZHQih",
              "ctrlType": "b1.sdk.Input",
              "label": "Name"
            }
          ]
        }
      ]
    }
  ]
}
```

**Controller (access leaf controls directly by GUID):**
```javascript
const oView = await oEnv.ActiveView();
// Leaf controls inside a Section are still view-registered by GUID
const oInput = await oView.Input("vB2cRy8RMqNRJTrnZZHQih");
await oInput.setValue("Updated");

// Access the Section itself
const oSection = await oView.Section("2uYDkRidQceMnh26HSuU61");
await oSection.setVisible(false);
await oSection.setShowTitle(false);
```

**Section Hierarchy API (FP2608) — traverse SubSections and Groups:**
```javascript
const oSection = await oView.Section("2uYDkRidQceMnh26HSuU61");

// Traverse SubSections
const subSections = await oSection.getSubSections();
const subSection1 = subSections[0];
await subSection1.setVisible(false);

// Traverse Groups within a SubSection
const groups = await subSection1.getGroups();
const group0 = groups[0];
await group0.setText("New Title");
await group0.setVisible(false);
```

## Gotchas and traps

- **No events, no `focus()`** on Section, SubSection, or Group.
- **`getSubSections()` and `getGroups()` are FP2608** — on earlier releases Section and SubSection have no traversal methods; only leaf controls are accessible.
- **SubSection and Group have no view typed getter** — `oView.SubSection("guid")` does not exist. Reach them via `section.getSubSections()` and `subSection.getGroups()` only.
- **All levels require GUIDs** — Section, SubSection, and Group each need a unique GUID in the view.
- **`group.align`** accepts `"left"` (default) or `"right"` only — a plain string literal, not an enum.
- **`text` default documented as `"Start"`** — treat as empty string (likely a doc error).

## Relationships

Contains: [[type-subsection]], [[type-group]]
Used in: [[overlay-mechanism]] (overlay operators target Sections by GUID)

## Sources

- [[03h-controls-layout]] — full property/aggregation/usage reference
