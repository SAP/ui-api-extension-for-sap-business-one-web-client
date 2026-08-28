---
title: "b1.sdk.Grid"
type: control
available_from: "FP 2405"
tags: [controls, table, grid]
source_count: 1
---

## What it is

A full-featured data table for displaying and interacting with large datasets. Supports multi-row selection, column sort and filter, programmatic row/column access, clipboard paste, and row-level cell control access. Data is provided exclusively through the `rowsData` binding property (ReadOnly).

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `title` | string | `''` | No | Grid title |
| `rowsData` | array | — | **Yes** | **Mandatory** data binding property — set via data binding only |
| `visible` | boolean | `true` | No | Whether the grid is shown |
| `visibleRowCount` | int | `20` | No | Number of rows visible at a time |
| `selectionMode` | SelectionMode | `multiple` | No | Row selection mode — see [[enum-selectionmode]] |
| `selectionBehavior` | b1.sdk.Grid.SelectionBehavior | `RowSelector` | No | Whether clicking the row, selector, or both triggers selection |
| `columnHeaderHeight` | int | — | No | Column header height in pixels |
| `columnHeaderVisible` | boolean | `true` | No | Whether column headers are shown†  |
| `enableSelectAll` | boolean | `true` | No | Whether a Select All button is shown (multi-selection only)† |
| `firstVisibleRow` | int | `0` | No | Index of the first visible row |
| `rowHeight` | int | — | No | Row height in pixels |
| `showNoData` | boolean | `true` | No | Whether the no-data overlay is shown when the grid is empty† |
| `noData` | string | `''` | No | Text shown in the no-data state |
| `width` | string | `'100%'` | No | Width of the grid |
| `busy` | boolean | `false` | No | Whether the grid is in busy/loading state |

†Source code comments suggest `setColumnHeaderVisible`, `setEnableSelectAll`, and `setShowNoData` may not be exposed as runtime setters — getters only.

## Events

| Event | Parameters | Description |
|---|---|---|
| `ItemPressed` | `value` (object) | Fired when a cell is pressed |
| `rowSelectionChange` | `rowIndex`, `rowIndices[]`, `selectAll`, `userInteraction` | Fired when row selection changes |
| `firstVisibleRowChanged` | — | Fired when the first visible row changes |
| `sort` | `column`, `sortOrder`, `columnAdded` | Fired when a column is sorted |
| `filter` | `column`, `value` | Fired when a column is filtered |
| `paste` | `data` (string[][]) | Fired when user pastes from clipboard — 2D array (rows × cells) |

## Methods

### Selection

| Method | Signature | Description |
|---|---|---|
| `getSelectedIndices()` | `() → Promise<int[]>` | UI-layer selected row indices (affected by sort/filter display) |
| `getAllSelectedIndices()` | `() → Promise<int[]>` | **Actual data indices** of selected rows (unaffected by sort/filter) |
| `setSelectedIndex(i)` | `(int) → Promise<void>` | Sets single selection; clears existing; -1 = no selection |
| `addSelectionInterval(from, to)` | `(int, int) → Promise<void>` | Adds a range to the selection |
| `removeSelectionInterval(from, to)` | `(int, int) → Promise<void>` | Removes a range from the selection |
| `clearSelection()` | `() → Promise<void>` | Removes all selection |

### Data access

| Method | Signature | Description |
|---|---|---|
| `getRowData(index)` | `(int) → Promise<any>` | Returns the bound data object for a row |
| `getSize()` | `() → Promise<int>` | Returns total number of bound rows |
| `getFilteredIndices()` | `() → Promise<int[]>` | Returns indices of currently filtered rows |
| `removeRows(indices[])` | `(int[]) → Promise<void>` | Removes rows at the given data indices |

### Row and column access

| Method | Signature | Description |
|---|---|---|
| `Row(index)` | `(int) → Promise<Row>` | Returns a Row object for the given index — see [[type-row]] |
| `Column(guid)` | `(string) → Promise<Column>` | Returns a Column object by GUID — see [[type-column]] |
| `getColumns()` | `() → Promise<Column[]>` | Returns all Column objects |

### Filter and sort

| Method | Signature | Description |
|---|---|---|
| `setFilter({filters, and})` | `(object) → Promise<void>` | Applies programmatic filters; `and: true` combines with AND logic; `operator` values: see [[enum-modelfilteroperator]] |
| `resetSort()` | `() → Promise<void>` | Clears all column sort states |

### Other

| Method | Signature | Description |
|---|---|---|
| `ready()` | `() → Promise<void>` | Resolves when the grid is fully initialised |
| `getEditable()` | `() → Promise<boolean>` | Returns editable state — `editable` is **not** a layout JSON property and has no setter |
| `scrollToRowIndex(index)` | `(int) → Promise<void>` | Scrolls to a row by index — **FP2608** |

