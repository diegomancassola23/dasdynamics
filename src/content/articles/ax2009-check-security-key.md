---
title: "AX 2009: check a security key from X++"
description: "Check from X++ whether the current user has full access to a security key in AX 2009, with SecurityKeySet."
date: 2016-03-07
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2009"]
tags: ["security","security-keys","ax-2009"]
verdict: historical
verdictNote: "Security keys belong to the AX 2009 security model; finance and operations apps use role-based security."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2016/03/code-check-security-key-via-x-ax2009.html"
mergedFrom: []
draft: false
---

In AX 2009 access was granted through security keys. This short job checks whether the current user has full (delete) access to a given key. Finance and operations apps grant access through security roles, duties and privileges instead ([Role-based security](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/sysadmin/role-based-security)).

## The original note

With this script you can check from code whether a user has permission on a particular security key.

```xpp
SecurityKeySet securityKeys;
Boolean fullAccess;
;
securityKeys = new SecurityKeySet();
securityKeys.loadUserRights(curuserid());
fullAccess = securityKeys.access(securitykeynum("xxxxxxxxxxxxxxx")) == AccessType::Delete;
info(fullAccess ? "1" : "0");
```

## References

- [Role-based security](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/sysadmin/role-based-security) (Microsoft Learn)
