---
title: "b1.sdk.MenuButtonMode"
category: enum
available_from: "FP 2502"
tags: [types-enums, controls]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `Regular` | The entire button area opens the dropdown menu |
| `Split` | The button is split: the left part fires `defaultAction`, the right part (arrow) opens the dropdown menu |

## Where used

- [[b1sdk-menubutton]] — `buttonMode` property

## Notes

In `Split` mode, the `useDefaultActionOnly` property controls whether the `defaultAction` event fires on every press or only until a menu item has been previously selected.

## Sources

- [[03b-controls-button]] — `buttonMode` property definition on MenuButton
