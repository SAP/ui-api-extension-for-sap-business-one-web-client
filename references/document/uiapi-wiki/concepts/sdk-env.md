---
title: "SDKEnv (oEnv)"
aliases: [oEnv, SDKEnv, SDK environment]
tags: [sdk-env, extension-architecture]
source_count: 1
---

## Definition

`SDKEnv` is the central runtime object of the SAP B1 Web Client UI API, conventionally named `oEnv`. It is passed as the first argument to every controller event handler. All interaction with views, controls, services, dialogs, and UI feedback flows through `oEnv`. Every method returns a `Promise`.

## Methods

| Method | Signature | Notes |
|---|---|---|
| `ActiveView` | `() → Promise<ActiveView>` | Get the current active view |
| `showMessageBox` | `(type, text, options?) → Promise<MessageBoxAction>` | Modal dialog; returns clicked action |
| `showToastMessage` | `(text: string) → Promise<void>` | Non-blocking banner |
| `open` | `(url: string) → Promise<void>` | External URL or relative view link |
| `getService` | `() → Promise<Service>` | Returns `{ ServiceLayer, ViewLinkService, ExternalService }` |
| `newDialog` | `({id: string}) → Promise<Dialog>` | Create dialog by manifest id |
| `refresh` | `() → Promise<void>` | Reload view data from backend _(FP2508)_ |
| `authenticateExternalService` | `(url, useCache?) → Promise<boolean>` | OAuth2 PKCE auth for external service _(FP2602)_ |

## ActiveView

`await oEnv.ActiveView()` returns a view object. Controls are retrieved from it by typed getter methods using their GUID:

```javascript
const oView = await oEnv.ActiveView();
const oButton = await oView.Button(guid);
const oGrid   = await oView.Grid(guid);
// ... one method per control type
```

### List View methods

| Method | Returns | Notes |
|---|---|---|
| `getGuid()` | `string` | GUID of the view |
| `getViewType()` | `string` | View type identifier |
| `showBusy()` / `hideBusy()` | `void` | Busy indicator |
| `getCustomizedData(modelName)` | `any` | Read from named extension data model |
| `setCustomizedData(data, modelName)` | `void` | Write to named extension data model |
| `getControlType(guid)` | `string` | Control type string by GUID _(FP2608)_ |
| `getControl(guid)` | `Control` | Generic control instance by GUID _(FP2608)_ |
| `getI18nText(key, params?)` | `string` | i18n string lookup _(FP2608)_ |
| `getViewInfo()` | `Record<string, unknown>` | View hierarchy/layout _(FP2608)_ |

### Detail View methods

All List View methods, plus:

| Method | Returns | Notes |
|---|---|---|
| `getObjectKey()` | `{ keys: {name, value}[], object: string }` | Current document's key |
| `getPageMode()` | `PageMode` | Add / Update / Display mode enum |
| `setSelectedSection(guid)` | `void` | Programmatically activate a tab/section |

### Deep-linking to a section

Combine `setSelectedSection` with `open()` by encoding the target section GUID as a double-encoded JSON `param` in the URL:

```javascript
const sectionParam = encodeURIComponent(encodeURIComponent(JSON.stringify({
  selectedSection: sectionGuid
})));
await oEnv.open(`${boDetailLink}&param=${sectionParam}`);
```

In the target view's `onDataLoad` handler, read it back:

```javascript
const context = oEvent.getParameter("context");
if (context?.selectedSection) {
  await oView.setSelectedSection(context.selectedSection);
}
```

## getService

Returns three service clients. See [[service-api]] for full method reference.

```javascript
const services     = await oEnv.getService();
const sl           = services.ServiceLayer;    // SAP B1 oData V4 — full CRUD
const viewLink     = services.ViewLinkService; // GET only — variants/view links
const extService   = services.ExternalService; // arbitrary HTTP — full CRUD
```

## showMessageBox

```javascript
const action = await oEnv.showMessageBox(
  b1.sdk.MessageBoxType.Warning,
  "Are you sure?",
  {
    title: "Confirm",
    initialFocus: b1.sdk.MessageBoxAction.Cancel,
    actions: [b1.sdk.MessageBoxAction.Ok, b1.sdk.MessageBoxAction.Cancel]
  }
);
```

Uses [[enum-messageboxtype]] and [[enum-messageboxaction]].

## authenticateExternalService _(FP2602)_

Opens an OAuth2 PKCE popup to authenticate with an external service. After success, subsequent `getService().ExternalService` calls carry the token automatically.

```javascript
const isOK = await oEnv.authenticateExternalService("https://my-external-service.com");
```

