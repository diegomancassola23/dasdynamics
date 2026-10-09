---
title: "F&O in the Power Platform admin center: what changes"
description: "Unified environments for Finance and Operations: database access, updates, capacity, scaling, LCS migration and admin users, checked on Learn."
date: 2026-10-10
kind: article
track: platform
versions: ["D365FO"]
tags: ["power-platform","ppac","lifecycle-services","environments","administration"]
mergedFrom: []
draft: true
---

In March 2026 I followed a Microsoft session on Finance and Operations in the Power Platform admin center (PPAC) and posted a structured summary on LinkedIn. Many points were in preview then. Six months later, this is the same list checked against Microsoft Learn: what the session said, and what Learn says today (October 2026). Where they differ, Learn wins.

## The new vocabulary

Finance and operations apps are now an application inside a Power Platform environment backed by Dataverse. Learn calls these **unified environments** and defines three types:

- **UPE**, unified production environment: live workloads.
- **USE**, unified sandbox environment: test, UAT, staging, training, with copy, backup and restore, and transaction-less copy.
- **UDE**, unified developer environment: a sandbox provisioned for X++ development with Visual Studio and the Power Platform CLI. It replaces the cloud-hosted developer VMs of Lifecycle Services.

A USE can't become a UDE, or the other way round. The environment type is fixed at provisioning.

Some vocabulary moves with it: a database refresh is now an environment **copy** (and it copies code with data), a software deployable package is a **unified package**, maintenance mode is **admin mode**, and the Lifecycle Services project owner role becomes the Power Platform administrator role in Microsoft Entra.

## Point by point

### Just-in-time database access

*Session:* JIT database access, read/write on development environments, read-only elsewhere.

*Learn today:* a developer with the System Administrator role can request just-in-time SQL credentials from Visual Studio (**Tools** > **SQL Credentials for Dynamics 365 FinOps...**) on **UDE and USE**. The credentials work only from allowed IPv4 addresses, carry an expiry time, and a new request invalidates the previous one for the same user and environment. On a USE, write access is limited to the `db_datawriter` database role. So "read-only outside development" isn't what Learn describes for sandboxes: write is possible, with a narrower role. I found no Learn statement about direct SQL access to a unified production environment.

### Regions

*Session:* some regions in preview.

*Learn today:* there is a region table per environment type. Not every Azure region that Dataverse supports is supported for finance and operations apps, and several secondary regions (for example France South, UK West, Switzerland West) support only UDE and trial environments, not UPE or USE. Italy North supports all types. The ERP templates themselves (Finance, Supply Chain Management, Project Operations) are still labelled "(preview)" in the template list. Check the table before you pick a location: installing the provisioning app in an unsupported region fails.

### ISV solutions

*Session:* ISV solutions through AppSource only.

*Learn today:* Lifecycle Services "Solution management" is listed as not implemented in PPAC, with **Microsoft Marketplace** as its replacement. For development, ISV modules received as packages go into a reference metadata folder of the UDE configuration, and ISV licenses can be included in a model's `__License` folder or added by the Azure DevOps task when the package is built. I found no Learn page that says AppSource is the *only* route for ISV solutions, so I keep that as what the session said.

### Production environments

*Session:* production is created from a copy of a sandbox.

*Learn today:* two routes. You can provision a new production environment with an ERP template, or **convert an existing sandbox to production**. The conversion keeps customizations, X++ code and Dataverse solutions, makes the environment unavailable for up to two hours, and is bidirectional: a production environment can be converted back to sandbox the same way.

### Maintenance window settings

*Session:* maintenance window settings in PPAC.

*Learn today:* confirmed, for production. In PPAC you choose the **weekdays** when the environment can receive service updates and proactive quality updates, and the **cadence**: every update, or every other update (skip 10.0.48, take 10.0.49). For sandboxes the same settings are available through the Power Platform API. Before a production update, Microsoft checks that at least one sandbox in the tenant received the same update at least five days earlier; sandboxes generally get it 10 to 15 days before production. There is a separate release schedule page for unified environments; proactive quality updates follow the same schedule as Lifecycle Services environments.

### Environment groups

*Session:* environment groups for F&O environments.

*Learn today:* environment groups are a Power Platform governance feature: a "folder" of **managed** environments with rules (sharing, AI features, backup retention, ALM) that the group enforces and locks. An environment belongs to one group only, and environments without Dataverse can't be added. Unified environments have Dataverse, so they qualify in principle, but the Learn article doesn't mention finance and operations specifically, so I can't confirm any F&O-specific rule.

### Migration from Lifecycle Services

*Session:* gradual, self-service migration from LCS to PPAC.

*Learn today:* self-service migration exists and is in **public preview**. It runs per environment from the environment page in Lifecycle Services, after four checks (deployed status, linked Power Platform environment, available database capacity, you are an admin of the linked environment). Points to know before you start:

