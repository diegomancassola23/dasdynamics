---
title: "\"The enumerator does not designate a valid element\" in CIL"
description: "In code that runs in CIL, set Map and Set enumerators to null before changing the collection, or a remove throws this error."
date: 2014-01-13
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["collections","map","set","cil"]
verdict: to-review
verdictNote: "Observed in AX 2012 CIL; check Map and Set enumerators in D365FO, where all X++ compiles to CIL."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/01/the-enumerator-does-not-designate-valid.html"
mergedFrom: []
draft: false
---

Code that changed a `Map` while an enumerator was still alive worked in the client and failed in batch, where AX 2012 ran it in CIL. The difference is the enumerator.

## The original note

When your code runs in CIL, remember to set any enumerator of a `Set` or `Map` to null before you change the collection. If the enumerator is not reset to null, a remove from a `Map` throws the error "The enumerator does not designate a valid element."

## References

- [X++ language reference](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/dev-ref/xpp-language-reference) (Microsoft Learn): "X++ source code compiles to Microsoft .NET CIL".