- `useCache` (default `true`): reuse token from cache on subsequent calls.
- **Gotcha**: popup may be blocked if not called from a direct user interaction (e.g. button press). Allow popups in browser settings or the address bar prompt.
- The URL must be in `allowedExternalURLs` in `manifest.json`.

## refresh _(FP2508)_

Reloads the view from the backend. Call after a successful Service Layer write to reflect backend changes in the UI:

```javascript
const res = await service.ServiceLayer.patch("Quotations(1)", { ... });
if (res.isSuccess()) await oEnv.refresh();
```

## getI18nText _(FP2608)_

Looks up a key from `i18n.properties` (or `i18n_<lang>.properties` for localised variants). 40 locale codes are supported (AE, AR, AT, AU, BE, BR, CA, CH, CL, CN, CZ, DE, DK, ES, FI, FR, GB, GR, GT, HU, IL, IN, IT, JP, KR, MX, NL, NO, PA, PL, PT, RU, SE, SG, SK, TR, UA, UK, US, ZA).

```javascript
const msg = await oView.getI18nText("greetingKey", [firstName, lastName]);
```

## getViewInfo _(FP2608)_

Returns the current view's layout hierarchy — same structure as the Web Client Inspector, but only a subset of properties per control (`ctrlType`, `guid`, `text` at minimum). To get full properties for a specific control, use `getControl(guid)` instead.

**Return shape — Detail view:**

```javascript
{
  viewId:   "ORDR.detailView",  // <ObjectName>.detailView
  viewType: "Detail",
  viewMeta: {
    tabs: [
      { ctrlType: "b1.sdk.Section", guid: "...", text: "General" },
      // ... one entry per top-level Section (tab)
    ]
  }
}
```

**Return shape — List view:**

```javascript
{
  viewType: "List",
  viewMeta: {
    columns:   [ /* column definitions */ ],
    actionBar: [
      { ctrlType: "b1.sdk.Button",     guid: "...", text: "Create" },
      { ctrlType: "b1.sdk.MenuButton", guid: "...", text: "Pick Lists" },
      // ...
    ]
  }
}
```

Controls from `viewMeta` can be retrieved as live instances via `getControl(guid)`:

```javascript
const info = await oView.getViewInfo();

// Detail: iterate top-level sections
for (const section of info.viewMeta["tabs"] || []) {
  const ctrl = await oView.getControl(section.guid);
  // cast and use
}

// List: iterate action bar items
for (const item of info.viewMeta["actionBar"] || []) {
  const ctrl = await oView.getControl(item.guid);
  if (item.ctrlType === ControlType.Button) {
    const text = await (ctrl as Button).getText();
  }
}
```

## getControlType / getControl _(FP2608)_

`getControlType(guid)` returns the control type string; `getControl(guid)` returns a generic `Control` instance that can be cast to a specific type:

```javascript
// By regular GUID
const ctrlType = await oView.getControlType(guid);  // e.g. ControlType.Button

const ctrl = await oView.getControl(guid);
const type = await ctrl.getControlType();
if (type === ControlType.MenuButton) {
  const menuBtn = ctrl as MenuButton;
  const text = await menuBtn.getText();
}
```

**Grid cell controls** are also accessible — prefix the cell GUID with `CELL_`:

```javascript
const cellGuid = "CELL_3ANfh97HnV2PcjHCC4Xuye";
const ctrlType = await oView.getControlType(cellGuid);  // ControlType.ChooseFromList
const ctrl = await oView.getControl(cellGuid);
```

This is an alternative to the [[type-row]] typed accessor pattern — useful when you have a GUID but not a row index.

## Gotchas and traps

- All methods are async — always `await` them; forgetting `await` will pass a `Promise` where a value is expected.
- `newDialog` requires the dialog id to be declared in `manifest.json` — a missing registration produces a runtime error, not a compile-time warning.
- `open()` for external URLs requires pre-declaration in `allowedExternalURLs`; undeclared URLs are silently blocked by the security sandbox.
- `authenticateExternalService` popup blocking: call it from a button handler, not from lifecycle hooks that fire automatically.
- `getViewInfo()` returns a _subset_ of control properties; don't assume it is a complete property mirror.

## Connections

Related concepts: [[overlay-mechanism]], [[extension-namespace]], [[service-api]], [[security]], [[data-binding]]
Dialog runtime: [[b1sdk-dialog]]
Enums used: [[enum-messageboxtype]], [[enum-messageboxaction]], [[enum-pagemode]]

## Sources

- [[02-sdkenv]] — complete SDKEnv method reference including all FP-versioned additions
