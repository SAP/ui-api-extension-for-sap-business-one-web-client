---
title: "WebClient UIAPI Reference — 08: Samples"
tags: [samples, tooling]
---

## Summary

Catalogues seven sample applications demonstrating the Web Client UIAPI. All samples build on a VS Code plugin-based startup project. No new API surface is introduced — this source confirms and cross-references patterns already documented in the wiki.

The most useful cross-reference: the Sales Assist App sample is the source of the `preventDefault()` validation example used in [[event-flow]], and the Dialog App sample is the canonical reference for the dialog open/close/return-data flow documented in [[b1sdk-dialog]].

## Key facts

- **7 samples** documented: HelloWorld 1.0.0, HelloWorld 2.0.0, UDFSample 1.0.0, GridCtrl 1.0.0, SalesAssistApp 1.0.0, DemoDialog 1.0.0, ExternalServiceApp 1.0.0
- **Startup project**: VS Code plugin creates a simple app with a Button in **Sales Order Detail View** calling Service Layer `CompanyService_GetCompanyInfo`
- **HelloWorld 2.0.0**: extends startup — demonstrates sections, controls, event handling, data binding, lifecycle hook interception — in **Sales Order Detail View**
- **UDF Sample 1.0.0**: UDF display/binding in **Sales Quotation Detail View**; assumes demo database (SBODemoUS); UDFs queried via `GET /b1s/v1/UserFieldsMD?$filter=TableName eq 'ORDR'`; demonstrates UDF control property override and moving UDF between sections
- **Grid Sample (GridCtrl 1.0.0)**: Grid CRUD (select/add/update/delete rows), before/after event hooks, sort and filter — in **Sales Order Detail View**
- **Sales Assist App 1.0.0**: multi-view app across **Business Partner Detail View** and **Sales Quotation Detail View**; advanced Service Layer queries; system button press interception (source of the `preventDefault()` example)
- **Dialog App (DemoDialog 1.0.0)**: Simple Dialog with TextArea; parent passes context on open; dialog returns result data on close — in **Sales Order Detail View**
- **External Service Auth (ExternalServiceApp 1.0.0)**: two-part sample (extension + external API service); full OAuth2 authentication flow with external service; external service calls Service Layer internally

## Controls covered

All previously documented controls — no new controls introduced.

## Concepts covered

[[b1sdk-dialog]], [[event-flow]], [[security]], [[service-api]], [[data-binding]]

## Types covered

No new types.

## Connections to existing wiki

- **[[event-flow]]**: `preventDefault()` example in the wiki originates from the Sales Assist App sample — confirms the pattern is production-validated.
- **[[b1sdk-dialog]]**: Dialog App sample (DemoDialog 1.0.0) is the canonical real-world example of the open/close/return-data pattern.
- **[[security]]**: External Service Auth sample demonstrates the full OAuth2 + `clientID` + `authenticateExternalService()` flow end-to-end.
- **[[b1sdk-grid]]**: Grid sample covers the full CRUD + sort + filter workflow in a real app context.

## Open questions

None.
