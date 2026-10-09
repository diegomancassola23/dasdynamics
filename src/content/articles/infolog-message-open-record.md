---
title: "Let users open a record from an infolog message"
description: "Pass SysInfoAction_TableField to info() so a double-click on the message opens the record it refers to, such as a production order."
date: 2014-10-09
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["infolog","user-experience","xpp"]
verdict: to-review
verdictNote: "Written for the AX 2012 infolog; check how SysInfoAction_TableField behaves in the D365FO message center."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/10/tip-automatic-open-entity-when-double.html"
mergedFrom: []
draft: false
---

An infolog message that names a record is more useful when the user can jump to that record. An info action does it with one extra parameter.

## The original note

In this case the user can double-click the message in the infolog to go directly to the production order:

```xpp
info(strfmt("Production order %1 was created", prodTable.ProdId),'', SysInfoAction_TableField::newBuffer(prodTable));
```

## References

- No Microsoft Learn page was found for `SysInfoAction_TableField`.
