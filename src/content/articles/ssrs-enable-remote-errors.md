---
title: "Enable remote errors on SQL Server Reporting Services"
description: "See the real SSRS error from a remote client: set EnableRemoteErrors in the report server ConfigurationInfo table and restart the service."
date: 2015-03-19
updated: 2026-10-10
kind: note
track: platform
versions: ["AX 2012"]
tags: ["ssrs","reporting","troubleshooting"]
verdict: valid
verdictNote: "Still documented for SSRS native mode, only on a development VM or an on-premises SSRS; not possible in Microsoft-managed sandbox or production."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2015/03/howto-enable-remote-errors-on-ssrs.html"
mergedFrom: []
draft: false
---

By default SSRS hides the details of an error from remote clients and tells you to "enable remote errors". On an AX 2012 report server this is the quickest way to do it.

## In D365FO today

This is an SSRS setting, not a D365FO one. For SSRS in native mode, Learn documents the same table edit and adds a caveat ([Enable remote errors (Reporting Services)](https://learn.microsoft.com/en-us/sql/reporting-services/report-server/enable-remote-errors-reporting-services)):

- you can edit the `ConfigurationInfo` table to set `EnableRemoteErrors` to True, "but if the report server is actively used, you should use SQL Server Management Studio or script to modify the settings";
- after a change in the database, "you need to restart the Reporting Services service before the changes take effect".

## The original note

Enabling remote errors for SSRS is very simple. The setting is stored in the `ConfigurationInfo` table of the report server database. Open the table and set `EnableRemoteErrors` to true. Then restart the SSRS service.

## References

- [Enable remote errors (Reporting Services)](https://learn.microsoft.com/en-us/sql/reporting-services/report-server/enable-remote-errors-reporting-services) (Microsoft Learn)
