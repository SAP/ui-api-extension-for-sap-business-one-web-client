---
title: "b1.sdk.InputType"
category: enum
available_from: "FP 2405"
tags: [types-enums, controls, input]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `Measure` | Compound format: number1+unit1+number2+unit2 (e.g. "1.234Lb11.000Oz") |
| `Percent` | Appends "%" after the input area |
| `Price` | Currency format |
| `Quantity` | Float format with rounding accuracy for quantity |
| `Rate` | Float format with rounding accuracy for rate |
| `String` | Text format |
| `Sum` | Currency format |
| `Tax` | Currency format |
| `Unit` | Float format with rounding accuracy for unit |
| `Integer` | Integer format (no fractional part) |
| `Hour` | Appends "Hr" after the input area |

## Where used

- [[b1sdk-input]] — `inputType` property (also affects `textAlign` default: currency types default to `Right`, others to `Begin`)

## Notes

The `inputType` value affects the default `textAlign` on Input: currency types (`Price`, `Sum`, `Tax`) default to `Right`; all others default to `Begin`.

## Sources

- [[06a-types-enums]] — full enum definition
