---
title: "b1.sdk.MessageBoxAction"
category: enum
available_from: "FP 2405"
tags: [types-enums, sdk-env]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `Abort` | Adds an "Abort" button |
| `Cancel` | Adds a "Cancel" button |
| `Close` | Adds a "Close" button |
| `Delete` | Adds a "Delete" button |
| `Ignore` | Adds an "Ignore" button |
| `No` | Adds a "No" button |
| `Ok` | Adds an "OK" button |
| `Retry` | Adds a "Retry" button |
| `Yes` | Adds a "Yes" button |

## Where used

- [[sdk-env]] — `oEnv.showMessageBox({ actions: [b1.sdk.MessageBoxAction.Ok, ...] })` to define which buttons appear in the message box

## Sources

- [[06a-types-enums]] — full enum definition
