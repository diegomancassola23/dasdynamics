---
title: "SSRS: show a value only on the last page"
description: "Compare Globals!PageNumber with Globals!TotalPages to show a value or hide a control only on the last page of an SSRS report."
date: 2014-10-02
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012","D365FO"]
tags: ["ssrs","reporting","expressions"]
verdict: valid
verdictNote: "Still valid SSRS, but only in the page header or footer: PageNumber and TotalPages cannot be used in the report body."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/10/ssrs-show-value-only-on-last-page-in.html"
mergedFrom: []
draft: false
---

Totals, signatures or closing notes often belong only on the last page of a document. In SSRS you can get there with an expression that compares the current page with the total pages. The original title said "in the body of the report", but the note itself ends with the real constraint: these globals only work in the page header and footer.

## In D365FO today

The expression is standard SSRS. Learn confirms the constraint: "**PageNumber** can only be used in an expression in a page header or page footer", and the same holds for **TotalPages** ([Built-in Globals and User references in a paginated report](https://learn.microsoft.com/en-us/sql/reporting-services/report-design/built-in-collections-built-in-globals-and-users-references-report-builder)). To show something on the last page, put it in the page footer.

## The original note

To display a value only on the last page, use an expression like this on the field:

```text
=iif(Globals!PageNumber=Globals!TotalPages,data, nothing)
```

To hide a control only on the last page, use an expression like this on the visibility property:

```text
=iif(Globals!PageNumber=Globals!TotalPages,false,true)
```

Remember that you can use the global properties only in the header and footer sections.

## References

- [Built-in Globals and User references in a paginated report](https://learn.microsoft.com/en-us/sql/reporting-services/report-design/built-in-collections-built-in-globals-and-users-references-report-builder) (Microsoft Learn)
