// Validates the content collection against docs/CONTENT-SCHEMA.md and checks that
// every source URL (Blogger feed + LinkedIn index) is accounted for in docs/CONTENT-REPORT.md,
// and that every article has its generated cover (public/images/covers/<slug>.jpg, made by `npm run covers`).
// Usage: node scripts/validate-content.mjs
// Prints every problem found, then "ESITO: fatto" or "ESITO: non fatto".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articlesDir = path.join(root, 'src/content/articles');
const reportPath = path.join(root, 'docs/CONTENT-REPORT.md');
const postsPath = path.join(root, 'sources/blogger/posts.json');
const linkedinPath = path.join(root, 'sources/linkedin/index.json');

const KINDS = ['article', 'note'];
const TRACKS = ['integrations', 'ai', 'xpp', 'platform'];
const VERDICTS = ['valid', 'changed', 'historical', 'to-review'];
const REQUIRED = ['title', 'description', 'date', 'kind', 'track', 'versions', 'tags', 'draft'];
// Imported entries come from the blog or LinkedIn; native articles are written on the site and have no source URL.
const IMPORT_REQUIRED = ['originalUrl', 'mergedFrom'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

const readText = p => {
  const buf = fs.readFileSync(p);
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) fail(path.relative(root, p), 'file starts with a UTF-8 BOM');
  return buf.toString('utf8');
};

// Minimal parser for the flat frontmatter used here: scalars, quoted strings and inline JSON-style arrays.
function parseFrontmatter(text, where) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) { fail(where, 'missing frontmatter'); return null; }
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const kv = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!kv) { fail(where, `unreadable frontmatter line: ${line}`); continue; }
    const [, key, raw] = kv;
    let value = raw.trim();
    if (value.startsWith('[') || value.startsWith('"')) {
      try { value = JSON.parse(value); } catch { fail(where, `invalid value for ${key}: ${raw}`); continue; }
    } else if (value === 'true' || value === 'false') value = value === 'true';
    else if (/^\d+$/.test(value)) value = Number(value);
    if (key in data) fail(where, `duplicate key ${key}`);
    data[key] = value;
  }
  return { data, body: text.slice(m[0].length) };
}

const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md')).sort();
const entries = [];
const seenUrls = new Map();
const seenTitles = new Map();

