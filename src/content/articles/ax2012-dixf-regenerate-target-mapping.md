---
title: "AX 2012 DIXF: regenerate the target mapping of an entity"
description: "A job that deletes and regenerates the DIXF target mapping of an AX 2012 entity from code."
date: 2015-03-17
updated: 2026-10-10
kind: note
track: integrations
versions: ["AX 2012"]
tags: ["dixf","data-import","ax-2012"]
verdict: historical
verdictNote: "Uses the AX 2012 DIXF tables DMFTargetXMLToEntityMap and DMFEntity."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2015/03/howto-dixf-how-to-regenerate-target.html"
mergedFrom: []
draft: false
---

After changing an entity in AX 2012 DIXF, the stored target mapping can be out of date. This job deletes it and generates it again.

Then → now: how I build integrations today is in [D365FO Integration Architecture, Part 1](/articles/integration-architecture-rest-apim-part-1/).

## The original note

A sample job to regenerate the target entity mapping from code:

```xpp
static void regenerateDMFTargetMapping(Args _args)
{
    DMFTargetXMLToEntityMap     dmfTargetXMLToEntityMap;
    DMFEntity                   dmfEntity;

    // delete specified target Mapping
    ttsBegin;
        delete_from dmfTargetXMLToEntityMap where dmfTargetXMLToEntityMap.Entity = <EntityName>;
    ttsCommit;

    // Regenerate Target Mapping for specified Entity
    while select dmfEntity where dmfEntity.EntityName = <EntityName>
    {
        DMFTargetXMLToEntityMap::generateMapping(dmfEntity);
    }

    info("All Done!");
}
```

## References

- No current Microsoft Learn page applies to the AX 2012 DIXF tables.
