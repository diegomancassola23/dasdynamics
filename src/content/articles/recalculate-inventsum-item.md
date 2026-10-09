---
title: "Recalculate on-hand (InventSum) for an item"
description: "Rebuild the InventSum records of one item from its inventory transactions with InventSumRecalcItem."
date: 2014-01-13
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["inventory","inventsum","on-hand"]
verdict: to-review
verdictNote: "Written for AX 2012; check InventSumRecalcItem and the supported on-hand consistency check on D365FO."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/01/recalculate-inventsum.html"
mergedFrom: []
draft: false
---

When the on-hand of an item no longer matches its inventory transactions, the `InventSum` records can be recalculated from the transactions. In AX 2012 one class did it for a single item.

## The original note

```xpp
InventSumRecalcItem InventSumRecalcItem;
;
InventSumRecalcItem = new InventSumRecalcItem("ITEM001", true);
InventSumRecalcItem.updatenow();
```

## References

- No Microsoft Learn page was found for `InventSumRecalcItem`.
