---
title: "ISV licenses and 10.0.49: the SHA-256 switch"
description: "From platform build 7.0.8129.0 (10.0.49) SHA-1 signed ISV licenses are no longer supported. How to find them and replace them before the update."
date: 2026-10-10
kind: article
track: platform
versions: ["D365FO"]
tags: ["isv","licensing","service-updates","security"]
mergedFrom: []
draft: true
---

Version 10.0.49 brings a change that has nothing to do with features and everything to do with whether your ISV solutions still start after the update. Support for ISV licenses signed with SHA-1 is removed. A license signed with SHA-1 is not accepted any more: only SHA-256 signatures are.

The ISV licensing article on Microsoft Learn says it plainly: support for SHA-1 based ISV license signatures was removed in platform build **7.0.8129.0 (Platform update 73)**, and licenses must be generated with SHA-256, which is **SignatureVersion 2**. Platform update 73 is 10.0.49; the 10.0.49 release notes use the same "PU73/10.0.49" pairing.

## Why this one can hurt

An invalid ISV license does not fail loudly at import time. Learn describes the behavior: when a license becomes invalid, the ISV solution keeps running until the server restarts; after the restart the solution is disabled, and the error goes to the event log when the AOS starts. A service update restarts everything. So the first time you notice is the morning after the update, when the configuration keys behind the ISV solution are off and the features they protect have disappeared from the forms.

Two more facts from Learn make planning important:

- **You can't pause your way out of it for long.** Since February 2024 you can pause at most one consecutive service update. Microsoft grants extra pauses only for a confirmed Microsoft bug or regression with no workaround, and the pause article states that issues in third-party solutions and ISV applications aren't eligible. A SHA-1 license is an ISV-side problem.
- **The deadline is close.** The 10.0.49 release notes list general availability for self-update in September 2026 and auto-update in October 2026.

When I wrote the original post, Microsoft had held back the auto-update to 10.0.49 for environments it had identified as affected. I could not find this on Learn, so take it as what I saw in the notifications, not as a policy: check your own Message center and Lifecycle Services notifications, and don't count on a hold.

## Learn has two dates: plan for the later one

The "Removed or deprecated platform features" article has an older entry that says SHA-1 import support was removed by February 2024 (10.0.39/PU63). The ISV licensing article, updated in September 2026, names build 7.0.8129.0 (PU73). The practical reading is the same either way: if a license is still signed with SHA-1, 10.0.49 is where it stops working. Don't take the older date as proof that the problem is already behind you.

## What to do before 10.0.49

**1. Make an inventory.** Go to **System administration** > **Setup** > **License configuration** and open the **License codes** tab: it lists the ISV license codes installed in the environment and their expiration dates. Write down every ISV solution, its vendor and the environments where it runs. Do this on production, not only on a sandbox: sandboxes drift.

**2. Ask each vendor for a SHA-256 license.** The page doesn't tell you, as a customer, which algorithm signed a license, so ask the vendor explicitly whether the license you have was generated with SignatureVersion 2. For the vendor the change is small: in the `axutil genlicense` tool, `SignatureVersion` value 1 is SHA-1 and value 2 is SHA-256; the deprecation entry on Learn adds that leaving the field empty also produces SHA-256. Licenses generated on 10.0.43 and later are issued at tenant level and, per Learn, aren't compatible with older application versions, so tell the vendor which version you run when you ask.

**3. Validate in a sandbox on 10.0.49.** Import the new licenses into a sandbox that already runs 10.0.49, restart, and check that the configuration keys are still on and the ISV features work. That is the only test that proves the license survives a restart on the new build.

**4. Deploy to production before the update.** In Lifecycle Services-managed production you install ISV licenses with a deployable package, starting from the `ImportISVLicense.zip` template in the `bin\CustomDeployablePackage` folder of the packages directory (licenses are installed in alphabetical order, which matters if one depends on another). In unified environments, the developer FAQ covers two routes: when you deploy directly from Visual Studio, a license placed in the model's `__License` folder is verified and applied with the package, and a **Full DB Sync** is then required for it to take effect; in a pipeline, the Azure DevOps extension can add ISV licenses to the package. Either way, the license should be in production before the update window, not after.

## If you are the ISV

Regenerate every customer license with SignatureVersion 2 now, and send them out with a short note on how to import them. My reading is that the certificate itself doesn't have to change: Learn doesn't say so in those words, but it lists 1024 to 4096-bit Authenticode certificates as supported, and the self-signed test certificate recipe for Platform update 35 and later already uses SHA-256. Your customers' update calendar is now your deadline.

## References

- [Independent software vendor (ISV) licensing](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/dev-tools/isv-licensing) — SHA-1 removal in build 7.0.8129.0 (PU73), SignatureVersion values, `axutil genlicense`, production install, runtime behavior of invalid licenses.
- [Removed or deprecated platform features](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/get-started/removed-deprecated-features-platform-updates) — "ISV Licenses generated using SHA1 algorithm (signature version 1)".
- [Platform updates for version 10.0.49](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/fin-ops/get-started/whats-new-platform-updates-10-0-49) — release schedule and the PU73/10.0.49 pairing.
- [View independent software vendor license status](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/sysadmin/view-isv-license-status) — the License codes tab.
- [Pause service updates through Lifecycle Services](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/lifecycle-services/pause-service-updates) — one pause at a time; ISV issues aren't eligible for extra pauses.
- [Unified developer experience FAQ](https://learn.microsoft.com/en-us/power-platform/developer/unified-experience/finance-operations-faq) — licenses in the `__License` folder (deploy from Visual Studio, then Full DB Sync) and in the Azure DevOps extension.

First shared as a short post on LinkedIn.
