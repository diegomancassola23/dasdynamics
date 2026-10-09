---
title: "AX 2012: turn off the Synchronize database form"
description: "A job that sets the SysSqlSync global cache flag so AX 2012 synchronizes without showing the Synchronize database form."
date: 2015-11-11
updated: 2026-10-10
kind: note
track: platform
versions: ["AX 2012"]
tags: ["database-synchronization","global-cache","ax-2012"]
verdict: historical
verdictNote: "Specific to database synchronization in the AX 2009/2012 client."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2015/11/howto-turning-off-synchronize-database.html"
mergedFrom: []
draft: false
---

In AX 2012 the Synchronize database form can pop up in the middle of a script and wait for the user. A global cache flag turns it off.

## The original note

The Synchronize database form may show up unexpectedly during some of your scripts. You can turn it on or off from code with the `ShowSysSqlSync` setting of the `SysSqlSync` global cache. This job turns off the form and synchronizes automatically:

```xpp
static void ShowSysSqlSync(Args _args)
{
    SysGlobalCache gc;
    str owner = 'SysSqlSync';
    str key   = 'ShowSysSqlSync';
    boolean showEnabled = false; //set to true to enable.
    ;
    gc = appl.globalCache();
    gc.set(owner, key, showEnabled);
    info(strfmt('Show SqlSync: %1', gc.get(owner, key)));
}
```

More information was in the MSDN post on synchronization enhancements in Dynamics AX 2009 (linked below).

## References

- [Synchronization enhancements in Dynamics AX 2009](http://blogs.msdn.com/b/daxis/archive/2009/04/26/synchronization-enhancements-in-dynamics-ax-2009.aspx) (original link, MSDN blogs)
