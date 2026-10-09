---
title: "Mark a method as obsolete with SysObsoleteAttribute"
description: "Decorate a method with SysObsoleteAttribute so the compiler warns, or fails, when code still calls it, and points to the replacement."
date: 2014-01-03
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012","D365FO"]
tags: ["attributes","compiler","refactoring"]
verdict: valid
verdictNote: "SysObsoleteAttribute is still documented in the X++ attribute classes reference."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/01/tip-using-of-sysobsoleteattribute.html"
mergedFrom: []
draft: false
---

When you replace a method, you want callers to find out at compile time, with a message that tells them what to use instead. `SysObsoleteAttribute` does exactly that.

## In D365FO today

The attribute is documented in [X++ attribute classes](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/dev-ref/xpp-attribute-classes): it can make the compile fail when the method is called, displaying the message stored in the attribute, or make the compiler issue warnings instead of errors. The Learn example uses `[SysObsoleteAttribute("The Automobile class might have faster performance.", false)]`.

## The original note

```xpp
[SysObsoleteAttribute('Use method Args::create() instead', true)]
public static Args create(container _pack)
{
    Args sysArgs = new Args();
    sysArgs.unpack(_pack);
    return sysArgs;
}
```

## References

- [X++ attribute classes](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/dev-ref/xpp-attribute-classes) (Microsoft Learn)
