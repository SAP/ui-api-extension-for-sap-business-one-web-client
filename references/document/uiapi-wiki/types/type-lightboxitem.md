---
title: "b1.sdk.LightBoxItem"
category: aggregation-type
available_from: "FP 2502"
tags: [aggregations, controls]
source_count: 1
---

## Shape

| Property | Type | Mandatory | Default | ReadOnly | Description |
|---|---|---|---|---|---|
| `guid` | string | **Yes** | N/A | **Yes** | Global unique identifier |
| `imageSrc` | string | **Yes** | `''` | No | Source URL for the image. **If not set, the popup will not open** |
| `alt` | string | No | `''` | No | Alt text for the image |
| `subtitle` | string | No | `''` | No | Subtitle shown below the image in the lightbox |
| `title` | string | No | `''` | No | Title shown above the image in the lightbox |

**Events**: none.  
**Methods**: getter/setter for each property; `focus()`.

## Where used

- [[b1sdk-image]] — `imageContent[]` aggregation (inline in layout JSON)

## Usage

```json
{
  "ctrlType": "b1.sdk.Image",
  "src": "/b1s/v2/Pictures('A00001.jpg')/$value",
  "imageContent": [
    {
      "ctrlType": "b1.sdk.LightBoxItem",
      "guid": "hqtD7AnqS62mIjEscJSPQA",
      "imageSrc": "/b1s/v2/Pictures('A00001.jpg')/$value",
      "alt": "No Original Image",
      "subtitle": "Original Picture",
      "title": "Details"
    }
  ]
}
```

## Notes

`imageSrc` is mandatory in practice even though its documented default is `''` — the popup will not open if it is not set.

## Sources

- [[06b-types-aggregations]] — full property table and usage example
