---
title: "Get the translated name of a product color from InventColorId"
description: "Two X++ steps to go from an InventColorId to the product master color record and its translated name."
date: 2015-06-05
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["product-dimensions","color","translations","ecores"]
verdict: to-review
verdictNote: "Written for AX 2012; check the EcoRes methods used here on a current D365FO version."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2015/06/howto-get-ecorescolor-name-by.html"
mergedFrom: []
draft: false
---

`InventDim.InventColorId` holds the color code, but the name users see, possibly translated, lives on the product master. These two steps get from one to the other.

## The original note

**Step 1: retrieve the product master color**

```xpp
select ecoResProductMasterColor where ecoResProductMasterColor.Color == EcoResColor::findByName(inventDim.InventColorId).RecId
    && ecoResProductMasterColor.ColorProductMaster == inventTable.Product
    && ecoResProductMasterColor.ColorProductDimensionAttribute == EcoResProductDimensionAttribute::inventDimFieldId2DimensionAttributeRecId(fieldNum(InventDim, InventColorId))
;
```

**Step 2: get the color translation**

```xpp
EcoResProductMasterDimValueTranslation::findByProductMasterDimValLanguage(ecoResProductMasterColor.RecId, 'it').Name
```

## References

- No Microsoft Learn page was found for these methods.
