---
title: "Caching display methods on forms, and when not to"
description: "Cache display methods with cacheAddMethod or SysClientCacheDataMethodAttribute, but not for controls the user does not see when the form opens."
date: 2016-06-28
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2009","AX 2012","D365FO"]
tags: ["forms","performance","display-methods","caching"]
verdict: valid
verdictNote: "Both cacheAddMethod and SysClientCacheDataMethodAttribute are still documented for finance and operations apps."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2016/06/tip-pay-attention-when-use-caching.html"
mergedFrom: ["https://dynamicsaxnotes.blogspot.com/2014/01/howto-caching-display-methods.html"]
draft: false
---

Caching display methods is a standard performance tip, and I wrote it down twice: in 2014, how to do it in AX 2009 and AX 2012; in 2016, a warning about when the cache makes things slower.

## In D365FO today

Both ways to cache a display method are still documented for finance and operations apps ([Identify and apply caching mechanisms](https://learn.microsoft.com/en-us/training/modules/apply-basic-performance-optimization-finance-operations/2-caching)):

- add the method with `this.cacheAddMethod(tableMethodStr(CustTable, myDisplayMethod));` in the form `init` method, after `super()`;
- or decorate the display method with `[SysClientCacheDataMethodAttribute]`, which adds it to the cache automatically.

## The original note

### How to cache a display method (2014)

**Dynamics AX 2009**: add this line in the form `init` method.

```xpp
public void init()
{
    super();
    this.cacheAddMethod(tablemethodstr(<table>,<display method>), [_updateOnWrite]);
}
```

**Dynamics AX 2012**: add this attribute before the display method declaration.

```xpp
[SysClientCacheDataMethodAttribute([_updateOnWrite])]
display method calcLeagueWon(int _num)
{
    if (juv || haveBoat())
        _num += 2

    return _num;
}
```

### Pay attention when you cache display methods (2016)

A typical performance tip is to put all display methods of a data source in the cache, with something like this in the `init` method of the data source:

```xpp
this.cacheAddMethod(tableMethodStr(CustTable, Name));
```

Pay attention: the value of all cached methods is set when the data is fetched from the database. If you put a display method on a separate tab, not visible when the form opens, the method is still called for each record of the data source when the form starts. If the display method is complex, that causes a performance problem. If you remove the method from the cache, it is called only when the control appears to the user.

So add the method to the cache only if the control is visible to the user in the main grid or main tab. Otherwise, check whether the cache really improves performance.

## References

- [Identify and apply caching mechanisms](https://learn.microsoft.com/en-us/training/modules/apply-basic-performance-optimization-finance-operations/2-caching) (Microsoft Learn training)
- Original sources: [MSDN, caching display methods](https://msdn.microsoft.com/en-us/library/aa596691.aspx) and [Caching of display methods](http://ax-dynamics.blogspot.it/2007/08/caching-of-display-methods.html), as cited in the 2014 note.
