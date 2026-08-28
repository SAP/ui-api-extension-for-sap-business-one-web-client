---
title: "WebClient UIAPI Reference — 10: Appendix — Supported View List"
tags: [tooling, samples]
---

## Summary

The complete list of SAP Business One Web Client views that support UI API extensions, grouped by the feature pack in which they became available. 150 views are listed across FP2405 through FP2608. No new API surface — pure reference data. Updated from the prior version (119 views through FP2602) to add 31 FP2608 views spanning Checks, Inventory, Reconciliation, Campaigns, Forecasts, MRP, Resources, Pick Lists, Employees, and Projects.

## Key facts

- **150 supported views** total as of FP2608
- **FP2405 (64 views)**: Sales, Purchasing, Inventory, Production, Financials, Business Partners, HR, Service core views
- **FP2502 (24 views)**: Payments, Opportunities, Service Calls, Items, Equipment Cards, Inventory Transfers, Recurring Journals, Journal Voucher
- **FP2508 (12 views)**: Deposits, Landed Costs, Recurring Transactions, Down Payment Invoices, Inventory Counting Drafts
- **FP2602 (19 views)**: Service Call Detail, Blanket Agreements (Sales + Purchase), Inventory Postings, Payment Runs, Correction Invoices (A/R + A/P), DATEV Export
- **FP2608 (31 views)**: Checks for Payment, Inventory Opening Balances, Internal/External Reconciliation, Employees, Projects, Inventory Revaluation, Campaigns, Forecasts, MRP Runs, Resources, Pick Lists, Previous External Reconciliation; also Inventory Counting Draft Detail (completing FP2508 pair)
- FP2605 has no new views in this list — the gap from FP2602 to FP2608 is real
- All views come in **List + Detail** pairs (where applicable) — both are independently extensible
- Sample apps target: **Sales Order Detail** (HelloWorld, Grid), **Sales Quotation Detail** (UDF, SalesAssist), **Business Partner Detail** (SalesAssist)
- Notable single-entry views: **Docs in Approval Process List**, **Approval Decisions List**, **Outgoing Payments in Approval Process List** (approval workflow — no corresponding detail view listed)

## Full view list

### FP2405 (64 views)

Sales: Sales Quotations List/Detail, Sales Orders List/Detail, Sales Drafts List, Docs in Approval Process List, Returns List/Detail, A/R Invoices List/Detail, A/R Credit Memos List/Detail, A/R Reserve Invoices List/Detail, Return Requests List/Detail

Purchasing: Purchase Orders List/Detail, Purchase Quotations List/Detail, Goods Receipt POs List/Detail, A/P Invoices List/Detail, A/P Reserve Invoices List/Detail, Goods Returns List/Detail, A/P Credit Memos List/Detail, Goods Return Requests List/Detail, Purchase Requests List/Detail

Inventory: Goods Issues List/Detail, Goods Receipts List/Detail, Inventory Counting Transactions List/Detail

Production: Production Orders List/Detail, Issues for Production List/Detail, Receipts from Production List/Detail, Bills of Materials List/Detail

Financials: Journal Entries List/Detail, Outgoing Payments in Approval Process List, Approval Decisions List

Business Partners: Business Partners List/Detail

HR: Time Sheets List/Detail, Activities List/Detail

Service: Service Contracts List/Detail

### FP2502 (24 views)

Outgoing Payments List/Detail, Incoming Payments List/Detail, Opportunities List/Detail, Service Calls List, Items List, Item Master Data Detail, Equipment Cards List/Detail, Solutions Knowledge Base List/Detail, Inventory Transfer Requests List/Detail, Inventory Transfers List/Detail, Recurring Journal Entries List, Recurring Posting Detail, Journal Voucher Entry Detail

### FP2508 (12 views)

Deposits List/Detail, Landed Costs List/Detail, Recurring Transaction Templates List/Detail, Recurring Transactions List, A/R Down Payment Invoices List/Detail, A/P Down Payment Invoices List/Detail, Inventory Counting Drafts List

### FP2602 (19 views)

Service Call Detail, Sales Blanket Agreements List/Detail, Purchase Blanket Agreements List/Detail, Inventory Postings List/Detail, Payment Runs List/Detail, A/R Correction Invoices List/Detail, A/P Correction Invoices List/Detail, A/R Correction Invoice Reversals List/Detail, A/P Correction Invoice Reversals List/Detail, DATEV Export List/Detail

### FP2608 (31 views)

Inventory Counting Draft Detail (completes FP2508 pair), Checks for Payment List/Detail, Void Checks for Payment List, Checks for Payment Drafts List/Detail, Inventory Opening Balances List/Detail, Inventory Opening Balance Drafts List/Detail, Internal Reconciliations List, Employees List/Detail, Projects List/Detail, Inventory Revaluation List/Detail, Reconciliation List, External Reconciliation Detail, Previous External Reconciliation List/Detail, Campaigns List/Detail, Forecasts List/Detail, MRP Runs List/Detail, Resources List/Detail, Pick Lists List/Detail

## Controls covered

None.

## Concepts covered

[[ui-extension-architecture]] — confirms the scope of views extensible through the SDK.

## Types covered

None.

## Connections to existing wiki

- **[[08-samples]]**: sample views confirmed — Sales Order Detail (FP2405), Sales Quotation Detail (FP2405), Business Partner Detail (FP2405) are all in the FP2405 launch set.
- **[[ui-extension-architecture]]**: the view list defines the full scope of extension points available.

## Open questions

- Can an extension target List views differently from Detail views (e.g. different overlay operators)?
