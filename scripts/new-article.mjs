// Creates a new draft article: npm run new -- "My title"
// Writes src/content/articles/<slug>.md with the frontmatter prefilled.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.log('Usage: npm run new -- "My title"');
  console.log('ESITO: non fatto');
  process.exit(1);
}

const slug = title
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/\+\+/g, 'pp')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80)
  .replace(/-+$/, '');
const file = path.join(root, 'src/content/articles', `${slug}.md`);
const rel = path.relative(root, file).split(path.sep).join('/');
if (fs.existsSync(file)) {
  console.log(`${rel} already exists: pick another title or edit that file.`);
  console.log('ESITO: non fatto');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const text = `---
title: ${JSON.stringify(title)}
description: "One sentence for search results and LinkedIn (max 160 characters)."
date: ${today}
kind: article
track: integrations   # integrations | ai | xpp | platform
versions: ["D365FO"]
tags: []
# cover: "APIM"       # optional short word on the card (max 12 characters)
# series: "my-series" # optional, with seriesPart: 1
pinned: false
draft: true
---

Start here. Images go in public/images/articles/${slug}/ and are linked as
![What the image shows](/images/articles/${slug}/picture.png)
`;
fs.writeFileSync(file, text, 'utf8');
fs.mkdirSync(path.join(root, 'public/images/articles', slug), { recursive: true });

const ok = fs.readFileSync(file, 'utf8') === text;
console.log(`Created ${rel}`);
console.log(`Images folder: public/images/articles/${slug}/`);
console.log('');
console.log('Next steps:');
console.log('  1. npm run dev        -> preview at http://localhost:4321/articles/' + slug + '/');
console.log('  2. write; fill description and track');
console.log('  3. set draft: false, commit and push: the workflow publishes it');
console.log('  4. npm run linkedin -- ' + slug + '   -> the LinkedIn post to paste');
console.log(ok ? 'ESITO: fatto' : 'ESITO: non fatto');
