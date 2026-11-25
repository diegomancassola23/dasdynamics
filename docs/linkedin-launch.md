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

## 3. Announcement post (last step, 25/11 evening)

Goes out with the site article  (published the same evening).

```text
D as Dynamics. D as Diego.

I have worked on Dynamics since 2009: AX 2009, AX 2012, then D365 Finance & Operations. Today what I learned along the way has its own home: https://dasdynamics.dev/articles/dasdynamics-is-live/

What you find there:
→ new articles on integrations, X++, the platform and AI inside the ERP
→ the articles I published here on LinkedIn, kept up to date
→ my old Dynamics AX notes, each one re-read against today's D365FO, with a verdict: still valid, changed, or history

From today new articles come out on the site first. Here you will find a short summary and the link.

#Dynamics365 #D365FO #MicrosoftDynamics #ERP
```

## 4. Convergence 2026 post (scheduled: Tuesday 1 December 2026, morning)

Goes out with the site article `convergence-2026-miami` (published the same morning). Facts checked on convergence365.com, Sessionize and Eventbrite on 25/11/2026.

```text
Next stop: Miami Beach.

From December 8 to 11 I will be at Convergence 2026, at the Fontainebleau Miami Beach: four days with Microsoft product teams and the Dynamics 365 community on roadmap, Power Platform and AI.

From the Finance & Operations side, I will be listening for three things: AI inside the ERP (agents, Copilot, MCP), the platform moving to the Power Platform admin center, and what the roadmap changes for integrations.

What I learn will end up on the site as articles.

Are you going too? Write to me: a coffee between sessions is the best part of these events.

https://dasdynamics.dev/articles/convergence-2026-miami/

#Convergence2026 #Dynamics365 #D365FO #PowerPlatform
```
