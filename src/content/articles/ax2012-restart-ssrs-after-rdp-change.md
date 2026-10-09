---
title: "AX 2012: new report columns stay empty after changing the RDP class"
description: "After changing an AX 2012 report data provider class, new columns showed no data until the Reporting Services service was restarted."
date: 2014-09-18
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["ssrs","rdp","reporting","ax-2012"]
verdict: historical
verdictNote: "AX 2012 deployment behavior; D365FO deploys reports from Visual Studio or through deployable packages."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/09/if-you-modify-report-on-2012-versione.html"
mergedFrom: []
draft: false
---

You add columns to an AX 2012 report, change the RDP class, deploy, compile CIL, and the preview in Visual Studio is fine. In the client the new columns are empty. The fix was a restart.

## The original note

If you modify a report in AX 2012 with SSRS, and after changing the data provider class, changing the layout, deploying and running an incremental CIL compilation:

- in Dynamics AX you see only the new layout of the report, with no data in the new columns;
- in the Visual Studio preview the report works.

The solution is to restart the SQL Server Reporting Services service where it is installed, in my case on the same machine as the AOS.

## References

- [Create and modify reports that use SSRS](https://learn.microsoft.com/en-us/training/modules/build-reports-finance-operations/01-ssrs-reports) (Microsoft Learn training): how reports are deployed in finance and operations apps.
