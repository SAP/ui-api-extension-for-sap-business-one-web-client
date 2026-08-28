---
title: "Data Binding"
aliases: [data model, JSON model, resource model, binding, i18n binding]
tags: [data-binding, json-model, resource-model, formatters, expression-binding]
source_count: 1
---

## Definition

Data binding connects UI controls to data models so that changes in the model automatically update the UI and (in TwoWay mode) changes in the UI update the model. The Web Client UIAPI provides four binding types: property binding, aggregation binding, expression binding, and resource model (i18n) binding.

## Models

### JSON model

Client-side data model for mutable application data. Supports three binding modes:

| Mode | Behaviour |
|---|---|
| **TwoWay** (default) | UI updates model; model updates UI |
| **OneWay** | Model updates UI; UI changes do NOT propagate back |
| **OneTime** | Model value applied once at bind time; no further sync |

Set up in the controller's `onDataLoad` lifecycle hook:

```javascript
onDataLoad: async function (oEnv, oEvent) {
    const oView = await oEnv.ActiveView();
    await oView.setCustomizedData(
        { status: "Active", quantity: 5 },
        "myData"
    );
}
```

### Resource model (i18n)

Static text model for internationalisation. Supports **one-time binding only**. Configured in `manifest.json`:

```json
{
  "b1.bundles": [
    {
      "i18n": {
        "@@i18n": ["provider.app.module.i18n.i18n"]
      }
    }
  ]
}
```

Properties files per language: `i18n_en.properties`, `i18n_fr.properties`, etc. Framework selects the correct file based on the user's device language setting.

### Pre-defined model: `$viewStatus`

The only system-provided pre-defined model. Exposes three ReadOnly booleans reflecting the current view's editing state:

| Property | Type | Default | Description |
|---|---|---|---|
| `addMode` | boolean | `false` | View is in add (create) mode |
| `editMode` | boolean | `false` | View is in edit mode |
| `viewMode` | boolean | `false` | View is in view (read-only) mode |

Note: at most one flag is `true` at any given time.

## The `@@` prefix convention

All partner-defined models (both JSON and i18n) are prefixed with `@@`. This is a reserved namespace that prevents collision with system models.

- Partner JSON model: `@@myData`, `@@data1`, `@@orderData`
- Partner i18n model: `@@i18n`
- System model: `$viewStatus` (no `@@` prefix)

## Binding types

### Property binding

Binds a single control property to a scalar model value. Syntax: `"{@@modelName>/path}"`.

```json
{
  "ctrlType": "b1.sdk.Input",
  "value": "{@@myData>/status}",
  "editable": "{=!${$viewStatus>/viewMode}}"
}
```

Note: the second example above combines expression binding with property binding — this is valid.

### Aggregation binding

Binds a list control's aggregation (e.g. `items`) to a model array. The framework creates one child control per array element using the `template`.

Syntax: property value is a JSON object with `path` and `template` fields:

```json
{
  "ctrlType": "b1.sdk.ComboBox",
  "items": {
    "path": "@@data3>/comboBoxData",
    "template": {
      "ctrlType": "b1.sdk.Item",
      "key": "{@@data3>key}",
      "text": "{@@data3>text}"
    }
  }
}
```

Note: inside the `template`, relative paths (`{@@data3>key}`) omit the leading `/` — they are relative to the current array element.

**Known limitation**: [[b1sdk-multicombobox]] `items` aggregation binding is NOT supported — use `loadItems` event instead.

### Expression binding

Performs inline calculations or transformations in the binding string. Reuses full UI5 expression binding syntax.

```json
{ "value": "{= ${@@data>/unitPrice} * ${@@data>/quantity}}" }
```

**`$viewStatus` in expressions** (most common pattern):

```json
{ "editable": "{=!${$viewStatus>/viewMode}}" }
{ "visible": "{=${$viewStatus>/editMode}}" }
```

**Array method calls** in expressions:

```json
{ "visibleRowCount": "{=${@@demo>/rows}.length}" }
```

**Comparison and logical operators** (e.g. tree level conditions):

```json
{ "visible": "{=${@@data>level} === 0}" }
{ "visible": "{=${@@data>level} === 1 || ${@@data>level} === 2}" }
```

**Nested path access** inside tree node data:

```json
{ "groupName": "{= ${@@data>data/CardCode}+'/'+${@@data>data/ItemCode}}" }
```

Model variables inside expressions use `${...}` syntax; the outer `{= ... }` marks it as an expression. Reference: [UI5 expression binding docs](https://ui5.sap.com/#/topic/daf6852a04b44d118963968a1239d2c0).

### Resource model (i18n) binding

Binds a property to an i18n translation key. Syntax: `"{@@i18n>keyName}"` (no leading `/` before key).

```json
{
  "ctrlType": "b1.sdk.Button",
  "text": "{@@i18n>buttonText}"
}
```

Where `i18n_en.properties` contains:
```
buttonText=Get Company Information
```

## Formatters

Formatters transform raw model values before display. They are AMD modules that expose named functions.

**1. Define formatter** in `formatter/MyFormatter.js`:

```javascript
define([], function () {
  "use strict";
  return {
    priceRating: function (price) {
      if (price <= 10) return "Low";
      if (price <= 20) return "Reasonable";
      return "High";
    }
  };
});
```

**2. Register in controller** (`require` + assign to `this`):

```javascript
define(["./formatter/MyFormatter"], function (MyFormatter) {
  class Controller {
    constructor() {
      this.myFormatter = MyFormatter;  // instance property
    }
  }
  return Controller;
});
```

**3. Reference in binding string** using dotted path starting with `.`:

```json
{
  "ctrlType": "b1.sdk.Input",
  "value": "{path: '@@data>/unitPrice', formatter:'.myFormatter.priceRating'}"
}
```

The leading `.` in `'.myFormatter.priceRating'` indicates the formatter is on the controller instance.

## Why it matters

- **`$viewStatus`** is the idiomatic way to make controls conditionally editable — bind `editable` to `{=!${$viewStatus>/viewMode}}` to automatically lock inputs in view mode.
- **Aggregation binding** is the recommended pattern for populating ComboBox, RadioButtonGroup, and similar list controls from dynamic data. Formatters are kept out of the model (model purity principle).
- **Expression binding** enables computed display values without a formatter — good for simple arithmetic or ternary conditions.
- **The `@@` prefix** is mandatory — omitting it causes binding to fail or collide with system models.

## Tradeoffs and constraints

- JSON model is **client-side only** — suitable for small datasets. Large datasets should be paginated via the Service Layer rather than loaded into the JSON model.
- Resource model supports **one-time binding only** — i18n strings cannot change at runtime.
- Formatter functions receive the raw model value; they should be **pure functions** (no side effects, no async).
- The `onDataLoad` hook is the canonical place to call `setCustomizedData` for initial model setup. It can also be called from event handlers to reactively update model data and trigger UI refresh.
- MultiInput tokens are a known edge case: TwoWay binding does NOT auto-sync tokens to the model — manual management required (see [[b1sdk-multiinput]]).

## Connections

Related concepts: [[control-object-model]], [[extension-namespace]], [[sdk-env]]
Controls with binding constraints: [[b1sdk-multiinput]] (tokens TwoWay issue), [[b1sdk-multicombobox]] (items aggregation not supported)
Controls that commonly use `$viewStatus`: [[b1sdk-input]], [[b1sdk-checkbox]], [[b1sdk-datepicker]]
Dialog data binding: [[b1sdk-dialog]] (`setCustomizedData`/`getCustomizedData`)

## Sources

- [[04-data-binding]] — full binding type reference with examples and formatter walkthrough
