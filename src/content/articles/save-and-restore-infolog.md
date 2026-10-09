---
title: "Save and restore the infolog"
description: "Capture the current infolog messages with infologData, clear them, and show them again later with infolog.import."
date: 2014-01-03
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["infolog","error-handling","xpp"]
verdict: to-review
verdictNote: "Written for AX 2012; check infologData, import and view on the D365FO infolog and message center."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/01/howto-save-and-restore-infolog.html"
mergedFrom: []
draft: false
---

Sometimes you need to take the messages out of the infolog, run something else, and put them back. The infolog can export its content into an `InfologData` value and import it again.

## The original note

The code is shown as published. The last two lines refer to a variable `x` that is not declared in the snippet.

```xpp
InfologData infologData;

void saveInfolog()
{
    ;
    // here we report something
    error("something awful");
    error("something terrible");
    setprefix("scary");
    warning("mouse");

    // here we get infolog data
    infologData = infolog.infologData();

    infolog.clear(0);
}

void restoreInfolog()
{
    ;
    // here we view infolog once again
    infolog.import(infologData);
}
;

saveInfolog();
restoreInfolog();
infolog.view(x.InfoLogData);
info(Info::infoCon2str(x.InfoLogData));
```

## References

- No Microsoft Learn page was found for these infolog methods.
