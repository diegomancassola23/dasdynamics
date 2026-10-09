---
title: "Find a product variant from its master and dimension values"
description: "Get the RecId of a distinct product variant from the product master and its configuration, size and color values."
date: 2014-01-03
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["products","product-variants","ecores"]
verdict: to-review
verdictNote: "Written for AX 2012; check EcoResProductVariantExistMgr and EcoResProductVariantDimValue on D365FO."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/01/howto-find-reference-for-product.html"
mergedFrom: []
draft: false
---

With the AX 2012 product model, a variant is its own record. Given the product master and the dimension values, these two calls return the variant's surrogate key.

## The original note

The code is shown as published, with the typographic quotes of the original replaced by plain quotes.

```xpp
// which has following product dimensions:
// configuration – 001
// size – XL
// color - Red

EcoResDistinctProductVariantRecId productVariantRecId;
container productDimensions = EcoResProductVariantDimValue::getDimensionValuesContainer("001", "XL", "Red");

// find product variant surrogate key for product master and specified product dimensions

productVariantRecId = EcoResProductVariantExistMgr::findVariantByMasterAndDimensions(productMaster.RecId, productDimensions));
```

## References

- No Microsoft Learn page was found for these methods.
