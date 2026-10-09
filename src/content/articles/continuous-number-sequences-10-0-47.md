---
title: "Continuous number sequences after 10.0.47: an incident timeline"
description: "Italian localisation, 10.0.47: continuous numbers left behind after failed postings. The timeline, the fix, and how I handle a compliance-critical regression."
date: 2026-10-10
kind: article
track: platform
versions: ["D365FO"]
tags: ["number-sequences","italy","localization","service-updates","quality-updates"]
mergedFrom: []
draft: true
---

In spring 2026 a regression in 10.0.47 hit continuous number sequences on an Italian implementation. For most companies a gap in a number sequence is a cosmetic problem. In Italy it is a compliance problem, because sales tax vouchers must be numbered without gaps. This article is the timeline of what happened and, more useful, what I would do again the next time an update breaks something the law cares about.

## Why continuity matters here

Microsoft Learn is clear on both sides of the trade-off. A **continuous** number sequence doesn't skip numbers, but numbers may not be used in order: when a transaction is cancelled, the number is recycled. A **noncontinuous** sequence uses numbers in order but may skip some. Learn recommends noncontinuous sequences for performance, *unless there's a regulatory or legal compliance requirement*.

Italy is that requirement. The Italian sales tax books article says that all sales tax transactions must be numbered sequentially, without gaps, and ordered by posting date, and that the number sequences behind the tax book sections must be continuous with **Company** scope. A number that is consumed and never used is a hole in the *Protocollo IVA*.

## The timeline

These are the dates and facts as I followed them on the case. The build numbers and the root cause come from Microsoft support, not from a public page.

- **The symptom.** On 10.0.47 (Platform update 71, build 7.0.7858.76 in our environment), when a posting failed, the continuous number it had taken stayed in the "Undecided" state instead of going back to the pool. Every failed posting left a gap.
- **29 April.** First update on the case.
- **6 May.** Microsoft confirmed the fix in a 10.0.47 quality update, **build 7.0.7858.90**. The cause given by support: the transaction ID was not registered with the number sequence framework, so the cleanup that should give the number back after a failed transaction never saw it.
- **8 May.** A caveat came with the fix: a performance concern with the proactive quality update that carried it. So the fix was not something to push into production blind; it needed a test pass first.
- **21 May.** The final recommendation: run **10.0.47 PQU-3 or later**, and keep the automated cleanup of number sequences running.

In the same weeks I also cancelled a scheduled 10.0.47 update: there was no reason to bring one more environment onto the build while the case was open.

Learn's PQU schedule fits the support build numbers: 10.0.47 PQU-1 is platform 7.0.7858.54 and PQU-3 is 7.0.7858.96, so PQU-3 is the first scheduled quality update after the 7.0.7858.90 fix. (PQU-2 is listed as canceled for most stations.) The 10.0.47 base release itself is build 7.0.7858.14.

## What I would do again

**1. Make an inventory of what the regression touches.** Before arguing about the fix, list every continuous number sequence, which legal entity and which document it serves, and which of them feed a tax book section. On an Italian company that list is long: sales and purchase invoice vouchers, credit notes, free text invoices, journal names that post to a tax book. Then look for the damage: numbers not in use, in a state they should not be in, in the period since the update.

**2. Open the ticket early and give it facts.** Build number, the exact state of the numbers, a reproducible failed posting, and why it matters (a statutory requirement, not a preference). Microsoft's pause policy is relevant here: extra pauses beyond the standard one are granted only for a confirmed Microsoft bug or regression with no workaround, and only if you report it early enough for Microsoft to investigate. An open ticket alone doesn't qualify.

**3. Postpone the update where it hasn't landed yet.** With Lifecycle Services you can pause one consecutive service update; pausing the default sandbox also pauses production. Keeping environments off the broken build buys time without adding damage.

**4. Watch, and test the fix like any other change.** A fix in a quality update is still a change to production. The 8 May caveat is the reason: the fix arrived with a performance warning, and continuous sequences are already the slower kind (that's why Learn recommends noncontinuous ones when the law allows). Apply it to a sandbox, post the documents that matter, then promote.

**5. Keep the cleanup running.** Learn says that after an application error, crash or other unexpected failure the system tries to recycle numbers of continuous sequences automatically, and that you can run the cleanup manually or automatically to recover lost numbers, preferably as a batch job outside peak hours. The regression broke exactly that recycling. Once fixed, a scheduled cleanup is the safety net that catches the next failure before the tax book does.

## Where it ended

10.0.47 PQU-3 or later, the automated cleanup scheduled, and a check on the tax book sections after each update. The lesson isn't about number sequences: when an update breaks something that a regulator reads, treat it as an incident with an inventory, a ticket, a frozen calendar and a watch, not as a bug to wait out.

## References

- [Number sequences overview](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/organization-administration/number-sequence-overview) — continuous and noncontinuous sequences, performance, automatic cleanup.
- [Italian sales tax books](https://learn.microsoft.com/en-us/dynamics365/finance/localizations/italy/emea-ita-fiscal-books) — numbering without gaps; continuous sequences with Company scope.
- [Platform updates for version 10.0.47](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/get-started/whats-new-platform-updates-10-0-47) — base build 7.0.7858.14.
- [Release schedule for proactive quality updates](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/get-started/quality-updates-schedule) — 10.0.47 PQU builds.
- [Pause service updates through Lifecycle Services](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/lifecycle-services/pause-service-updates) — one pause at a time, extra pauses only for confirmed Microsoft regressions.

First shared as a short post on LinkedIn.
