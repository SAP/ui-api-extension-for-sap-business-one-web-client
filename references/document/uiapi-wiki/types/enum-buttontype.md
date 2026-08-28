---
title: "b1.sdk.ButtonType"
category: enum
available_from: "FP 2405"
tags: [types-enums, controls]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `Accept` | Accept type |
| `Back` | Back navigation button for header |
| `Default` | Default type (no special styling) |
| `Emphasized` | Emphasized type |
| `Ghost` | Ghost type |
| `Reject` | Reject style |
| `Transparent` | Transparent type |
| `Unstyled` | No styling |
| `Up` | Up navigation button for header |

## Where used

- [[b1sdk-button]] — `buttonType` property
- [[b1sdk-menubutton]] — `type` property (note: MenuButton uses `type`, NOT `buttonType` — a common trap)

## Notes

MenuButton uses the property name `type` instead of `buttonType` to set this enum — unlike Button which uses `buttonType`. This is a frequent mistake.

## Sources

- [[06a-types-enums]] — full enum definition
