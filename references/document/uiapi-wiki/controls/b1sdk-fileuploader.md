---
title: "b1.sdk.FileUploader"
type: control
available_from: "FP 2508"
tags: [controls, picker]
source_count: 1
---

## What it is

A file selection and upload control. The user picks a file from their local filesystem via a file browser dialog; the control optionally uploads it immediately or waits for a programmatic `upload()` call. Can render as a text field + button (default) or as a button only (`buttonOnly: true`). Supports multi-file selection, directory upload, XHR vs form-submit upload, and file type filtering.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Field label |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `enabled` | boolean | `true` | No | Whether the control is interactive |
| `editable` | boolean | `true` | No | Whether the text path field is editable (does not affect upload capability) |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `value` | string | `''` | **Yes** | Selected file path — **ReadOnly**; reflects user's file selection |
| `name` | string | `''` | No | Field name sent to the server with the upload request |
| `uploadUrl` | string | `''` | No | URL to POST the uploaded file to |
| `additionalData` | string | `''` | No | Extra data string sent to the backend alongside the file |
| `buttonOnly` | boolean | `false` | No | Render as button without text field |
| `buttonText` | string | `''` | No | Text displayed on the button |
| `icon` | string | `''` | No | Icon for the button (e.g. `sap-icon://add-photo`) |
| `style` | string | `''` | No | Button style: `Transparent`, `Accept`, `Reject`, `Emphasized` |
| `width` | string | `''` | No | Width of the control in CSS units |
| `placeholder` | string | `''` | No | Placeholder text in the path field |
| `multiple` | boolean | `false` | No | Allow selecting multiple files at once |
| `directory` | boolean | `false` | No | Allow selecting a directory (uploads all files recursively) |
| `fileType` | string[] | `[]` | No | Allowed file extensions (e.g. `["jpg", "png"]`); empty = all types allowed |
| `uploadOnChange` | boolean | `false` | No | Start upload automatically as soon as a file is selected |
| `sendXHR` | boolean | `false` | No | Use XHR request instead of form submit for the upload |
| `valueState` | enum | `None` | No | Validation state — see [[enum-valuestate]] |
| `valueStateText` | string | `''` | No | Additional text for `valueState` |

## Events

| Event | Parameters | Description |
|---|---|---|
| `uploadStart` | `fileName`, `requestHeaders[]` | Fired just before an upload starts |
| `uploadComplete` | `fileName`, `response`, `readyStateXHR`, `status`, `responseRaw`, `headers`, `requestHeaders[]` | Fired when upload completes (success or failure) |
| `typeMissmatch` | `fileName`, `fileType`, `mimeType` | Fired when a selected file's type doesn't match `fileType` — **note the double-'s' spelling; it is the actual API event name** |
| `change` | `newValue`, `files[]` | Fired when the file path value changes (file selected or cleared) |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | †FP 2508 | Sets focus to the control |
| `upload()` | FP 2508 | Triggers the upload to `uploadUrl` |
| `checkFileReadable()` | FP 2508 | Checks whether the selected file is readable |
| `clear()` | FP 2508 | Clears the selected file and resets the control |
| `fireUploadStart({ fileName?, requestHeaders? })` | FP 2508 | Programmatically fires `uploadStart` |
| `fireUploadComplete({ fileName?, response?, readyStateXHR?, status?, responseRaw?, headers?, requestHeaders? })` | FP 2508 | Programmatically fires `uploadComplete` |
| `fireTypeMissmatch({ fileName?, fileType?, mimeType? })` | FP 2508 | Programmatically fires `typeMissmatch` |
| `fireChange({ newValue?, files? })` | FP 2508 | Programmatically fires `change` |

†Availability not explicitly stated in source; assumed FP2508 (control launch).

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "HHIxOPEtTkaahsYOvw6vqw",
  "ctrlType": "b1.sdk.FileUploader",
  "label": "Upload Image",
  "buttonText": "Browse",
  "icon": "sap-icon://add-photo",
  "uploadUrl": "/b1s/v2/Attachments2",
  "name": "ItemUploadName",
  "fileType": ["jpg", "png"],
  "uploadOnChange": true,
  "sendXHR": false,
  "multiple": false,
  "placeholder": "Choose a jpg or png file",
  "style": "Accept",
  "uploadStart":    { "procName": "onUploadStart" },
  "uploadComplete": { "procName": "onUploadComplete" },
  "typeMissmatch":  { "procName": "onTypeMissmatch" },
  "change":         { "procName": "onChange" }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oFU = await oView.FileUploader("HHIxOPEtTkaahsYOvw6vqw");

// value is ReadOnly — read the file path after user selection
console.log(await oFU.getValue());

// Programmatic upload
await oFU.setUploadUrl("/b1s/v2/Attachments2/new");
await oFU.upload();

// Validate file is readable before uploading
await oFU.checkFileReadable();

// Reset the control
await oFU.clear();
```

**Event handlers:**
```javascript
onUploadComplete: async function (oEnv, oEvent) {
    const status = oEvent.getParameter("status");
    const response = oEvent.getParameter("response");
    if (status === 201) {
        console.log("Upload succeeded:", response);
    } else {
        console.error("Upload failed, status:", status);
    }
},

onTypeMissmatch: async function (oEnv, oEvent) {
    const fileName = oEvent.getParameter("fileName");
    const mimeType = oEvent.getParameter("mimeType");
    console.warn("Wrong file type:", fileName, mimeType);
}
```

## Gotchas and traps

- **`value` is ReadOnly** — you cannot set the file path programmatically. The user must select a file via the dialog.
- **`typeMissmatch` has double-'s'** — this is the actual API event name (not a typo to correct). Use `"typeMissmatch"` in layout JSON and `fireTypeMissmatch()` in code.
- **`uploadOnChange: true` vs `upload()`**: if `uploadOnChange` is false, call `upload()` explicitly after the `change` event to start the upload.
- **`editable` vs `enabled`**: `editable` controls whether the text field showing the file path can be typed into (not whether upload works). `enabled` disables the entire control.
- **`sendXHR: false` (default)** = form submit. Set `sendXHR: true` to use XHR and get richer response data in `uploadComplete`.
- **`directory: true`** uploads all files in a directory recursively — use with care; can result in large batches.
- **`style` is a string** (not an enum) — valid values: `Transparent`, `Accept`, `Reject`, `Emphasized`. No enum type page needed.
- **`fileType`** is enforced by firing `typeMissmatch` — it does not prevent the OS file dialog from showing other types.

## Relationships

Related controls: [[b1sdk-input]], [[b1sdk-button]]
Types used: [[enum-valuestate]]

## Sources

- [[03e-controls-picker]] — full property/event/method reference and usage examples
