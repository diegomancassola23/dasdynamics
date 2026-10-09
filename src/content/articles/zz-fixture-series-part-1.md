---
title: "Fixture: integration architecture, part 1"
description: "Fixture article for layout testing. A LinkedIn-era article in a series. Delete at merge."
date: 2026-04-30
kind: article
track: integrations
versions: ["D365FO"]
tags: ["apim", "integration"]
originalUrl: "https://www.linkedin.com/pulse/example-fixture/"
series: "integration-architecture"
seriesPart: 1
cover: "APIM"
draft: false
---

This is fixture text used only to develop the layout. It will be deleted when the `content` branch is merged.

## Context

A paragraph with **bold**, *italic*, `inline code` and a [link to Microsoft Learn](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/).

- A list item
- Another list item

> A quote, to see how blockquotes look.

## Code samples

```xpp
public final class FixtureService
{
    public static void main(Args _args)
    {
        CustTable custTable;
        select firstonly custTable;
        info(strFmt("%1", custTable.AccountNum));
    }
}
```

```sql
SELECT TOP 10 ACCOUNTNUM FROM CUSTTABLE WHERE DATAAREAID = 'usmf';
```

```powershell
Get-Service | Where-Object Status -eq 'Running'
```

```json
{ "fixture": true, "parts": 1 }
```

| Column | Value |
| --- | --- |
| Fixture | Yes |
