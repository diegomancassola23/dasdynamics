---
title: "Find a product master by product number"
description: "Get the EcoResProductMaster buffer from a product number with EcoResProduct::findByProductNumber."
date: 2014-01-03
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["products","ecores"]
verdict: to-review
verdictNote: "Written for AX 2012; check EcoResProduct::findByProductNumber on D365FO."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/01/howto-find-product-master-record-by.html"
mergedFrom: []
draft: false
---

The product number is what users know; the product master record is what the code needs. One call gets you from one to the other.

## The original note

```xpp
EcoResProductMaster productMaster;

// find product master buffer by providing product number

productMaster = EcoResProduct::findByProductNumber("MyProductMAster");
```

## References

- No Microsoft Learn page was found for this method.
