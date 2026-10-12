---
title: "D365FO Integration Architecture: A Real-World Approach with REST APIs and Azure API Management (Part 2 of 2)"
description: "A working Azure API Management template for D365FO: custom service calls, REST-to-OData transformation, OAuth2 in policy and observability."
date: 2026-07-10
kind: article
track: integrations
versions: ["D365FO"]
tags: ["apim","rest","odata","oauth","policies"]
originalUrl: "https://www.linkedin.com/pulse/d365fo-integration-architecture-real-world-approach-rest-mancassola-1hulf/"
mergedFrom: []
series: "integration-architecture"
seriesPart: 2
draft: false
---

In Part 1 I described the _why_: a manufacturing landscape where SQL staging tables had quietly become the integration backbone, real-time scenarios were painful, and data consistency depended on batch windows. I also laid out the target picture — three integration styles living side by side (real-time REST, high-volume daily, and file-based) with **Azure API Management** as the control layer in front of Dynamics 365 Finance & Operations.

Link to part #1: [D365FO Integration Architecture, Part 1](/articles/integration-architecture-rest-apim-part-1/)

This second part is the _how_. Instead of another slide-deck architecture, I built a small, working APIM template and published it on GitHub so you can read the actual policies, deploy them, and adapt them:

**[github.com/diegomancassola23/d365fo.integrationpatterns](https://github.com/diegomancassola23/d365fo.integrationpatterns)**

Everything is anonymized and secret-free: hostnames, tenant, client id and secret never live in Git — they are externalized as APIM _named values_. The repo is meant to be cloned and reused.

## What's in the template

Three example APIs on a single APIM instance (Consumption tier), each representing a pattern you actually meet on a D365FO project:

### 1) REST → D365FO custom service (process integration)

`POST /d365/whs/autoReleaseTransferOrders`

A real-time call into an X++ custom service (`WHSReleaseToWarehouseService`). The caller sends a clean, friendly JSON; APIM handles Microsoft Entra ID authentication and — this is the interesting part — **reshapes the payload into the exact contract the service expects**. The X++ data contract wants an enum as an integer and its flags as NoYes (0/1); consumers shouldn't have to know that. The policy maps `"quantitySpecification": "All"` and `"allowPartiallyReleased": false` into the numeric contract members before routing. This is the archetype for triggering business logic in D365FO from the outside world without leaking ERP internals to the caller.

### 2) The "why a gateway at all?" case

`GET /fake/posts/{id}`

`GET /fake/users`

A dependency-free route to a public fake service — and the best place to _show_, not just claim, what APIM buys you. The backend is a dumb public API; the policy layers real capabilities on top of it without changing a line of backend code:

- **CORS** governed centrally, so browsers can call it under one policy.
- A **correlation ID** on every call — honored if the caller sends `x-correlation-id`, generated otherwise, echoed back on the response and written to the logs. That single header is what turns "it failed somewhere" into an end-to-end trace.
- **Header hardening**: the backend's `Server` and `X-Powered-By` fingerprints are stripped on the way out.
- **Response tagging** with `X-Gateway` and `X-Gateway-Elapsed-Ms`, so consumers can see the call went through the gateway and how long it took.
- A **single, consistent error envelope** — every failure comes back as the same JSON shape, regardless of what the backend did.

It's also the endpoint I keep around for triage: dependency-free, it tells you "APIM problem" vs "D365 problem" in ten seconds. On paid tiers you'd add rate limiting here too; that policy isn't available in the Consumption tier, so I documented it and moved on. The point stands: the value isn't the backend, it's everything the gateway wraps around it.

### 3) REST → OData transformation (hiding complexity)

`POST /d365/customers/search` with `{ "customerAccount": "DE-001" }`

Consumers shouldn't have to learn OData. So the caller posts a simple search request; APIM validates it, translates it into

`GET /data/CustomersV3?$filter=CustomerAccount eq 'DE-001'&$top=1&cross-company=true`,

and — crucially — **reshapes** the very verbose OData record into a compact, curated object:

```json
{
  "found": true,
  "customerAccount": "DE-001",
  "name": "Contoso Europe",
  "currency": "EUR",
  "customerGroup": "90",
  "paymentTerms": "Net10",
  "email": "...",
  "address": { "street": "...", "city": "Berlin", "zipCode": "10115", "countryISO": "DE" }
}
```

> A CustomersV3 row has _hundreds_ of fields. Your consumer wants eight. The transformation layer is exactly where that curation belongs — not in the ERP, not in the client.

## The design decisions that matter

**OAuth2 inside the policy.** APIs 1 and 3 acquire a token from Microsoft Entra ID using the client-credentials flow, directly in the inbound policy, and attach it as a Bearer token before routing to D365FO. The consumer authenticates to APIM with a subscription key; APIM authenticates to D365FO with a service identity. The app registration is mapped to a service account in D365FO under _System administration → Setup → Microsoft Entra ID applications_. Two separate trust boundaries, cleanly decoupled.

**Hybrid policy scope.** Cross-cutting concerns (token acquisition) sit at the **API scope**, so they're written once and apply to every operation. Operation-specific logic — backend routing, the REST→OData rewrite, the response reshaping — sits at the **operation scope** and inherits the shared part via `<base />`. This keeps each policy small and readable, and it scales: adding a second operation to an API doesn't mean copy-pasting the auth block.

**No secrets in source control.** Tenant, client id, client secret and the D365FO base URL are all named values (the secret flagged as such). Rotating the credential is a one-line named-value update — no policy change, no redeploy. In production I'd back the secret with Azure Key Vault.

**Observability with payload persistence.** An Application Insights logger is attached to APIM, with a diagnostic that logs full request/response bodies (frontend and backend) plus client IP and W3C correlation. Application Insights truncates large payloads, so — as covered in Part 1 — the production pattern is to persist the full body to Azure Blob Storage and log only a reference. That's the natural next layer on top of this template.

## Honest limitations

I deliberately used the **Consumption tier**, because it's the cheapest way to demonstrate the pattern and it provisions in minutes. Two things to keep in mind:

- No built-in cache, so the OAuth token is fetched per request. On Basic/Standard/Premium you'd cache it (`cache-store-value` / `cache-lookup-value`) keyed on expiry and cut latency significantly.
- The 5-minute gateway timeout still applies — fine for process calls, not for moving large datasets. That's what the daily/high-volume lane is for.

## Takeaway

> APIM isn't a magic bullet that turns every integration into real-time REST. Its value is that it lets you **standardize communication, centralize security and logging, and decouple external systems from the ERP** — while you keep routing the heavy batch traffic through the data platform where it belongs. Pick the right lane per scenario, and let the gateway enforce the contract.

The code is on GitHub — clone it, break it, adapt it. Feedback and pull requests welcome.

_(This is Part 2 of a two-part series. Part 1 covers the architecture and the reasoning behind the three-lane approach.)_
