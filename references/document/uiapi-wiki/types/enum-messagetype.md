---
title: "b1.sdk.MessageType"
category: enum
available_from: "FP 2502"
tags: [types-enums, controls]
source_count: 1
---

## Values

| Value | Description |
|---|---|
| `Error` | Message is an error |
| `Information` | Message is informational |
| `None` | Message has no specific level |
| `Success` | Message is a success message |
| `Warning` | Message is a warning |

## Where used

- [[b1sdk-messagestrip]] — `type` property

## Notes

Distinct from [[enum-messageboxtype]] (`b1.sdk.MessageBoxType`) which is for the `showMessageBox` dialog. `MessageType` is for inline MessageStrip banners only.

## Sources

- [[06a-types-enums]] — full enum definition
