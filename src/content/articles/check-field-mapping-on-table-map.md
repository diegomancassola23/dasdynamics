---
title: "Check whether a map field is mapped on the current table"
description: "Use Global::mappingExists in a table map method before writing a field that is not mapped on every table of the map."
date: 2015-05-04
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["table-maps","xpp"]
verdict: to-review
verdictNote: "Global::mappingExists was documented on MSDN for AX 2012; check it on a current D365FO version."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2015/05/howto-check-is-field-is-mapped-to-field.html"
mergedFrom: []
draft: false
---

When you add a field to a table map but cannot map it on every table, any map method that writes the field fails on the tables where it is not mapped. Check the mapping first.

## The original note

If you add a new field to a map but cannot map it on all the tables, the common methods of the map must check whether the field is mapped on the table you are going to update. If you don't, the system raises an error.

To do this, use the `Global::mappingExists` function. An example:

```xpp
if (Global::mappingExists(tableNum(SalesPurchLine), this.TableId, fieldNum(SalesPurchLine, MYFIELD)))
    this.MYFIELD = AVALUE;
```

Check the MSDN documentation of `mappingExists` for details.

## References

- [Global::mappingExists](https://msdn.microsoft.com/en-us/library/global.mappingexists.aspx) (original link, MSDN)
