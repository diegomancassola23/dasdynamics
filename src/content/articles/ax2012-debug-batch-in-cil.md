---
title: "AX 2012: run a batch job from X++ to debug it"
description: "Run an AX 2012 batch job in CIL from a job, so you can debug it without attaching Visual Studio to the AOS."
date: 2017-01-05
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2012"]
tags: ["batch","debugging","cil","ax-2012"]
verdict: historical
verdictNote: "An AX 2012 technique built on runClassMethodIL and the AX 2012 batch framework."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2017/01/howto-run-batch-using-x-helps-for-debug.html"
mergedFrom: []
draft: false
---

In AX 2012 a batch job always runs in CIL on the batch server, which makes it awkward to debug. This note runs a batch job on demand from a job, in CIL, so you can step through it without attaching Visual Studio to the AOS instance.

## The original note

In AX 2012, batch jobs always run in a CIL context. To debug a batch without attaching Visual Studio to the AOS instance, you can run it this way:

1. Create the batch job and assign it a batch group that no batch server processes.
2. Create this method on the `BatchRun` class:

```xpp
server static public void runJobStaticCodeIL(RecId batchId)
{
    container ret;
    XppILExecutePermission  xppILExecutePermission;
    ;

    xppILExecutePermission = new XppILExecutePermission();
    xppILExecutePermission.assert();

    ret = runClassMethodIL(classStr(BatchRun), staticMethodStr(BatchRun, runJobStaticCode), [batchId]);

    CodeAccessPermission::revertAssert();
}
```

3. Get the job ID from the batch task.
4. Run this job:

```xpp
static void batchRun(Args _args)
{
    Batch batch;
    ;
    select batch where batch.BatchJobId == 5637161890;
    BatchRun::runJobStaticCodeIL(batch.RecId);
}
```

Now you can debug it.

## References

- No current Microsoft Learn page applies: the technique is specific to AX 2012.
