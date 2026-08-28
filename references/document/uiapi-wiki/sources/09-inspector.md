---
title: "WebClient UIAPI Reference — 09: Inspector"
tags: [tooling, inspector]
---

## Summary

Documents the existence of the Web Client Inspector — a browser extension for development that lets developers locate individual UI controls and display their control information in browser dev mode. No API surface is documented here; the source is a pointer to an external repository.

## Key facts

- **Web Client Inspector** is a browser extension (not part of the SDK itself)
- **Purpose**: locate individual UI controls and display control information in browser dev mode
- **Supported browsers**: Chrome and Edge — not Firefox
- **Installation/usage**: documented at `https://github.wdf.sap.corp/mcqueen/webclient-inspector` (SAP internal GitHub)
- **Shows**: control GUIDs and property values — does **not** show binding paths or model data
- The inspector accelerates extension development by exposing control GUIDs and properties without needing to read layout JSON files

## Controls covered

None — tooling only.

## Concepts covered

None — tooling only.

## Types covered

None.

## Connections to existing wiki

- Practically useful alongside all control pages — the inspector is how a developer discovers the GUIDs of existing system controls to target with overlay operators (`on`, `before`, `after`, `move`).
- [[overlay-mechanism]] — the inspector is the primary tool for finding which GUID to target in an overlay file.

## Open questions

None.
