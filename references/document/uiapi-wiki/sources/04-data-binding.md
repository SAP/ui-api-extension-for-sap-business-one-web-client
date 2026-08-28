---
title: "WebClient UIAPI Reference — 04: Data Binding"
tags: [data-binding, json-model, resource-model, formatters, expression-binding]
---

## Summary

Covers the data model architecture and all four binding types available in the Web Client UIAPI: property binding, aggregation binding, expression binding, and resource model (i18n) binding. Also documents the formatter mechanism for transforming model data before display.

The data layer has two model types — JSON model (client-side, mutable) and Resource model (static i18n texts). Both support the `@@` prefix convention for partner-defined models, which is a reserved namespace. The only pre-defined model is `$viewStatus`, which exposes three ReadOnly booleans reflecting current view mode.

Formatters are AMD-style modules that attach to the controller as instance properties and are referenced in binding strings using the `'.formatterProp.methodName'` dotted path syntax.

## Key facts

- **`$viewStatus` pre-defined model**: ReadOnly properties `addMode`, `editMode`, `viewMode` (all boolean, default `false`); use to conditionally set control properties (e.g. `editable`)
- **`@@` prefix is reserved** for all partner-defined models — both JSON (`@@data1`) and i18n (`@@i18n`)
- **JSON model**: client-side; supports TwoWay (default), OneWay, OneTime binding modes; used with `setCustomizedData(data, name)` in controller
- **Resource model**: one-time binding only; used for i18n (static translated texts); configured in `manifest.json` under `b1.bundles[].i18n`
- **Property binding syntax**: `"{@@modelName>/path}"` — curly braces, double-at prefix, model name, `>` separator, slash-prefixed path
- **Aggregation binding syntax**: `{ "path": "@@modelName>/arrayPath", "template": { "ctrlType": "b1.sdk.Item", ... } }` — JSON object with `path` + `template`
- **Expression binding syntax**: `"{= ${@@data>/field1} * ${@@data>/field2}}"` — standard UI5 expression binding; full UI5 syntax supported
- **Resource binding syntax**: `"{@@i18n>keyName}"` — model name `@@i18n`, no leading slash before key
- **Formatter syntax**: `"{path: '@@modelName>/field', formatter:'.controllerProp.method'}"` — dot-prefixed path references controller instance property
- **Formatter definition**: AMD module (`define([], function() { return { method: function(val) {...} }; })`) in `formatter/` directory
- **Formatter registration**: assigned to `this.formatterProp` in controller constructor; referenced as `'.formatterProp.method'` in binding
- **`setCustomizedData(data, modelName)`**: called in `onDataLoad`; sets the customized JSON model on the view
- **i18n properties files**: named `i18n_en.properties`, `i18n_fr.properties`, etc.; registered in manifest as `"@@i18n": ["provider.app.module.i18n.i18n"]`

## Controls covered

No new controls introduced. Binding patterns apply to all previously documented controls.

## Concepts covered

[[data-binding]] (new), [[control-object-model]], [[sdk-env]]

## Types covered

No new types introduced.

## Connections to existing wiki

- **[[b1sdk-multiinput]]**: Aggregation binding for tokens is a known gap — this source confirms the general aggregation binding pattern but notes the MultiInput tokens/TwoWay issue is a separate control-specific constraint.
- **[[b1sdk-multicombobox]]**: Confirms that `items` aggregation binding is NOT supported — must use `loadItems` event (already documented). Standard aggregation binding with `template` approach applies to ComboBox and other controls.
- **[[b1sdk-dialog]]**: `setCustomizedData` / `getCustomizedData` is the dialog data binding mechanism — this source confirms the general JSON model API.
- **[[b1sdk-grid]]**: `rowsData` is a ReadOnly aggregation binding property; the `@@` prefix convention applies.
- **[[sdk-env]]**: `oView.setCustomizedData(data, name)` is the main entry point for model setup, always called in `onDataLoad`.
- **[[extension-namespace]]**: The `@@` prefix aligns with the extension namespace model — partner-owned data is namespaced to avoid collisions with pre-defined system models.

## Open questions

- What binding modes (TwoWay/OneWay/OneTime) can be explicitly set in binding syntax, and what is the syntax to override the default?
