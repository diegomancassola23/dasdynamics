# LinkedIn texts for the launch (draft)

Texts to paste on LinkedIn once https://dasdynamics.dev is live over HTTPS. Order: profile, articles, Blogger (see `docs/blogger-farewell.md`), then the announcement post last.

## 1. Profile

**Contact info → Website**: `https://dasdynamics.dev`, type *Blog*.

**About** (the section does not exist yet):

```text
Technical Solution Architect at PA Expertise – Alveo group. I work on Microsoft Dynamics 365 Finance & Operations: architecture, integrations with Azure API Management and Azure Functions, X++, and AI inside the ERP.

I write about it at https://dasdynamics.dev: new articles, and the notes from my old Dynamics AX blog, each one re-read against today's D365FO.

D as Dynamics. D as Diego.
```

**Banner**: `docs/linkedin-banner.png` (1584×396, `node scripts/make-linkedin-banner.mjs`).

**Featured → Add a link**: `https://dasdynamics.dev` (title and image come from the site's preview). The Super User article replaces it once it is no longer a draft.

## 2. Closing line on each LinkedIn article

Added at the end of each of the nine articles, with its own link:

```text
This article has a new home, where I keep it up to date: https://dasdynamics.dev/articles/<slug>/
```

| LinkedIn article | Site page |
|---|---|
| automating-label-creation-x-d365fo-…-j5d3f | `/articles/automating-label-creation-xpp/` |
| overcoming-incomplete-status-cloud-hosted-…-2anbf | `/articles/cloud-hosted-incomplete-winrm-certificate/` |
| d356fo-copilot-code-review-…-aoynf | `/articles/d365fo-copilot-code-review/` |
| extending-copilot-chat-d365fo-…-pmnif | `/articles/extending-copilot-chat-d365fo/` |
| d365fo-integration-architecture-…-gqbzf | `/articles/integration-architecture-rest-apim-part-1/` |
| d365fo-integration-architecture-…-1hulf | `/articles/integration-architecture-rest-apim-part-2/` |
| multithreading-d365fo-…-j4s8e | `/articles/multithreading-d365fo/` |
| resolving-ssltls-secure-channel-error-net-…-awksf | `/articles/ssl-tls-secure-channel-error-dotnet/` |
| virtual-zpl-printer-d365fo-…-ldw4f | `/articles/virtual-zpl-printer-d365fo/` |

## 3. Announcement post (last step)

```text
dasdynamics.dev is live.

My notes on Dynamics AX and D365FO, started on Blogger in 2014, now have one home, together with the articles I published here on LinkedIn and everything I will write from now on.

I did not want a copy. Every old note was re-read against today's D365FO and carries a verdict: still valid, changed, historical or to review, with a link to Microsoft Learn where things work differently now.

Topics: integrations with Azure API Management, X++, the platform, and AI inside the ERP.

From today new articles are published on the site first; here you will find a summary and the link.

D as Dynamics. D as Diego.
https://dasdynamics.dev

#Dynamics365 #D365FO #MicrosoftDynamics #ERP
```
