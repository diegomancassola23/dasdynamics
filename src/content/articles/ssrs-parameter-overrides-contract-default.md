---
title: "AX 2012 SSRS: the report parameter overrides the data contract default"
description: "In AX 2012, the parameter stored in the SSRS report overrides the default set in the data contract parm method, even for a hidden parameter."
date: 2014-09-19
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["ssrs","data-contracts","reporting"]
verdict: to-review
verdictNote: "Seen on the AX 2012 SSRS framework; the same precedence of report parameters over contract defaults has not been checked on D365FO."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/09/the-report-parameters-are-overridden-by.html"
mergedFrom: []
draft: false
---

A default value set in a data contract `parm` method looked like a simple way to pass a hidden value to an AX 2012 report. It did not work: the parameter stored in the report won.

## The original note

The report parameters are overridden by the parameters in the SSRS report. (The original note showed a screenshot of the report parameter properties from a third-party blog; it is not reproduced here.)

The Dynamics AX SSRS engine ignores a default like this one:

```xpp
[DataMemberAttribute, SysOperationControlVisibilityAttribute(false)]
public LogisticsAddressing parmAddress(LogisticsAddressing _address = companyAddress)
{
    companyAddress = _address;
    return companyAddress;
}
```

## References

- No current Microsoft Learn page applies.
