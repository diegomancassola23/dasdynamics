---
title: "What Closed and ClosedQty mean on InventSum"
description: "ClosedQty marks an on-hand record with all quantities at zero; Closed marks one whose monetary balance is zero, usually after inventory close."
date: 2014-01-13
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["inventory","inventsum","inventory-close"]
verdict: to-review
verdictNote: "Not verified on Learn; check the meaning of both flags and when inventory close sets Closed on a current version."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/01/closed-and-closedqty-in-inventsum-table.html"
mergedFrom: []
draft: false
---

Two flags on `InventSum` look alike but mean different things: one is about quantities, the other about value. Knowing which is which matters when you write queries on on-hand.

## The original note

The `ClosedQty` flag means that all quantities for the given item and inventory dimensions are zero: no item in stock, no item being received or shipped, and the item is not expected to be sold, purchased or produced.

The `Closed` flag means that the monetary balance for the given item and inventory dimensions is zero. Basically, all the costs related to the item were written off from the inventory account to COGS, WIP and so on. Usually the `Closed` flag is set by inventory close (but in simple cases it can be set immediately when an inventory issue is posted).

## References

- No Microsoft Learn page was found that documents these two fields.
