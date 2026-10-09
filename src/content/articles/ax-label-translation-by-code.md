---
title: "AX 2009 and AX 2012: set label translations from code"
description: "Two X++ methods that fill in a label's translation in one or more languages with SysLabel, only where the translation is missing."
date: 2016-02-22
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2009","AX 2012"]
tags: ["labels","translation","syslabel"]
verdict: historical
verdictNote: "Uses the AX 2009/2012 SysLabel API on the label files of that era; D365FO labels are managed in Visual Studio."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2016/02/howto-set-translation-of-label-on-fly.html"
mergedFrom: []
draft: false
---

Translating hundreds of labels one by one in the label editor is slow. These two methods set the translation of existing labels from code, and skip any label that already has a value in the target language.

Then → now: in 2026 I automate label creation and translation in D365FO with an MCP server and Copilot, see [Automating label creation in X++ (D365FO)](/articles/automating-label-creation-xpp/).

## The original note

Use this method to set the value and comment of an existing label, only if the label does not exist yet in a given language. You can run it from code without the developer tools. In my case I set more than 200 label translations in a couple of minutes.

The messages in the code are in Italian, as in the original.

```xpp
void modifyLabel(LabelId _labelId, str _srcLanguage, str _trgLanguace, str _trgString, str _trgComment = '')
{
    SysLabel      srcLang = new SysLabel(_srcLanguage);
    SysLabel      trgLang = new SysLabel(_trgLanguace);

    ;
    _labelId = "@" + _labelId;
    if (!srcLang.exists(_labelId) || !srcLang.extractString(_labelId))
    {
        warning(strfmt("L'etichetta %1 non esiste nella lingua %2", _labelId, srcLang.languageId()));
        return;
    }

    if (trgLang.exists(_labelId) && trgLang.extractString(_labelId))
    {
        warning(strfmt("L'etichetta %1 esiste già nella lingua %2 con il valore %3", _labelId, trgLang.languageId(), trgLang.extractString(_labelId)));
        return;
    }

    cnt += trgLang.modify(_labelId, _trgString, _trgComment ? _trgComment : srcLang.extractComment(_labelId));
    info(strFmt("Modificata etichetta %1 e impostato il testo %2 in lingua %2", _labelId, _trgString));
}
```

This second method does the same for more than one language at once. In my case, for example, the en-us and en-gb translations are the same.

```xpp
void modifyLabelMultipleLanguagese(LabelId _labelId, str _srcLanguage, container _trgLanguaces, str _trgString, str _trgComment = '')
{
    int i;
    str trgLanguace;
    ;
    for(i=1;i<=conlen(_trgLanguaces);i++)
    {
        trgLanguace = conpeek(_trgLanguaces, i);
        modifyLabel(_labelId, _srcLanguage, trgLanguace, _trgString, _trgComment);
    }
}
```

## References

- No current Microsoft Learn page applies to the SysLabel API of AX 2009 and AX 2012.
