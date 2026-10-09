---
title: "Check whether an inventory dimension is active for an item"
description: "Use InventDimGroupSetup and getFieldSetup to check whether a given inventory dimension, such as pallet ID, is active for an item."
date: 2014-01-03
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["inventory-dimensions","dimension-groups","xpp"]
verdict: to-review
verdictNote: "Written for AX 2012; check InventDimGroupSetup and the pallet ID dimension on D365FO."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/01/howto-determine-whether-dimension-for.html"
mergedFrom: []
draft: false
---

Before you read or set an inventory dimension in code, check that it is active in the item's dimension groups. `InventDimGroupSetup` answers that for any `InventDim` field.

## The original note

The code is shown as published.

```xpp
InventTable inventTable;
InventDimGroupSetup inventDimGroupSetup;
InventDimGroupFieldSetup inventDimGroupFieldSetup;

inventDimGroupSetup = InventDimGroupSetup::newInventTable(inventTable);
inventDimGroupFieldSetup = inventDimGroupSetup.getFieldSetup(fieldNum(InventDim,WMSPalletId));

if (inventDimGroupFieldSetup.isActive())
{
    info(strFmt("The palletId dimension is active for dimension group   %1",inventDimGroupSetup.getStorageDimensionGroup()));));
}
```

## References

- No Microsoft Learn page was found for `InventDimGroupSetup`.
