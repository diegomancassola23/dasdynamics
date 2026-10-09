# Content schema

One Markdown file per article: `src/content/articles/<slug>.md`. The slug is short, lower-case, hyphenated, in English.

```yaml
---
title: "Caching display methods on forms"
description: "One sentence, written for search results (max 160 chars)."
date: 2014-01-29            # original publication date
updated: 2026-10-10         # date of the rewrite (omit for untouched originals)
kind: article | note        # article = long piece (LinkedIn era and new ones); note = archive note from the blog
track: integrations | ai | xpp | platform
versions: ["AX 2012", "D365FO"]   # versions the content applies to
tags: ["forms", "performance"]
verdict: valid | changed | historical | to-review   # notes only: status in D365FO today
verdictNote: "One line: what changed or why it is history."
originalUrl: "https://dynamicsaxnotes.blogspot.com/..."  # where it was first published
mergedFrom: []              # other original URLs merged into this one
series: "integration-architecture"   # optional
seriesPart: 1                        # optional
draft: false
---
```

## Body for a rewritten note

1. A short lead: the problem in two or three sentences.
2. `## In D365FO today` — only when the verdict is `changed` or `valid` and there is something useful to say; every claim linked to Microsoft Learn.
3. `## The original note` — the original content, cleaned up in English, code kept as it was (formatting fixed).
4. `## References` — links used.

## Body for a LinkedIn article

The author's text as published, converted to Markdown. Only formatting is fixed; wording is kept.