### Fire methods (FP2508)

`fireItemPressed`, `fireRowSelectionChange`, `fireFirstVisibleRowChanged`, `fireSort`, `fireFilter`, `firePaste`

## Row cell access pattern

Cells in a row are accessed by getting a Row object, then calling typed control methods on it:

```javascript
const oRow = await oGrid.Row(0);            // get row at index 0
const oInput = await oRow.Input("cellGuid"); // get a cell's Input control
await oInput.setValue("new value");
await oRow.focus();                          // focus the row
```

**This is different from accessing view-level controls.** Cell control GUIDs belong to the Row scope, not the view scope — `oView.Input("cellGuid")` will NOT work for grid cell controls.

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "2g9uibjwCxiqPpFrz8NiwY",
  "ctrlType": "b1.sdk.Grid",
  "title": "My Grid",
  "visibleRowCount": 20,
  "selectionMode": "multiple",
  "columnHeaderVisible": true,
  "enableSelectAll": true,
  "showNoData": true,
  "width": "100%",
  "rowSelectionChange": { "procName": "onSelectionChanged" },
  "itemPressed":        { "procName": "onItemPressed" },
  "sort":               { "procName": "onSort" },
  "filter":             { "procName": "onFilter" },
  "paste":              { "procName": "onPaste" }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oGrid = await oView.Grid("2g9uibjwCxiqPpFrz8NiwY");

// Selection
const uiIndices = await oGrid.getSelectedIndices();
const dataIndices = await oGrid.getAllSelectedIndices(); // use for data ops after sort/filter
await oGrid.setSelectedIndex(3);
await oGrid.addSelectionInterval(1, 4);
await oGrid.clearSelection();

// Row and cell access
const oRow = await oGrid.Row(0);
const oCell = await oRow.Input("eK4e1gtnsTirHQxwYDdstn");
await oCell.setValue("updated");

// Data
const rowData = await oGrid.getRowData(0);
const total = await oGrid.getSize();
await oGrid.removeRows([1, 3, 5]);

// Programmatic filter
await oGrid.setFilter({ filters: [{ path: "Status", operator: "EQ", value1: "A" }], and: true });
await oGrid.resetSort();

// Scroll (FP2608)
await oGrid.scrollToRowIndex(25);
```

**Event handlers:**
```javascript
onSelectionChanged: function (oEnv, oEvent) {
    const params = oEvent.getParameters();
    console.log("rowIndex:", params.rowIndex);
    console.log("rowIndices:", params.rowIndices);
    console.log("selectAll:", params.selectAll);
},

onPaste: function (oEnv, oEvent) {
    const data = oEvent.getParameter("data"); // string[][]
    data.forEach(row => console.log(row));     // row is string[]
}
```

## Gotchas and traps

- **`rowsData` is ReadOnly** — it is the data binding property; set it via data binding in the layout JSON. Cannot be set at runtime.
- **`getSelectedIndices()` vs `getAllSelectedIndices()`** — when the grid is sorted or filtered, UI indices ≠ data indices. Always use `getAllSelectedIndices()` when operating on the underlying data.
- **`selectionMode` defaults to `multiple`** — unlike most UI frameworks where single is default. Set explicitly if you need single-row selection.
- **Row cell controls are NOT view-registered** — access them via the typed accessor on the Row object (`oRow.Input("guid")`, `oRow.ComboBox("guid")`, etc.), not `oView.ControlType("guid")`.
- **`getEditable()` is read-only** — `editable` is not a layout JSON property and has no setter. It reflects state managed by the framework, not partner code.
- **`setColumnHeaderVisible`, `setEnableSelectAll`, `setShowNoData` are not exposed** — only their `get*` counterparts work. Configure these in layout JSON; runtime setters are no-ops.
- **`paste` event `data` is `string[][]`** — a 2D array where `data[0]` is the first pasted row and `data[0][0]` is its first cell.
- **`b1.sdk.Grid.SelectionBehavior`** is scoped to Grid — unlike all other enums which live at the top-level `b1.sdk` namespace.
- **Grid is forbidden inside Form** (see [[b1sdk-form]]).

## Relationships

Overlay patching: [[overlay-mechanism]] (FP2511 grid cell template patching via Column GUID)
Types used: [[type-row]], [[type-column]], [[enum-selectionmode]], [[enum-selectionbehavior-grid]], [[enum-modelfilteroperator]], [[enum-horizontalalign]]
Forbidden inside: [[b1sdk-form]]

## Sources

- [[03j-controls-table]] — full property/event/method reference and usage examples