for (const file of files) {
  const where = `src/content/articles/${file}`;
  const slug = file.replace(/\.md$/, '');
  if (!SLUG.test(slug)) fail(where, 'slug is not lower-case and hyphenated');
  const parsed = parseFrontmatter(readText(path.join(articlesDir, file)), where);
  if (!parsed) continue;
  const { data: d, body } = parsed;
  entries.push({ slug, d, body, where });

  const native = d.kind === 'article' && !('originalUrl' in d);
  for (const k of native ? REQUIRED : [...REQUIRED, ...IMPORT_REQUIRED]) if (!(k in d)) fail(where, `missing ${k}`);
  if (typeof d.title !== 'string' || !d.title.trim()) fail(where, 'title must be a non-empty string');
  if (typeof d.description !== 'string' || !d.description.trim()) fail(where, 'description must be a non-empty string');
  else if (d.description.length > 160) fail(where, `description is ${d.description.length} characters (max 160)`);
  if (!DATE.test(String(d.date))) fail(where, 'date must be YYYY-MM-DD');
  if ('updated' in d && !DATE.test(String(d.updated))) fail(where, 'updated must be YYYY-MM-DD');
  if (!KINDS.includes(d.kind)) fail(where, `kind must be one of ${KINDS.join(', ')}`);
  if (!TRACKS.includes(d.track)) fail(where, `track must be one of ${TRACKS.join(', ')}`);
  for (const k of ['versions', 'tags', 'mergedFrom']) {
    if (k in d && (!Array.isArray(d[k]) || d[k].some(v => typeof v !== 'string'))) fail(where, `${k} must be an array of strings`);
  }
  if (Array.isArray(d.versions) && d.versions.length === 0) fail(where, 'versions must not be empty');
  if (Array.isArray(d.tags) && d.tags.length === 0) fail(where, 'tags must not be empty');
  if (!native && (typeof d.originalUrl !== 'string' || !/^https:\/\//.test(d.originalUrl))) fail(where, 'originalUrl must be an https URL');
  if (native ? typeof d.draft !== 'boolean' : d.draft !== false) fail(where, native ? 'draft must be true or false' : 'draft must be false for imported entries');
  if (('series' in d) !== ('seriesPart' in d)) fail(where, 'series and seriesPart go together');
  if ('seriesPart' in d && (!Number.isInteger(d.seriesPart) || d.seriesPart < 1)) fail(where, 'seriesPart must be a positive integer');
  if ('image' in d || 'imageAlt' in d) fail(where, 'image and imageAlt are no longer used: every article has the generated cover');

  if (d.kind === 'article' && !fs.existsSync(path.join(root, 'public/images/covers', `${slug}.jpg`))) {
    fail(where, `generated cover missing: run npm run covers (public/images/covers/${slug}.jpg)`);
  }

  if (d.kind === 'note') {
    if (!VERDICTS.includes(d.verdict)) fail(where, `verdict must be one of ${VERDICTS.join(', ')}`);
    if (typeof d.verdictNote !== 'string' || !d.verdictNote.trim()) fail(where, 'verdictNote is required for notes');
    if (!('updated' in d)) fail(where, 'updated is required for rewritten notes');
    if (!/^## The original note$/m.test(body)) fail(where, 'note body lacks "## The original note"');
    if (!/^## References$/m.test(body)) fail(where, 'note body lacks "## References"');
    const today = /^## In D365FO today$/m.test(body);
    if (today && !['valid', 'changed'].includes(d.verdict)) fail(where, '"## In D365FO today" is only for valid or changed notes');
    if (today) {
      const section = body.split(/^## In D365FO today$/m)[1].split(/^## /m)[0];
      if (!/https:\/\/learn\.microsoft\.com\//.test(section)) fail(where, '"## In D365FO today" has no Microsoft Learn link');
    }
  } else if (d.kind === 'article') {
    if ('verdict' in d || 'verdictNote' in d) fail(where, 'verdict and verdictNote are for notes only');
  }

  for (const u of [d.originalUrl, ...(Array.isArray(d.mergedFrom) ? d.mergedFrom : [])]) {
    if (typeof u !== 'string') continue;
    if (seenUrls.has(u)) fail(where, `source URL already used by ${seenUrls.get(u)}: ${u}`);
    else seenUrls.set(u, slug);
  }
  if (typeof d.title === 'string') {
    if (seenTitles.has(d.title)) fail(where, `title already used by ${seenTitles.get(d.title)}`);
    else seenTitles.set(d.title, slug);
  }
}

// Internal links must point to existing slugs.
const slugs = new Set(entries.map(e => e.slug));
for (const e of entries) {
  for (const m of e.body.matchAll(/\]\(\/articles\/([^/)]+)\/?\)/g)) {
    if (!slugs.has(m[1])) fail(e.where, `link to unknown article /articles/${m[1]}/`);
  }
}

// Series: each part number appears once per series.
const series = new Map();
for (const e of entries) {
  if (!e.d.series) continue;
  const key = `${e.d.series}#${e.d.seriesPart}`;
  if (series.has(key)) fail(e.where, `series part ${key} already used by ${series.get(key)}`);
  else series.set(key, e.slug);
}

// Every source URL must be in the report, mapped to an existing slug or retired with a reason.
const posts = JSON.parse(readText(postsPath));
const linkedin = JSON.parse(readText(linkedinPath));
const sources = [...linkedin.map(a => a.url), ...posts.map(p => p.url)];
let report = '';
if (!fs.existsSync(reportPath)) fail('docs/CONTENT-REPORT.md', 'missing');
else report = readText(reportPath);
const reportLines = report.split(/\r?\n/);
let accounted = 0;
for (const url of sources) {
  const line = reportLines.find(l => l.startsWith('|') && l.includes(` ${url} `));
  if (!line) { fail('docs/CONTENT-REPORT.md', `source URL not in the table: ${url}`); continue; }
  const retired = /\bretired: \S/.test(line);
  const target = (line.match(/`([a-z0-9-]+)`/) || [])[1];
  if (retired) { accounted++; continue; }
  if (!target || !slugs.has(target)) { fail('docs/CONTENT-REPORT.md', `row for ${url} has no existing slug and no "retired: reason"`); continue; }
  if (seenUrls.get(url) !== target) { fail('docs/CONTENT-REPORT.md', `row for ${url} says ${target}, but the frontmatter says ${seenUrls.get(url) || 'nothing'}`); continue; }
  accounted++;
}
// Every originalUrl/mergedFrom in the collection must be a known source.
const sourceSet = new Set(sources);
for (const [u, slug] of seenUrls) if (!sourceSet.has(u)) fail(`src/content/articles/${slug}.md`, `URL is not in sources/: ${u}`);

const notes = entries.filter(e => e.d.kind === 'note');
const counts = Object.fromEntries(VERDICTS.map(v => [v, notes.filter(e => e.d.verdict === v).length]));
console.log(`Entries: ${entries.length} (articles ${entries.length - notes.length}, notes ${notes.length})`);
console.log(`Generated covers: ${entries.filter(e => e.d.kind === 'article' && fs.existsSync(path.join(root, 'public/images/covers', `${e.slug}.jpg`))).length}`);
console.log(`Verdicts: ${VERDICTS.map(v => `${v} ${counts[v]}`).join(', ')}`);
console.log(`Source URLs accounted for: ${accounted}/${sources.length} (blog ${posts.length}, LinkedIn ${linkedin.length})`);
for (const p of problems) console.log(`PROBLEM ${p}`);
console.log(problems.length === 0 && accounted === sources.length ? 'ESITO: fatto' : 'ESITO: non fatto');
process.exitCode = problems.length === 0 && accounted === sources.length ? 0 : 1;
