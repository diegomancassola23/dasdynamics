---
title: "AX 2012: debug the AIF outbound processing service"
description: "Two temporary changes to standard AX 2012 code that let you step through AifOutboundProcessingService in the debugger."
date: 2016-05-26
updated: 2026-10-10
kind: note
track: integrations
versions: ["AX 2012"]
tags: ["aif","debugging","ax-2012"]
verdict: historical
verdictNote: "AIF was removed in Dynamics AX 7.0 and replaced by the data management framework."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2016/05/howto-debug-aifoutboundprocessingservice.html"
mergedFrom: []
draft: false
---

AIF outbound messages are processed under `runas`, so the debugger never stops in your code. This note bypasses `runas` and the dispatcher permission check while you debug. AIF itself is gone: it "couldn't scale to a cloud service" and was removed as of Dynamics AX 7.0, replaced by the Data Import/Export framework ([Removed or deprecated features in previous releases](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/migration-upgrade/deprecated-features)).

Then → now: how I build integrations today is in [D365FO Integration Architecture, Part 1](/articles/integration-architecture-rest-apim-part-1/).

## The original note

If you need to go deeper when debugging an outbound message, you have to make a couple of temporary changes to standard code:

- In `AifOutboundProcessingService.runAsUserInPartition`, comment out the `runas` call and replace it with a direct call to `processAsUser`:

```xpp
/*
// runAs currentUser and process all messages in the container.
new RunAsPermission(runAsUserId).assert();

// BP deviation documented
runas(runAsUserId,
    classnum(AifOutboundProcessingService),
    staticmethodstr(AifOutboundProcessingService, processAsUser),
    messageIdContainer,
    runAsCompany,
    '',
    runAsPartition);

// Revert the permission
CodeAccessPermission::revertAssert();
*/

AifOutboundProcessingService::processAsUser(messageIdContainer);
```

Important: you have to run the code in the same company and partition given in the `runAsCompany` and `runAsPartition` parameters.

- In `AifDispatcher.dispatchOperation`, comment out (or skip) this line:

```xpp
//new AifDispatcherPermission().demand();
```

To process the message queue, use `new AifOutboundProcessingService().run()`.

## References

- [Removed or deprecated features in previous releases](https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/migration-upgrade/deprecated-features) (Microsoft Learn): AIF, AxD, and AxBC integrations.