- It's **one-way**: after migration, the environment is read-only in Lifecycle Services and you can't move it back.
- The database isn't moved; the control plane changes. Plan about 15 minutes of downtime per AOS instance.
- During the preview, Microsoft recommends migrating sandboxes first and not using it for production. Cloud-hosted developer environments and environments that use Commerce aren't supported.
- The Lifecycle Services environment slot isn't returned. From then on, environments come from Power Platform capacity.
- Prepare UDEs and Azure DevOps pipelines that produce unified packages **before** migrating, because LCS deployment workflows no longer manage a migrated environment.

### Capacity

*Session:* capacity unified with Power Platform.

*Learn today:* confirmed. There are no environment slots. A license is required, and each new environment needs at least 1 GB available of both Operations and Dataverse database capacity; there's no strict limit on the number of environments. Transaction-less copy is the suggested way to reduce sandbox storage.

### Multiple AOS and autoscale

*Session:* multi-AOS and autoscale, up to 10 AOS.

*Learn today:* much more than 10. Sandbox and production environments use **elastic compute**: a maximum of **80 AOS instances** (40 interactive, 40 batch), a minimum of two (one interactive, one batch). The ceiling depends on the tenant's Power Platform Requests: each AOS needs 650,000 PPRs, accrued from a 500,000 tenant base, 5,000 per user license and purchasable add-on packs. Scale-up is automatic and without downtime; scale-down happens only in maintenance windows or customization deployments, because AOS instances hold session state. A UDE stays at one AOS, because the Visual Studio debugger attaches to a single process. A practical consequence: a sandbox and production share the same compute model, so performance tests in a sandbox finally mean something.

### Security and user management

*Session:* PPAC security, and F&O user management in private preview.

*Learn today:* **unified admin user management** is in **public preview**. It covers System Administrators (directly or through Dataverse *Owner* teams) and the environment admin: once you turn on **(Preview) Unified admin user management** in Feature management, PPAC and Dataverse become the source of truth, changes synchronize to Finance and Operations, and admin roles that exist only on the F&O side are removed. It needs Platform update 72 (7.0.7996.61) or later and the Unified User Management solution 9.3.3445.2 or later. It doesn't cover the business roles of ordinary users. On security in general, Learn lists PPAC compliance features (customer-managed keys, tenant isolation, virtual network support) for Power Platform workloads; I found nothing F&O-specific to add.

## What I take from it

The direction hasn't changed since March; the details have. Scaling went from "up to 10" to "up to 80", user management moved from private to public preview, and production can be provisioned directly, not only converted from a sandbox. The part that still needs care is the migration: it's one-way, still in preview, and it changes how you deploy code. Start with the pipelines and the UDEs, then a sandbox, and leave production for when Microsoft recommends it.

## References

- [Overview of unified admin experience for finance and operations apps](https://learn.microsoft.com/en-us/power-platform/admin/unified-experience/finance-operations-apps-overview)
- [Unified environment types and templates](https://learn.microsoft.com/en-us/power-platform/admin/unified-experience/unified-environment-types-and-templates) — UPE, USE, UDE, templates, regions.
- [Request credentials to access the product database](https://learn.microsoft.com/en-us/power-platform/developer/unified-experience/finance-operations-product-db-access) — JIT access on UDE and USE.
- [Enable just-in-time database access](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/database/database-just-in-time-jit-access)
- [Administration for partners and systems implementers](https://learn.microsoft.com/en-us/power-platform/admin/unified-experience/partners-systems-implementers) — terminology, process changes, compliance features.
- [Unified developer experience FAQ](https://learn.microsoft.com/en-us/power-platform/developer/unified-experience/finance-operations-faq) — ISV packages and licenses.
- [Tutorial: Convert a sandbox environment to production](https://learn.microsoft.com/en-us/power-platform/admin/unified-experience/tutorial-convert-sandbox-to-production)
- [Manage service updates for unified environments](https://learn.microsoft.com/en-us/power-platform/admin/unified-experience/manage-service-updates-unified-environments)
- [Release schedule for service updates (unified environments)](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/get-started/service-update-unified-schedule)
- [Environment groups](https://learn.microsoft.com/en-us/power-platform/admin/environment-groups)
- [Migrate finance and operations environments from Lifecycle Services to Power Platform admin center (preview)](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/lifecycle-services/migrate-lifecycle-services-environments-power-platform-admin-center)
- [Elastic compute for finance and operations apps](https://learn.microsoft.com/en-us/power-platform/admin/unified-experience/elastic-compute)
- [Admin user management unification for Finance and Operations (preview)](https://learn.microsoft.com/en-us/power-platform/admin/unified-experience/unified-admin-user-management)

First shared as a short post on LinkedIn.
