---
title: "Get the last error message from the infolog"
description: "An X++ snippet that walks the infolog backwards and returns the text of the last error, for logging or for a caller."
date: 2016-02-12
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2009","AX 2012"]
tags: ["infolog","error-handling","xpp"]
verdict: to-review
verdictNote: "Written for AX 2009/2012; check infolog.copy and the container layout of infolog lines on a current D365FO version."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2016/02/howto-get-error-details-from-infolog-by.html"
mergedFrom: []
draft: false
---

When a process fails, you often want the text of the last error, for example to write it to a log table or return it to a caller. This snippet walks the infolog backwards and stops at the first error.

## The original note

You can use this code to get the last error from the infolog. I tested it in all the situations I could think of, with prefixes and other conditions, and it works. Other scripts I found in the past did not work in some situations.

The fallback messages in the code are in Italian, as in the original.

```xpp
int i;
container infoLogCon;
container infoLogItem;
Exception infoLogItemExceptionType;
str infoLogItemMessage;
str strInfoLogMessage;
;
try
{
    infologCon = infolog.copy(1, infolog.line());
    for(i = infolog.line() + 1; i > 1; i--)
    {
        infoLogItem = conpeek(infologCon, i);
        infoLogItemExceptionType = conpeek(infoLogItem, 1);
        infoLogItemMessage = conpeek(infoLogItem, 2);
        if (infoLogItemExceptionType == Exception::Error)
        {
            strInfoLogMessage = infoLogItemMessage;
            strInfoLogMessage = strreplace(strInfoLogMessage, '\t', ' - ');
            break;
        }
    }
    if (!strInfoLogMessage)
        strInfoLogMessage = "Errore non definito";
}
catch
{
    strInfoLogMessage = "Errore sconosciuto";
}
strInfoLogMessage = strltrim(strrtrim(strInfoLogMessage));
```

## References

- No Microsoft Learn page was found that documents `infolog.copy` and the layout of infolog lines.
