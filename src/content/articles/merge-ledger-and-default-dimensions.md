---
title: "Merge a ledger dimension with default dimensions in X++"
description: "AX 2012: combine a ledger dimension with one or more default financial dimensions with DimensionDefaultingService::serviceCreateLedgerDimension."
date: 2015-04-07
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["financial-dimensions","ledger","xpp"]
verdict: to-review
verdictNote: "Written for AX 2012; check DimensionDefaultingService and its current replacement on D365FO."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2015/04/ax-2012-merge-ledger-and-financial.html"
mergedFrom: []
draft: false
---

A common need when you build journal lines in code: take a main account combination and apply the default dimensions of a customer, vendor or other source. In AX 2012 one call did it.

## The original note

To merge a ledger dimension with one or more default financial dimensions, use this call:

```xpp
DimensionDefaultingService::serviceCreateLedgerDimension(ledgerDimension, customerDefaultDimension);
```

You can merge more than two dimensions: you can pass several default dimensions to merge.

More details and a real implementation are in the Dynamics Community post linked below.

## References

- [AX 2012: merge ledger and financial dimensions using X++ code](http://community.dynamics.com/ax/b/dynamicsaxconcoction/archive/2014/07/25/ax-2012-merge-ledger-and-financial-dimensions-using-x-code.aspx) (original link, Dynamics Community)
