---
title: "Get electronic address locators of a party by role"
description: "When findElectronicAddressByRole no longer fits custom roles, DirParty::electronicAddressLocatorsByRole returns the locators for a party and role."
date: 2014-11-14
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["global-address-book","contact-information","dirparty"]
verdict: to-review
verdictNote: "Written for AX 2012; check DirParty::electronicAddressLocatorsByRole on a current D365FO version."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2014/11/howto-retrive-list-of-locator-of.html"
mergedFrom: []
draft: false
---

Contact information such as e-mail addresses can be tagged with purposes (roles), including custom ones. To read the addresses of a party for a given role, use the method that takes the role name.

## The original note

The AX 2012 method `findElectronicAddressByRole` is deprecated in the latest version.

In the latest version you can define custom roles and use them for custom electronic addresses. This means you can no longer use the standard method to retrieve the address.

This method retrieves the list of locators and returns a container:

```xpp
LogisticsLocationRoleName logisticsLocationRoleName;
container results;
int i;
;
logisticsLocationRoleName = "CustomRole";

results = DirParty::electronicAddressLocatorsByRole(
    [PartyId],
    [LogisticsElectronicAddressMethodType],
    logisticsLocationRoleName);

for(i=1;i<=conLen(results);i++)
{
    info(conPeek(results, i));
}
```

## References

- No Microsoft Learn page was found for this method.
