---
title: "Start a cloud-hosted development VM from PowerShell"
description: "Wake up a cloud-hosted D365FO VM from the command line. The 2021 note used AzureRM; today the Az module replaces it."
date: 2021-01-27
updated: 2026-10-10
kind: note
track: platform
versions: ["D365FO"]
tags: ["azure","powershell","cloud-hosted","vm"]
verdict: changed
verdictNote: "AzureRM was deprecated on 29 February 2024: use Connect-AzAccount and Start-AzVM from the Az module."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2021/01/d365ffo-start-virtual-machine-cloud.html"
mergedFrom: []
draft: false
---

A cloud-hosted development VM is usually stopped to save cost, and starting it from the portal every morning is slow. This 2021 note starts it with two PowerShell commands.

## In D365FO today

- The AzureRM module used in the note is retired: "The AzureRM PowerShell module has been officially deprecated as of February 29, 2024", and the Az module is the recommended replacement ([AzureRM retirement overview](https://learn.microsoft.com/en-us/powershell/azure/azurerm-retirement-overview)). The same two steps use [`Connect-AzAccount`](https://learn.microsoft.com/en-us/powershell/module/az.accounts/connect-azaccount) and [`Start-AzVM`](https://learn.microsoft.com/en-us/powershell/module/az.compute/start-azvm):

```powershell
Connect-AzAccount
Start-AzVM -ResourceGroupName "yourresourcegroupname" -Name "machineName"
```

- With the unified experience, "customers no longer deploy all-in-one VMs" ([Overview of unified admin experience for finance and operations apps](https://learn.microsoft.com/en-us/power-platform/admin/unified-experience/finance-operations-apps-overview)). The tip still applies to cloud-hosted VMs you keep.

## The original note

The simplest way to wake up and start a cloud-hosted virtual machine from your command line.

The authentication method is an interactive login, but you can authenticate with another method, as described in the `Connect-AzureRmAccount` documentation.

1. Run PowerShell.
2. Run:

```powershell
Connect-AzureRmAccount
Start-AzureRmVM -ResourceGroupName "yourresourcegroupname" -Name "maschineName"
```

More information is in the AzureRM.Compute module reference for AzureRM 6.13.0 (linked below).

## References

- [AzureRM PowerShell module retirement overview](https://learn.microsoft.com/en-us/powershell/azure/azurerm-retirement-overview) (Microsoft Learn)
- [Connect-AzAccount](https://learn.microsoft.com/en-us/powershell/module/az.accounts/connect-azaccount) (Microsoft Learn)
- [Start-AzVM](https://learn.microsoft.com/en-us/powershell/module/az.compute/start-azvm) (Microsoft Learn)
- [Overview of unified admin experience for finance and operations apps](https://learn.microsoft.com/en-us/power-platform/admin/unified-experience/finance-operations-apps-overview) (Microsoft Learn)
- Original links: [Connect-AzureRmAccount](https://docs.microsoft.com/en-us/powershell/module/azurerm.profile/connect-azurermaccount?view=azurermps-6.13.0), [AzureRM.Compute](https://docs.microsoft.com/en-us/powershell/module/azurerm.compute/?view=azurermps-6.13.0#virtual-machines)
