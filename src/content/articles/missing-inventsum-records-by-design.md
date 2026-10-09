---
title: "Missing InventSum records: it's by design"
description: "Physical inventory by inventory dimension at a past date misses closed InventSum rows. Why on-hand cleanup removes them, and the parameter that keeps them."
date: 2026-10-10
kind: article
track: platform
versions: ["D365FO"]
tags: ["inventory","inventsum","on-hand","cleanup","consistency-check"]
mergedFrom: []
draft: true
---

A report that used to be right starts to lose rows. The **Physical inventory by inventory dimension** report, run with an **As of date** in the past, no longer shows some item and dimension combinations that certainly had stock on that date. The inventory transactions are there. The on-hand rows behind them are not.

I opened a case for it. Microsoft's answer (issue 914302) was that this is **by design**, and has been since 10.0.40: closed `InventSum` records, the ones whose quantities have all gone back to zero, are cleared, and a report that reads `InventSum` for a past date can't show what isn't there any more.

## What Learn says about it

The version and the issue number come from the support case. The mechanism is documented on Microsoft Learn, and once you read it the behavior stops looking like a bug.

**Cleanup deletes zero-quantity on-hand rows.** The warehouse management on-hand entries cleanup job deletes records in `InventSum` and `WHSInventReserve` where all the field values are zero, because they don't contribute to on-hand. It only touches records below the **Location** level ([Warehouse management on-hand entries cleanup job](https://learn.microsoft.com/en-us/dynamics365/supply-chain/warehousing/onhand-cleanup)), so what goes is the detail below location, such as the license plate level, not the rows at location level and above. The article lists the user impact itself: the **On-hand list** with **Closed transactions** selected, and the **Physical inventory by inventory dimension** report for past periods with **As of date** set. Its conclusion is that the performance gain should make up for "these small losses in functionality".

**The consistency check does it too.** The on-hand consistency check rebuilds `InventSum` (and `WHSInventReserve` for warehouse items) from `InventTrans`. In *Fix error* mode, with the default parameter setting, it also runs the equivalent of the on-hand cleanup for every item in scope: it aggregates zero-quantity rows to the financial dimension level and deletes them. So a check you ran to *fix* on-hand can be the thing that removes the rows your report needs.

**The reports that depend on those rows** are listed in the consistency check article: Inventory aging, Physical inventory by inventory dimension (with **As of date** or **Closed transactions**), the On-hand list with closed transactions, and two country-specific reports (Russia and China).

## The parameter

The control is in **Inventory management** > **Setup** > **Inventory and warehouse management parameters**, on the **General** tab, field group **On-hand consistency check clean up**: **Skip on-hand aggregation and clean up in on-hand consistency check**.

- **No** (the default): the consistency check also aggregates and deletes zero-quantity rows for the items in scope. Longer run, tidier tables, missing history.
- **Yes**: the check only rebuilds the on-hand tables. Faster run, and zero-quantity rows aren't cleaned up. Learn names this setting explicitly for the case where downstream historical reporting, such as Physical inventory by inventory dimension with **As of date**, depends on those rows.

## What I did

The route that Microsoft gave me, and that worked for us, had two steps: set the parameter to **Yes**, then run the on-hand consistency check for the affected items, so that `InventSum` is rebuilt from the transactions without the cleanup removing the zero rows again.

How I ran the check follows the Learn procedure, which is careful for good reasons:

1. **System administration** > **Periodic tasks** > **Database** > **Consistency check**, module *Inventory management*, **On-hand** under **Item**.
2. Filter to the affected items in the **Dialog**. The check replays the whole `InventTrans` history per item and locks `InventSum`; running it on all items is for disaster recovery.
3. Run in *Check* mode first and read the log.
4. Then *Fix error*, as a batch job outside business hours.
5. Rerun the report for the same **As of date** and compare.

Two cautions. Learn positions the consistency check as a corruption-recovery tool, not periodic maintenance, so use it on a defined set of items with a clear reason, not as a nightly job. And the parameter only governs the consistency check: the standalone cleanup jobs (**On-hand entries cleanup**, **Warehouse management on-hand entries cleanup**, **On-hand entries aggregation by financial dimensions**) will remove zero rows again the next time they run.

## The real decision

This is a trade-off, and Learn says so: the cleanup exists for performance, and the lost dimension-level history is usually acceptable, except where the affected reports are statutory or business-critical. So decide per environment:

- If you depend on "as of date" inventory by dimension (auditors, year-end, legal reporting), set the parameter to **Yes**, and think twice before scheduling the cleanup jobs. Learn's own mitigation is to run the historical reports *before* you schedule cleanup, since reports already produced aren't affected retroactively.
- If you don't, keep the default and schedule the cleanup jobs: on-hand queries get faster, and that's the reason the design exists.

What I would not do again is find out from a report that suddenly has fewer rows. If you used to read `Closed` and `ClosedQty` on `InventSum` to tell old on-hand rows apart (I wrote about those two flags [years ago](/articles/inventsum-closed-and-closedqty/)), know that in current versions many of those rows simply don't exist any more.

## References

- [Run an on-hand consistency check](https://learn.microsoft.com/en-us/dynamics365/supply-chain/inventory/on-hand-consistency-check) — the parameter, what fix mode does, the affected reports, mitigation.
- [Warehouse management on-hand entries cleanup job](https://learn.microsoft.com/en-us/dynamics365/supply-chain/warehousing/onhand-cleanup) — what is deleted and the impact on Physical inventory by inventory dimension.
- [Cleanup routines in Dynamics 365 Finance and Dynamics 365 Supply Chain Management](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/sysadmin/cleanuproutines) — the standard cleanup jobs.

First shared as a short post on LinkedIn.
