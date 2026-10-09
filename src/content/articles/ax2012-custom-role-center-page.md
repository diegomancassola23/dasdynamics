---
title: "AX 2012: show your own page as the Role Center"
description: "An unsupported AX 2012 trick to show an intranet or custom ASPX page as the Role Center without Enterprise Portal installed."
date: 2017-07-20
updated: 2026-10-10
kind: note
track: platform
versions: ["AX 2012"]
tags: ["role-center","enterprise-portal","ax-2012"]
verdict: historical
verdictNote: "Role Center pages and Enterprise Portal were removed in Dynamics AX 7.0; workspaces replace them."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2017/07/ax2012-force-role-center-page-to-your.html"
mergedFrom: []
draft: false
---

In AX 2012 the Role Center was an Enterprise Portal page. If you did not have Enterprise Portal, or did not want to install it, you could still point the Role Center to your own page, such as an intranet or SharePoint site. This note shows how, for testing only. Role Center pages and the Enterprise Portal client were removed as of Dynamics AX 7.0, and the workspace form pattern replaces them ([Removed or deprecated features in previous releases](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/migration-upgrade/deprecated-features)).

## The original note

If you don't have Enterprise Portal installed (or don't want to install it) but want to show your own page to users as the Role Center in Dynamics AX 2012, for example your intranet or SharePoint site, you can do it quite simply.

_Attention: this is not a supported procedure. Do it only for testing._

These are the steps:

1. Create a website on localhost, for example, and put an ASPX page in it.
2. Comment out lines 11 and 12 of the `validate` method on form **EPWebSiteParameters** > Data Sources > WebSiteTable > InternalUrl.
3. Add your website to the Enterprise Portal configuration (System administration > Setup > Enterprise Portal > Web sites).
4. Link your user to an EPRoleCenter profile (System administration > Common > Users > User profiles), for example Accountant.
5. Modify the `getCurrentUsersHomepageURLPath` method of the `ProfileManager` class: comment out the whole code and return your own ASPX page, in my example `default.aspx`.
6. Close the Dynamics AX client and reopen it. Your Role Center is now your own page.

Links from the page into AX can look like this:

```text
menuitemaction://CueRun+CueId=35637150593/
```

In this case, the form related to the cue opens.

Links are handled by the `processLink` method of `SysHelp`. Refer to that class, or to the standard Role Center links, for more information to build your own Role Center page.

## References

- [Removed or deprecated features in previous releases](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/migration-upgrade/deprecated-features) (Microsoft Learn): Role Center pages and Enterprise Portal client.
