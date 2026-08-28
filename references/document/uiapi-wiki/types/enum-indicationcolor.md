---
title: "b1.sdk.IndicationColor"
category: enum
available_from: "FP 2502"
tags: [types-enums, controls]
source_count: 1
---

## Values

20 values: `Indication01` through `Indication20`.

| Value | Description |
|---|---|
| `Indication01` | Indication Color 1 |
| `Indication02` | Indication Color 2 |
| … | … |
| `Indication20` | Indication Color 20 |

The source does not define the visual meaning of each number — colours are theme-dependent.

## Where used

- [[b1sdk-objectstatus]] — `state` property (alternative to [[enum-valuestate]])

## Notes

ObjectStatus `state` accepts **either** `b1.sdk.ValueState` or `b1.sdk.IndicationColor` — two different enum types for a single property. IndicationColor provides 20 contextual colours for richer semantic meaning beyond the five ValueState options.

The actual colour rendered for each `IndicationXX` value depends on the UI theme in use.

## Sources

- [[06a-types-enums]] — full enum definition
