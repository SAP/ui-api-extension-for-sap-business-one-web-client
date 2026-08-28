---
title: "b1.sdk.Image"
type: control
available_from: "FP 2502"
tags: [controls, display]
source_count: 1
---

## What it is

Displays an image from a relative or absolute URL. When `imageContent` is populated with `LightBoxItem` entries, clicking the image opens a lightbox popup with a full-size view. Supports lazy loading for offscreen images.

## Properties

| Property | Type | Default | ReadOnly | Description |
|---|---|---|---|---|
| `guid` | string | N/A | Yes | Global unique identifier |
| `label` | string | `''` | No | Field label |
| `hideLabel` | boolean | `false` | **Yes** | Whether to hide the label — setter is a no-op |
| `tooltip` | string | `''` | No | Hover tooltip text |
| `src` | string | `''` | No | URL of the image — relative or absolute; see CSP note |
| `width` | string | `''` | No | Width in CSS units |
| `height` | string | `''` | No | Height in CSS units |
| `alt` | string | `''` | No | Alt text displayed when the image cannot load |
| `lazyLoading` | boolean | `false` | No | Enable lazy loading for offscreen images |
| `visible` | boolean | `true` | No | Whether the control is shown |
| `imageContent` | LightBoxItem[] | `[]` | No | Lightbox popup items — see [[type-lightboxitem]] |

## Events

| Event | Parameters | Description |
|---|---|---|
| `load` | — | Fired when the image resource finishes loading |
| `press` | — | Fired when the user clicks the image |

## Methods

| Method | Available | Description |
|---|---|---|
| `focus()` | †FP 2502 | Sets focus to the control |
| `fireLoad()` | FP 2508 | Programmatically fires `load` |
| `firePress()` | FP 2508 | Programmatically fires `press` |

†Availability not explicitly stated in source; assumed FP2502 (control launch).

## Aggregations

| Name | Type | Notes |
|---|---|---|
| `imageContent` | LightBoxItem[] | Entries for the lightbox popup; see [[type-lightboxitem]] |

`LightBoxItem` fields: `guid`, `imageSrc`, `alt`, `subtitle`, `title`. Access via `getImageContent()` which returns an array; each item has typed getters/setters.

## Usage pattern

**Layout JSON:**
```json
{
  "guid": "OWk793OSSMOmT1eqVMA2bQ",
  "ctrlType": "b1.sdk.Image",
  "label": "Product Photo",
  "src": "/b1s/v2/Pictures('A00001.jpg')/$value",
  "width": "100px",
  "height": "100px",
  "alt": "No image available",
  "lazyLoading": true,
  "imageContent": [
    {
      "ctrlType": "b1.sdk.LightBoxItem",
      "guid": "hqtD7AnqS62mIjEscJSPQA",
      "imageSrc": "/b1s/v2/Pictures('A00001.jpg')/$value",
      "alt": "No original image",
      "subtitle": "Product image",
      "title": "Details"
    }
  ],
  "load": { "procName": "onImageLoad" }
}
```

**Controller:**
```javascript
const oView = await oEnv.ActiveView();
const oImage = await oView.Image("OWk793OSSMOmT1eqVMA2bQ");

// Update the image source
await oImage.setSrc("/b1s/v2/Pictures('A00002.jpg')/$value");
await oImage.setWidth("200px");
await oImage.setHeight("150px");
await oImage.setAlt("Updated alt text");
await oImage.setLazyLoading(false);

// Access lightbox items
const contents = await oImage.getImageContent();
const firstItem = contents[0];
await firstItem.setImageSrc("/b1s/v2/Pictures('A00002.jpg')/$value");
await firstItem.setSubtitle("Updated subtitle");
await firstItem.setTitle("Updated title");

console.log(await oImage.getSrc());
await oImage.focus();
```

## Gotchas and traps

- **CSP constraint for external URLs**: if `src` points to an external domain, that domain must be listed in your extension's Content Security Policy (`allowedExternalURLs`). Images from unlisted domains will be blocked.
- **`imageContent` items are set in layout JSON** — the lightbox popup is configured statically; items can be updated at runtime via `getImageContent()[n].setX()`.
- **`hideLabel` is ReadOnly** — set in layout JSON only.
- `lazyLoading` is useful for views with many images but adds a brief delay before offscreen images appear.

## Relationships

Types used: [[type-lightboxitem]]
Concept: [[service-api]] (for Service Layer image URLs like `/b1s/v2/Pictures(...)/$value`)

## Sources

- [[03g-controls-display]] — full property/event/method reference and usage examples
