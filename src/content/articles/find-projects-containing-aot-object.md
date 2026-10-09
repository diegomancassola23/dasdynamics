---
title: "Find which shared projects contain an AOT object"
description: "A recursive X++ job for AX 4.0, AX 2009 and AX 2012 that lists the shared projects containing a given AOT object, methods included."
date: 2016-04-19
updated: 2026-10-10
kind: note
track: xpp
versions: ["AX 4.0","AX 2009","AX 2012"]
tags: ["aot","projects","morphx"]
verdict: historical
verdictNote: "Works on the MorphX AOT and shared projects; D365FO uses Visual Studio projects instead."
originalUrl: "https://dynamicsaxnotes.blogspot.com/2016/04/x-how-to-find-what-projects-object-from.html"
mergedFrom: []
draft: false
---

Before you delete or move an object in the AOT, you want to know which shared projects reference it. This job walks every shared project recursively, so it also finds methods and other inner nodes.

## The original note

To find which projects an AOT object is in, use this script. It is recursive, so it also finds methods or inner nodes.

The object path in the original pointed to a project-specific class; it is replaced here with a placeholder.

```xpp
ProjectNode projectNode;
ProjectListNode projectListNode;

TreeNode treeNode;
TreeNodeIterator treeNodeIterator;

// Object we are searching for
TreeNode tnSearch = TreeNode::findNode(@'\Classes\MyClass');

void find(TreeNodeIterator _innerTreeNodeIterator)
{
    TreeNode innerTreeNode;
    ;
    innerTreeNode = _innerTreeNodeIterator.next();
    while (innerTreeNode)
    {
        if (innerTreeNode.treeNodePath() == tnSearch.treeNodePath())
            info(strfmt("Found in shared project %1", treeNode.AOTname()));
        find(innerTreeNode.AOTiterator());
        innerTreeNode = _innerTreeNodeIterator.next();
    }
}

;

projectListNode = SysTreeNode::getSharedProject();
treeNodeIterator = projectListNode.AOTiterator();

treeNode = treeNodeIterator.next();
while (treeNode)
{
    projectNode = treeNode;
    projectNode = projectNode.loadForInspection();
    find(projectNode.AOTiterator());
    treeNode = treeNodeIterator.next();
}
```

## References

- No current Microsoft Learn page applies: shared projects belong to the MorphX development environment.
