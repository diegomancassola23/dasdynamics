---
title: "Create counting journal lines from X++"
description: "An AX 2012 X++ loop that fills an inventory counting journal from a temporary table, with dimensions, on-hand and counted quantities."
date: 2014-01-24
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["inventory","counting","journals","xpp"]
verdict: to-review
verdictNote: "Written for AX 2012; check the journal and on-hand methods on D365FO. The code mixes a draft and a suggested replacement."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/01/howto-create-counting-journal.html"
mergedFrom: []
draft: false
---

Counting results often arrive from outside, a scanner or a spreadsheet, and need to become counting journal lines. This snippet loops over a temporary table of counted items and creates one line each.

## The original note

The code is shown as published. Note that, in the middle, it contains a suggestion ("Try replacing the statement...") followed by the replacement code, so the `Counted` assignment appears twice.

```xpp
InventDim inventDim;
InventJournalTrans journalTrans;
TmpImportInventJournal tableBuffer;
InventJournalTable inventJournal;
real lineNum = 1;
TmpImportInventJournal tmpTable; // tmpTable here is used to stored item counting data
InventJournalName inventJournalName;
NumberSeq numberSeq;
;
ttsbegin;

select forupdate * from inventJournal
    where inventJournal.JournalId == inventJournalId;

select firstonly inventJournalName
    where inventJournalName.JournalNameId == InventParameters::find().CountJournalNameId;
numberSeq = NumberSeq::newGetVoucherFromCode(inventJournalName.VoucherSeqId);

while select * from tmpTable
{
    inventDim.clear();
    journalTrans.clear();
    inventDim.initValue();
    inventDim.configId = tmpTable.configId;
    inventDim.inventBatchId = tmpTable.inventBatchId;
    inventDim.InventLocationId = tmpTable.InventLocationId;
    inventDim.inventSerialId = tmpTable.inventSerialId;
    inventDim.InventSiteId = tmpTable.InventSiteId;
    inventDim.wMSLocationId = tmpTable.wMSLocationId;

    inventDim = InventDim::findOrCreate(inventDim);

    journalTrans.Voucher = numberSeq.voucher();
    journalTrans.initValue();
    journalTrans.initFromInventJournalTable(inventJournal);
    journalTrans.LineNum = lineNum;
    journalTrans.JournalType = inventJournal.JournalType;
    journalTrans.TransDate = tmpTable.TransDate;

    journalTrans.ItemId = tmpTable.ItemId;
    journalTrans.initFromInventTable(InventTable::find(tmpTable.ItemId));

    journalTrans.Counted = tmpTable.Counted;

    // Try replacing the statement journalTrans.Counted = tmpTable.Counted with:
    //
    journalTrans.Counted = tmpTable.Counted;
    journalTrans.InventOnHand = InventSumDatePhysicalDim::onHandQty(countDate, itemId, inventDim,tmpInventDimParm);
    //

    journalTrans.InventDimId = inventDim.inventDimId;

    if (journalTrans.validateWrite())
    {
        JournalTrans.insert(NoYes::Yes);
        JournalTrans.inventMovement().journalSetCounted();
        JournalTrans.update();
    }
    //

    lineNum ++;
}

inventJournal.NumOfLines = lineNum -1;
inventJournal.update();

tmpTable.clear();
delete_from tmpTable;

ttscommit;
```

## References

- No Microsoft Learn page was found for these methods.
