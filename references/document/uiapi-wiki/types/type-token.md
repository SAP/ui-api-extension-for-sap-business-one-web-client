---
title: "b1.sdk.Token"
category: aggregation-type
available_from: "FP 2602"
tags: [aggregations, controls, input]
source_count: 1
---

## Shape

| Property | Type | Mandatory | Default | ReadOnly | Description |
|---|---|---|---|---|---|
| `guid` | string | **Yes** | N/A | **Yes** | Global unique identifier |
| `key` | string | No | `''` | No | Key of the token |
| `text` | string | No | `''` | No | Display text of the token |

**Events**: none.  
**Methods**: getter and setter for each property only — no additional methods.

## Where used

- [[b1sdk-multiinput]] — `tokens[]` aggregation

## Notes

Tokens are small tag-like items representing selected values in MultiInput. No events or focus method.

**Critical**: MultiInput tokens are **not auto-synced to the model** in TwoWay binding — token management (add/remove) must be handled manually in event handlers. See [[b1sdk-multiinput]] for the full pattern.

## Sources

- [[06b-types-aggregations]] — full property table
