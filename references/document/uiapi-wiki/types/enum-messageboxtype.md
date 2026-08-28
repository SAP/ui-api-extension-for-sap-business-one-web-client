---
title: "b1.sdk.MessageBoxType"
category: enum
available_from: "FP 2405"
tags: [types-enums, sdk-env]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `None` | Error dialog with no icon |
| `Error` | Error dialog with ERROR icon |
| `Success` | Success dialog with SUCCESS icon |
| `Warning` | Warning dialog with WARNING icon |
| `Information` | Information dialog with INFORMATION icon |
| `Confirm` | Confirmation dialog with CONFIRM icon |

## Where used

- [[sdk-env]] — `oEnv.showMessageBox({ type: b1.sdk.MessageBoxType.Confirm, ... })` to set the dialog style

## Notes

The `None` value shows an error-styled dialog without an icon — not a neutral dialog.

## Sources

- [[06a-types-enums]] — full enum definition
