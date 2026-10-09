---
title: "Create a transfer order from X++"
description: "An AX 2012 X++ snippet that creates a transfer order header and one line, with number sequence, warehouses and inventory dimensions."
date: 2014-10-09
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["inventory","transfer-orders","xpp"]
verdict: to-review
verdictNote: "Written for AX 2012; check the InventTransferTable and InventTransferLine initialization methods on a current D365FO version."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/10/howto-create-transfer-order-by-code-x.html"
mergedFrom: []
draft: false
---

Creating a transfer order in code means more than inserting two records: the header takes its number from the number sequence and its defaults from the warehouses, and the line needs the item, the quantities and the inventory dimensions of the source warehouse.

## The original note

```xpp
NumberSeq numberSeq;
InventTransferTable inventTransferTable;
InventTransferLine inventTransferLine;
InventDim inventDim;
;

ttsbegin;
numberSeq = NumberSeq::newGetNum(InventParameters::numRefTransferId());

inventTransferTable.clear();
inventTransferTable.initValue();
inventTransferTable.TransferId = numberSeq.num();
numberSeq.used();

inventTransferTable.InventLocationIdFrom = _inventLocationIdFrom;
inventTransferTable.modifiedField(fieldNum(InventTransferTable,InventLocationIdFrom));
inventTransferTable.InventLocationIdTo = _inventLocationIdTo;
inventTransferTable.modifiedField(fieldNum(InventTransferTable,InventLocationIdTo));
inventTransferTable.insert();

inventTransferLine.clear();
inventTransferLine.initFromInventTransferTable(inventTransferTable, NoYes::Yes);
inventTransferLine.ItemId = _itemId;
inventTransferLine.initFromInventTable(InventTable::find(_itemId));
inventTransFerLine.LineNum = InventTransferLine::lastLineNum(inventTransferTable.TransferId) + 1;
inventTransferLine.QtyTransfer = _qty;
inventTransferLine.QtyRemainReceive = _qty;
inventTransferLine.QtyRemainShip = _qty;
inventTransferLine.QtyShipNow = 0;
inventTransferLine.QtyReceiveNow = 0;
inventDim = inventTransferLine.inventDim();
inventDim.InventSiteId = InventLocation::find(inventTransferTable.InventLocationIdFrom).InventSiteId;
inventDim.InventLocationId = inventTransferTable.InventLocationIdFrom;
inventTransferLine.InventDimId = inventDim::findOrCreate(inventDim).inventDimId;
inventTransferLine.insert();
ttscommit;
```

## References

- No Microsoft Learn page was found for these table methods.
