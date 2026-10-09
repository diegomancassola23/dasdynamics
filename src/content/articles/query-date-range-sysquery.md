---
title: "Filter a query on a date that falls in a validity period"
description: "Two SysQuery::range ranges with dateNull() select records whose start and end dates include a given date."
date: 2014-10-01
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["queries","ranges","dates","sysquery"]
verdict: to-review
verdictNote: "Written for AX 2012; check SysQuery::range with dateNull() on a current D365FO version."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/10/ax-2012-how-to-use-date-range-and-enum.html"
mergedFrom: []
draft: false
---

A common filter: records with a start date and an end date, where a given date must fall in between. With `SysQuery::range` and an open bound on each side, two ranges do it. (The original title also mentioned enums, but the note covers only dates.)

## The original note

Use this code to filter a data source between two dates. The table name in the original was project-specific; it is replaced here with a placeholder.

```xpp
qbds.addRange(fieldNum(MyTable, StartDate))
    .value(SysQuery::range(_requisitionDate, dateNull()));
qbds.addRange(fieldNum(MyTable, EndDate))
    .value(SysQuery::range(dateNull(), _requisitionDate));
```

## References

- No Microsoft Learn page was found for `SysQuery::range`.
