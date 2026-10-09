// Prints a ready-to-paste LinkedIn post for an article: npm run linkedin -- <slug>
// Title, description and the link to the article on the site.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL } from '../site.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = (process.argv[2] ?? '').replace(/\.md$/, '').split(/[\\/]/).pop();
const file = path.join(root, 'src/content/articles', `${slug}.md`);
if (!slug || !fs.existsSync(file)) {
  console.error(slug ? `Not found: src/content/articles/${slug}.md` : 'Usage: npm run linkedin -- <slug>');
  process.exit(1);
}

// Minimal frontmatter reader: top-level "key: value" lines only.
const fm = fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
const lines = fm.split(/\r?\n/);
const field = (key) => {
  const line = lines.find((l) => l.startsWith(key + ':'));
  if (!line) return '';
  const v = line.slice(key.length + 1).trim();
  const quoted = v.match(/^"((?:[^"\\]|\\.)*)"/);
  if (quoted) return JSON.parse(`"${quoted[1]}"`);
  return v.replace(/\s+#.*$/, '').replace(/^'(.*)'$/, '$1');
};
const tags = (fm.match(/^tags:\s*\[(.*)\]/m)?.[1] ?? '')
  .split(',')
  .map((t) => t.trim().replace(/^["']|["']$/g, ''))
  .filter(Boolean);

const url = new URL(`/articles/${slug}/`, SITE_URL).href;
const hashtags = ['D365FO', 'Dynamics365', ...tags.map((t) => t.replace(/[^A-Za-z0-9]/g, ''))]
  .filter((t, i, a) => t && a.findIndex((x) => x.toLowerCase() === t.toLowerCase()) === i)
  .map((t) => '#' + t);

if (field('draft') === 'true') console.error('Note: this article is still a draft (draft: true). Publish it before posting.\n');

console.log(`${field('title')}

${field('description')}

Read the full article on my site:
${url}

${hashtags.join(' ')}`);
