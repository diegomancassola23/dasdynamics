---
title: "Find a shared project by name"
description: "A short X++ job that lists the shared projects in the AOT whose name matches a wildcard pattern."
date: 2015-11-20
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 2009","AX 2012"]
tags: ["aot","projects","morphx"]
verdict: historical
verdictNote: "Works on MorphX shared projects; D365FO uses Visual Studio projects instead."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2015/11/x-find-shared-project-by-name.html"
mergedFrom: []
draft: false
---

With hundreds of shared projects in the AOT, finding one by name in the tree is tedious. This job lists the ones that match a pattern.

## The original note

This code lets you search for a shared project by name:

```xpp
ProjectListNode projectListNode;
TreeNodeIterator treeNodeIterator;
TreeNode treeNode;
str projectName;
;
projectName = "*xxx*";
projectListNode = SysTreeNode::getSharedProject();
treeNodeIterator = projectListNode.AOTiterator();
treeNode = treeNodeIterator.next();
while(treeNode)
{
    if (treeNode.AOTname() like projectName)
        info(treeNode.AOTname());
    treeNode = treeNodeIterator.next();
}
```

## References

- No current Microsoft Learn page applies: shared projects belong to the MorphX development environment.
