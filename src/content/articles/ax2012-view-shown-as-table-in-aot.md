---
title: "AX 2012: a standard view shows up as a table in the AOT"
description: "A standard view appeared under Tables and synchronization failed. The fix restored its properties in the model store with SQL from a baseline."
date: 2015-04-07
updated: 2026-10-10
kind: note
track: platform
versions: ["AX 2012"]
tags: ["model-store","sql","synchronization","ax-2012"]
verdict: historical
verdictNote: "A direct SQL fix on the AX 2012 model store database."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2015/04/today-i-found-strange-error-in.html"
mergedFrom: []
draft: false
---

One day a standard view moved under the Tables node of the AOT in a development environment, and database synchronization failed. This note records how I fixed it by copying the element's properties from another model store.

## The original note

Today I found a strange error in the development environment. I don't know what triggered it, but a standard view became visible under the Tables node and synchronization failed.

Searching, I found a Dynamics Community thread and then another one that goes deeper (both linked below).

In my case I solved it with a direct SQL patch. The solution is to restore the element properties in the model database, copying them from another standard model store or, as in my case, from the production database.

1. Stop the development AOS.
2. Remove any references to the object from the `SQLDictionary` table.
3. Remove the view from the database (check whether a table with the same name exists too).
4. Check the object properties in the model database:

```sql
SELECT m.ElementType, m.Name, m.AxId, md.LayerId, manifest.DisplayName, md.Properties as Metadata
FROM [dbo].ModelElement AS m
INNER JOIN [dbo].ModelElementData AS md
    ON m.ElementHandle = md.ElementHandle
INNER JOIN [dbo].ModelManifest AS manifest
    ON md.ModelId = manifest.ModelId
    AND m.ElementType = 44 AND m.Name = 'DirPartyLookupGridView'
```

5. Check the object properties in the other model database:

```sql
SELECT m.ElementType, m.Name, m.AxId, md.LayerId, manifest.DisplayName, md.Properties as Metadata
FROM MicrosoftDynamicsAXBaseline.[dbo].ModelElement AS m
INNER JOIN MicrosoftDynamicsAXBaseline.[dbo].ModelElementData AS md
    ON m.ElementHandle = md.ElementHandle
INNER JOIN MicrosoftDynamicsAXBaseline.[dbo].ModelManifest AS manifest
    ON md.ModelId = manifest.ModelId
    AND m.ElementType = 44 AND m.Name = 'DirPartyLookupGridView'
```

6. Update the object properties, copying them from the other model database:

```sql
UPDATE md SET md.Properties = md_base.Properties
FROM [dbo].ModelElement AS m
INNER JOIN [dbo].ModelElementData AS md
    ON m.ElementHandle = md.ElementHandle
INNER JOIN MicrosoftDynamicsAXBaseline.[dbo].ModelElement AS m_base
    ON m.ElementType = m_base.ElementType AND m.Name = m_base.Name
INNER JOIN MicrosoftDynamicsAXBaseline.[dbo].ModelElementData AS md_base
    ON m_base.ElementHandle = md_base.ElementHandle
    AND m_base.ElementType = 44 AND m_base.Name = 'DirPartyLookupGridView' AND md_base.LayerId = 0
```

Warning: use the script at your own risk, and evaluate the impact on your environment and on your support agreement.

## References

- [Dynamics Community thread 118864](http://community.dynamics.com/ax/f/33/t/118864.aspx) (original link)
- [Dynamics Community thread 119471](http://community.dynamics.com/ax/f/33/p/119471/249240.aspx) (original link)
