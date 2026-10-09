---
title: "AX 2012: delete label files"
description: "The steps to get rid of unwanted label files in AX 2012: move them to a throwaway model, delete the model with AXUtil and clean the server folder."
date: 2016-04-08
updated: 2026-10-10
kind: note
track: platform
versions: ["AX 2012"]
tags: ["labels","models","axutil","ax-2012"]
verdict: historical
verdictNote: "Relies on the AX 2012 model store, AXUtil and the server label folder."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2016/04/howto-delete-label-files-from-ax-2012.html"
mergedFrom: []
draft: false
---

In AX 2012 there is no delete command for a label file. The workaround is to isolate the label files in a model of their own and delete that model.

## The original note

Here are the steps to delete label files from AX 2012:

1. Create a new model. You could call it "LabelsBeGone".
2. Open the AOT and move the label files you want to get rid of to the new model.
3. Close AX and stop the AOS.
4. Use AXUtil to delete the new model.
5. Delete the label files from the server folder: `C:\Program Files\Microsoft Dynamics AX\60\Server\...\bin\Application\Appl\Standard`
6. Start the AOS.
7. Skip the upgrade wizard.

## References

- No current Microsoft Learn page applies: the procedure is specific to the AX 2012 model store.
