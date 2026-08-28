---
title: "WebClient UIAPI Reference — 02: SDKEnv"
tags: [sdk-env, service-layer, extension-architecture, events]
---

## Summary

This source documents the `SDKEnv` object (`oEnv`) — the central runtime handle passed to every controller function. All interaction with the view, services, dialogs, and UI feedback flows through `oEnv`. Every function on `oEnv` returns a Promise (the API is fully async).

`ActiveView()` returns a typed view object. Controls are retrieved from it by named typed getters (e.g. `oView.Button(guid)`, `oView.Grid(guid)`). View objects expose a shared method set for both List and Detail views, plus Detail-only methods for object key retrieval, page mode, and section navigation.

`getService()` provides access to three service backends: `ServiceLayer` (SAP B1 oData V4 CRUD), `ViewLinkService` (GET-only variants/view links), and `ExternalService` (arbitrary cross-origin HTTP). All return a `Response` object with `isSuccess()`, `getStatus()`, `getHeaders()`, and `getData()`.

Several functions were added in later feature packs: `refresh()` in FP2508, `authenticateExternalService()` in FP2602, and `getControlType()` / `getControl()` / `getI18nText()` / `getViewInfo()` in FP2608.

## Key facts

- `oEnv` is passed as the first argument to every controller handler function.
- All `oEnv` methods are async (return `Promise`).
- **`ActiveView()`** — returns the current active view; controls accessed via typed getters by GUID.
- **`showMessageBox(type, text, options?)`** — uses `b1.sdk.MessageBoxType` and `b1.sdk.MessageBoxAction` enums; returns the action the user clicked.
- **`showToastMessage(text)`** — non-blocking banner message.
- **`open(url)`** — opens external URL (must be in `allowedExternalURLs`) or a relative Web Client view link URL.
- **`getService()`** — returns `{ ServiceLayer, ViewLinkService, ExternalService }`.
- **`newDialog({id})`** — creates a Dialog by id; id must be registered in `manifest.json`.
- **`refresh()`** _(FP2508)_ — reloads view data from the backend; call after a successful Service Layer write.
- **`authenticateExternalService(url, useCache?)`** _(FP2602)_ — OAuth2 PKCE popup; `useCache` defaults to `true`; popup may be blocked if not triggered by a user interaction.
- **`getControlType(guid)` / `getControl(guid)`** _(FP2608)_ — available on both List and Detail views; `getControl` returns a generic `Control` that can be cast to a specific type.
- **`getI18nText(key, params?)`** _(FP2608)_ — reads from `i18n.properties` / `i18n_<lang>.properties`; 40 locale codes supported.
- **`getViewInfo()`** _(FP2608)_ — returns view hierarchy (same structure as Web Client Inspector, but a subset of properties per control).
- **`setSelectedSection(guid)`** _(Detail View only)_ — programmatic tab selection; also supports deep-linking via double-encoded JSON `param` in a URL passed to `open()`.
- **`getObjectKey()`** _(Detail View only)_ — returns `{ keys: { name, value }[], object: string }`.
- **`getPageMode()`** _(Detail View only)_ — returns a `PageMode` enum value.
- ExternalService requests are cross-origin; the target server must enable CORS or the call will fail.
- Hardcoding auth tokens in code is for dev/test only; use `authenticateExternalService` in production.

## Concepts covered

[[sdk-env]], [[service-api]]

## Controls covered

_None — this source covers the runtime environment, not individual controls._

## Types covered

[[enum-messageboxtype]], [[enum-messageboxaction]] — `showMessageBox` parameter and return type. [[enum-pagemode]] — `getPageMode()` return type. All documented in [[06a-types-enums]].

## Connections to existing wiki

Extends [[ui-extension-architecture]] — fills in the runtime side of the extension model. `open()` links to [[security]] (allowedExternalURLs). `newDialog` is the runtime counterpart to the Dialog control — documented in [[b1sdk-dialog]] and [[03i-controls-container]].

## Open questions

None.
