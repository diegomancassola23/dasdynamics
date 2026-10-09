---
title: "AX 2009: update the quantity of a purchase order line from code"
description: "The AX 2009 calls needed to change PurchQty on a purchase line from X++ so that related quantities and inventory stay consistent."
date: 2016-02-01
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2009"]
tags: ["purchasing","purchline","inventory","ax-2009"]
verdict: to-review
verdictNote: "Written for AX 2009; whether PurchLine::modifyPurchQty and InventMovement::bufferSetRemainQty still exist and behave the same in D365FO is not checked."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2016/02/howto-update-purchqty-of-purchline.html"
mergedFrom: []
draft: false
---

Setting `PurchQty` on a purchase line and calling `update()` is not enough: the derived quantities and the remaining inventory quantity must follow. In AX 2009 these were the calls to make.

## The original note

Use this script to update the purchase quantity of a purchase line:

```xpp
ttsbegin;
_pLine.PurchQty = q;
PurchLine::modifyPurchQty(_pLine, InventDim::find(_pLine.InventDimId), avoidBox);
InventMovement::bufferSetRemainQty(_pLine);
_pLine.update();
ttscommit;
```

## References

- No current Microsoft Learn page applies to this AX 2009 code.
