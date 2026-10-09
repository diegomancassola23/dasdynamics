---
title: "OData to sandbox or production: the underlying connection was closed"
description: "A .NET OData client fails against D365FO sandbox or production with \"The underlying connection was closed\". The cause is TLS 1.2."
date: 2018-01-04
updated: 2026-10-10
kind: note
track: integrations
versions: ["D365FO"]
tags: ["odata","tls","dotnet"]
verdict: valid
verdictNote: "Finance and operations apps support only TLS 1.2, so a client that does not negotiate it still fails."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2018/01/d365ffo-underlying-connection-was.html"
mergedFrom: []
draft: false
---

A .NET client that worked against a development box failed as soon as it pointed to a UAT or production environment, with "The underlying connection was closed: An unexpected error occurred on a send". The cause was the TLS version negotiated by the client.

Then → now: the full troubleshooting list for TLS errors in .NET clients is in [Resolving the "SSL/TLS Secure Channel" Error in .NET Applications](/articles/ssl-tls-secure-channel-error-dotnet/).

## In D365FO today

The point still holds: "Finance and operations apps support only TLS 1.2. Earlier TLS versions 1.0 and 1.1 aren't supported." ([Encryption in finance and operations apps](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/sysadmin/encryption)). So a client that does not negotiate TLS 1.2 cannot connect.

## The original note

As reported in a Dynamics community thread, when you connect to a UAT or production environment with OData, the client reports this error: "The underlying connection was closed: An unexpected error occurred on a send".

The fix is to add this line before you open the connection:

```csharp
System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
```

## References

- [Encryption in finance and operations apps](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/sysadmin/encryption) (Microsoft Learn)
- [Original community thread](https://community.dynamics.com/ax/f/33/t/227417) (Dynamics Community)
