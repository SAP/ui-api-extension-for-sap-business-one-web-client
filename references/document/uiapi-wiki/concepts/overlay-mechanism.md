---
title: "Overlay Mechanism"
aliases: [overlay, layout.json, positional patching]
tags: [overlay, extension-architecture]
source_count: 1
---

## Definition

The overlay mechanism is how SAP B1 Web Client UI API extensions modify existing views. Extensions ship `*.layout.json` files that declare insertions, overrides, and moves using GUID-based positional operators. A paired JavaScript controller handles event logic.

## How it works

Each control in a Web Client view has a unique GUID. The overlay JSON references these GUIDs to describe where new controls go or how existing controls should be patched.

**Positional operators:**

| Operator | Effect |
|---|---|
| `before` | Insert new controls immediately before the referenced GUID |
| `after` | Insert new controls immediately after the referenced GUID |
| `on` | Override or update properties/events on an existing control |
| `move` | Relocate a UDF control to a different group/section |

**Typical overlay structure:**

```json
{
  "controller": "<provider.app.module.controller.name>",
  "overlay": {
    "before": [{ "guid": "<existing-guid>", "items": [{ "guid": "...", "ctrlType": "b1.sdk.Button", ... }] }],
    "after":  [{ "guid": "<existing-guid>", "items": [{ "guid": "...", "ctrlType": "b1.sdk.Input",  ... }] }],
    "on":     [{ "guid": "<existing-guid>", "<property>": "<value>", "<event>": "<handler>" }],
    "move":   [{ "guid": "<udf-guid>", "targetGroupGuid": "<custom-group-guid>" }]
  }
}
```

**Patching grid cell controls (FP2511+):**

As of FP2511, `on` supports a `template` sub-block to attach before/after event handlers to controls inside grid cells. Reference the Column's GUID (without the `COLUMN_` prefix) and the cell control's GUID:

```json
"on": [{
  "guid": "xoXg6upQtW5y92TMLUU4te",
  "ctrlType": "b1.sdk.Column",
  "template": {
    "ctrlType": "b1.sdk.Input",
    "guid": "CELL_xoXg6upQtW5y92TMLUU4te",
    "change": { "after": "onChangeQuantity" }
  }
}]
```

## Why it matters

The overlay is the only way to integrate with existing views. Extensions cannot modify views programmatically at runtime outside of this mechanism — everything starts from the JSON declaration. Understanding the overlay structure is prerequisite to any extension development.

## Tradeoffs and constraints

- **Duplicate GUIDs** in a view cause a runtime error — all new control GUIDs must be unique.
- **Invalid or misplaced properties** in overlay JSON will likely cause a runtime error on load; the VS Code plugin provides static schema checking.
- **`move` scope**: UDF relocation is only permitted within sections/tabs. Moving controls to the document header is unsupported and not recommended.
- **GUIDs for system controls** must be discovered via the Web Client Inspector (see [[09-inspector]]).
- Controls layout follows a left-to-right, top-to-bottom flow.

## Connections

Related concepts: [[extension-namespace]], [[ui-extension-architecture]], [[event-flow]]
Controls that declare positional placement: all `b1.sdk.*` controls via `ctrlType`
Tooling: [[09-inspector]] (GUID discovery), VS Code plugin (schema validation)

## Sources

- [[01-overview]] — defines all four positional operators and the overlay JSON structure; documents FP2511 grid cell patching
