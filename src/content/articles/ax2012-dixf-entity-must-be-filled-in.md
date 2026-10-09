---
title: "AX 2012 DIXF: field 'Entity' must be filled in"
description: "After AX 2012 CU9, DIXF can fail with \"Field 'Entity' must be filled in\". Run the CU9 upgrade script or recreate the entity list."
date: 2016-03-11
updated: 2026-10-10
kind: note
track: integrations
versions: ["AX 2012"]
tags: ["dixf","data-import","ax-2012"]
verdict: historical
verdictNote: "Specific to the AX 2012 Data Import/Export Framework after CU9."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2016/03/field-entity-must-be-filled-in-on-dixf.html"
mergedFrom: []
draft: false
---

After installing AX 2012 CU9 or later, DIXF can stop with "Field 'Entity' must be filled in": CU9 added the entity name field, and existing entities do not have it. Two ways to fix it.

Then → now: how I build integrations today is in [D365FO Integration Architecture, Part 1](/articles/integration-architecture-rest-apim-part-1/).

## The original note

On AX 2012 CU9 or later (I found it on CU10, for example), if you get this error you can run this script. It is an upgrade script of CU9: the entity name is a new field added in that version.

```xpp
ReleaseUpdateDB63_DMF releaseUpdateDB63_DMF = new ReleaseUpdateDB63_DMF();
releaseUpdateDB63_DMF.updateEntityType();
```

Or, more simply, delete all entities: when you reopen the entities form, all entities are created again. I know, you don't believe me, but it works.

## References

- No current Microsoft Learn page applies: the fix is specific to AX 2012 DIXF.
