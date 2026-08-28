---
title: "b1.sdk.PopupDock"
category: enum
available_from: "FP 2502"
tags: [types-enums, controls]
source_count: 1
---

## Values

| Value | Description (pre-FP2605) | Description (FP2605+) |
|---|---|---|
| `BeginBottom` | begin bottom | BeginBottom |
| `BeginCenter` | begin center | BeginCenter |
| `BeginTop` | begin top | BeginTop |
| `CenterBottom` | center bottom | CenterBottom |
| `CenterCenter` | center center | CenterCenter |
| `CenterTop` | center top | CenterTop |
| `EndBottom` | end bottom | EndBottom |
| `EndCenter` | end center | EndCenter |
| `EndTop` | end top | EndTop |
| `LeftBottom` | left bottom | LeftBottom |
| `LeftCenter` | left center | LeftCenter |
| `LeftTop` | left top | LeftTop |
| `RightBottom` | right bottom | RightBottom |
| `RightCenter` | right center | RightCenter |
| `RightTop` | right top | RightTop |

## Where used

- [[b1sdk-menubutton]] — `menuPosition` property (controls where the dropdown menu docks relative to the button)

## Notes

**FP2605 breaking change**: The description strings changed from lowercase phrases (e.g. "begin bottom") to PascalCase (e.g. "BeginBottom") due to a UI5 1.136.9 upgrade. Member names are unchanged. If code compares description strings rather than member names, it may break on FP2605+.

## Sources

- [[06a-types-enums]] — full enum definition including the FP2605 change note
