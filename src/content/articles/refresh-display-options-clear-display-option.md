---
title: "Refresh a record's display options without requerying"
description: "Call clearDisplayOption on the form data source, then refresh, to redraw a record's display options after its data changes."
date: 2014-04-17
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["forms","display-options","xpp"]
verdict: to-review
verdictNote: "Written for AX 2012; check clearDisplayOption on form data sources in D365FO."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/04/howto-refresh-display-options-at-run.html"
mergedFrom: []
draft: false
---

When a record's colors or other display options depend on its data, they must be recalculated after the data changes. Requerying the form works but is heavy; there is a lighter way.

## The original note

If you need to refresh the display options of a record after an update to the data of the data source, or in any other situation, you don't need to research or requery the database. Use the `clearDisplayOption` method of your data source. The parameter of the method is the updated record.

```xpp
yourTable_ds.clearDisplayOption(yourTable);
yourTable_ds.refresh();
```

## References

- No Microsoft Learn page was found for `clearDisplayOption`.
