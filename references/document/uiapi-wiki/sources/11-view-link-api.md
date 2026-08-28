---
title: "WebClient UIAPI Reference — 11: View Link API"
tags: [service-layer, sdk-env, extension-architecture]
---

## Summary

Detailed reference for the View Link API — the REST endpoints accessible via `ViewLinkService` from `oEnv.getService()`. The existing wiki documented ViewLinkService as a GET-only client with a single usage example; this source adds the full endpoint catalog, all parameter shapes, response types, the complete system object name list (~100 values as of FP2608), and a parallel set of Analytics View endpoints. The framework automatically prepends `/extn` to all URLs, so code always uses `/api/...`.

## Key facts

- **Framework prepends `/extn` automatically** — use `/api/Variants?...` in code, not `/extn/api/Variants?...`
- **5 Object View endpoints**: Variants (JSON), objectsListView (URL), objectsDetailView (URL), Drafts variant, Configuration variant
- **3 Analytics View endpoints**: analyticsViews, analyticsViewVariants, analyticsView
- **Two-step pattern** for list views: first call `/api/Variants` to get a variantGUID, then call `/api/objectsListView` with that GUID
- **One-step pattern** for detail views: call `/api/objectsDetailView?objName=...&value={DocEntry}`
- `value` parameter = **DocEntry** (internal number) for documents, primary key for master data — NOT the user-visible DocNum
- DocNum → DocEntry resolution: `GET /b1s/v2/Orders?$filter=DocNum eq 1204&$select=DocEntry`
- Draft documents use `objName=Drafts` + `subObjName=` (19 known values listed)
- Configuration objects use `objName=Configuration`
- **analyticsType** values: `'Dashboard'` or `'ChartContainer'`; analytics response varies by user authorization and database type
- **~100 system object names** documented (as of FP2608), covering all views in the supported view list

## Controls covered

None.

## Concepts covered

[[service-api]] — primary update target; ViewLinkService endpoint catalog expanded significantly.

## Types covered

None.

## Connections to existing wiki

- **[[02-sdkenv]]**: the source document references this URL for "more details about View Link API" — this source is the detail page that URL points to.
- **[[service-api]]**: the concept page had a minimal usage snippet; now has the full endpoint catalog, parameter shapes, analytics APIs, and system object name list.
- **[[10-appendix]]**: the system object names list aligns with the supported views list — every view in the appendix has a corresponding `objName` value here.

## Open questions

None.
