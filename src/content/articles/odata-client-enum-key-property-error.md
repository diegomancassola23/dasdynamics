---
title: "OData client error: only properties of simple type can be key properties"
description: "A 2018 OData client bug: an enum field in a data entity key broke the NuGet OData client; the workaround was Microsoft's custom OData DLLs."
date: 2018-01-05
updated: 2026-10-10
kind: note
track: integrations
versions: ["D365FO"]
tags: ["odata","data-entities","dotnet","nuget"]
verdict: historical
verdictNote: "A 2018 bug in the OData client libraries of the time, with a workaround tied to those packages."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2018/01/d365ffo-systeminvalidoperationexception.html"
mergedFrom: []
draft: false
---

In early 2018, a .NET client that consumed D365FO data entities through the OData client from NuGet failed when an entity had an enum field in its primary key. This note records the error and the workaround of the time.

Then → now: for how I design integrations today, see [D365FO Integration Architecture, Part 1](/articles/integration-architecture-rest-apim-part-1/).

## The original note

There was a known bug when you used the OData references from NuGet. If a data entity has an enum field in its primary key, the client reports this error:

```text
An unhandled exception of type 'System.InvalidOperationException' occurred in Microsoft.OData.Client.dll
Additional information: The key property 'Type' on for type
'ProductsApp4.Microsoft.Dynamics.DataEntities.LegalEntityContact' is of
type 'System.Nullable`1[[ProductsApp4.Microsoft.Dynamics.DataEntities.LogisticsElectronicAddressMethodType, ProductsApp4, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]]', which is not a simple type. Only properties of simple type can be key properties.
```

To resolve it, remove the NuGet references from the project and use the custom OData DLLs published in the [Dynamics-AX-Integration repository](https://github.com/Microsoft/Dynamics-AX-Integration/tree/master/Packages).

Pay attention if you install the client on Windows 7 x64 or Vista x64 and get an error like this:

```text
{"Could not load file or assembly 'TheAssemblyYouHaveReferenced' or one of its dependencies. Strong name validation failed. (Exception from HRESULT: 0x8013141A)":"TheAssemblyYouHaveReferenced'}
```

In that case, refer to the MSDN blog post on strong name validation failures (linked below).

## References

- [Dynamics-AX-Integration, Packages folder](https://github.com/Microsoft/Dynamics-AX-Integration/tree/master/Packages) (GitHub, Microsoft)
- [Strong name validation failed (Exception from HRESULT: 0x8013141A)](https://blogs.msdn.microsoft.com/keithmg/2012/03/20/strong-name-validation-failed-exception-from-hresult-0x8013141a/) (original link, MSDN blogs)
