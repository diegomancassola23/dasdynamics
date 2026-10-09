---
title: "Loop over the selected records of a form with MultiSelectionHelper"
description: "Iterate the records a user selected in a grid with MultiSelectionHelper, from a form or from a class called by a menu item."
date: 2014-01-03
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["forms","multi-select","xpp"]
verdict: to-review
verdictNote: "Written for AX 2012; check MultiSelectionHelper on D365FO."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/01/howto-multiselectionhelper.html"
mergedFrom: []
draft: false
---

When an action must run on every record the user marked in a grid, `MultiSelectionHelper` walks the selection for you.

## The original note

The code is shown as published: note that the loop condition tests `transFilm`, while the records are read into `record`.

```xpp
MultiSelectionHelper helper;
;
helper = MultiSelectionHelper::construct();
helper.parmDatasource(_formDataSource);
record = helper.getFirst();
while (transFilm.RecId != 0)
{
    /*Do something*/
    record = helper.getNext();
}
```

## References

- No Microsoft Learn page was found for `MultiSelectionHelper`.
