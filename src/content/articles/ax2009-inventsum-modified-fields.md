---
title: "AX 2009: InventSum does not update ModifiedDateTime and ModifiedBy"
description: "In AX 2009, InventSum is updated by direct SQL in InventUpdateOnHand, so the modified fields stay empty. A kernel-level customization adds them."
date: 2015-10-01
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2009"]
tags: ["inventory","inventsum","ax-2009"]
verdict: historical
verdictNote: "A customization of the AX 2009 InventUpdateOnHand class; not applicable as is to later versions."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2015/10/2009-inventsum-dont-update.html"
mergedFrom: []
draft: false
---

To trace when on-hand records change, I switched on the modified date and time fields of `InventSum`, but they stayed empty: the table is updated by a direct SQL statement, not by the usual `update()`. This note explains where, and how I changed it.

## The original note

On my project I needed to know when `InventSum` records were updated, but when I turned on the modified date and time, the field was not updated automatically. Thanks to a Microsoft blog post on the fields ModifiedDateTime and ModifiedBy on table InventSum (linked below), I found a good solution.

Warning: it is a kernel-level solution, so use it with care.

The `InventSum` update is done by a class, `InventUpdateOnHand`. In this class, a method builds the SQL statement for the UPDATE of the `InventSum` table. I customized it to add the modified fields to the UPDATE statement. The customization works only for SQL Server databases.

I shared the XPO of the customization at the time; the download link is not republished here.

In the `sqlUpdateStr` method, you can comment out the `if` clause to debug it at runtime. Remember to restore it in production.

## References

- [Fields ModifiedDateTime and ModifiedBy on table InventSum](http://blogs.technet.com/b/dynamicsaxse/archive/2010/12/29/fields-modifieddatetime-and-modifiedby-on-table-inventsum.aspx) (original link, TechNet blogs)
