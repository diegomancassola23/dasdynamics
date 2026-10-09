// Quality gate on the built site (run `npm run build` first).
// Scans dist/ for broken internal links, images without alt, pages without
// <title>, meta description or canonical, and pages missing the JSON-LD they need.
// Prints ESITO: fatto when everything passes, ESITO: non fatto otherwise.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  console.log('dist/ not found: run `npm run build` first.');
  console.log('ESITO: non fatto');
  process.exit(1);
}

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));

const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const problems = [];
const rel = (f) => path.relative(dist, f).split(path.sep).join('/');

/** Does an internal URL path resolve to a file in dist/? */
function resolves(urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return fs.existsSync(path.join(dist, 'index.html'));
  const target = path.join(dist, clean);
  if (clean.endsWith('/')) return fs.existsSync(path.join(target, 'index.html'));
  return fs.existsSync(target) || fs.existsSync(target + '.html') || fs.existsSync(path.join(target, 'index.html'));
}

/** Collect ids in a page for #fragment checks. */
const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

const cache = new Map();
const pageHtml = (f) => {
  if (!cache.has(f)) cache.set(f, fs.readFileSync(f, 'utf8'));
  return cache.get(f);
};

function fileForPath(urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  const target = path.join(dist, clean);
  if (clean.endsWith('/') || clean === '') return path.join(target, 'index.html');
  return fs.existsSync(target) ? target : path.join(target, 'index.html');
}

for (const file of htmlFiles) {
  const html = pageHtml(file);
  const name = rel(file);
  const is404 = name === '404.html';
  const urlPath = '/' + name.replace(/index\.html$/, '').replace(/\.html$/, '');

  // head
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${name}: missing <title>`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/);
  if (!desc || !desc[1].trim()) problems.push(`${name}: missing meta description`);
  else if (desc[1].length > 200) problems.push(`${name}: meta description longer than 200 characters`);
  if (!is404 && !/<link rel="canonical" href="https?:\/\/[^"]+"/.test(html)) problems.push(`${name}: missing canonical`);
  if (!/<html lang="[a-z]{2}/.test(html)) problems.push(`${name}: missing <html lang>`);
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) problems.push(`${name}: expected exactly one <h1>`);

  // images
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="[^"]*"/.test(m[0])) problems.push(`${name}: <img> without alt: ${m[0].slice(0, 80)}`);
  }

  // links
  const own = idsOf(html);
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g, '&');
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(url) || url.startsWith('//')) continue;
    if (url.startsWith('#')) {
      if (url.length > 1 && !own.has(url.slice(1))) problems.push(`${name}: broken fragment ${url}`);
      continue;
    }
    const abs = url.startsWith('/') ? url : path.posix.join(urlPath.endsWith('/') ? urlPath : path.posix.dirname(urlPath) + '/', url);
    if (!resolves(abs)) {
      problems.push(`${name}: broken internal link ${url}`);
      continue;
    }
    const frag = url.split('#')[1];
    if (frag) {
      const target = fileForPath(abs);
      if (target.endsWith('.html') && fs.existsSync(target) && !idsOf(pageHtml(target)).has(frag)) problems.push(`${name}: broken fragment ${url}`);
    }
  }

  // structured data
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      problems.push(`${name}: JSON-LD does not parse`);
      return {};
    }
  });
  const types = new Set(ld.flatMap((d) => [d['@type'], d.mainEntity?.['@type']]).filter(Boolean));
  if (urlPath === '/' && !types.has('Person')) problems.push(`${name}: home page lacks JSON-LD Person`);
  if (urlPath === '/about/' && !types.has('Person')) problems.push(`${name}: about page lacks JSON-LD Person`);
  const isArticlePage = /^\/articles\/(?!track\/)[^/]+\/$/.test(urlPath);
  if (isArticlePage && !types.has('BlogPosting')) problems.push(`${name}: article lacks JSON-LD BlogPosting`);
}

// required files
for (const f of ['robots.txt', 'rss.xml', 'sitemap-index.xml', 'favicon.svg', 'og-default.png', '404.html']) {
  if (!fs.existsSync(path.join(dist, f))) problems.push(`missing ${f}`);
}

// en.json and it.json carry the same keys
const keysOf = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' ? keysOf(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
const dict = (lang) => JSON.parse(fs.readFileSync(path.join(root, 'src/i18n', `${lang}.json`), 'utf8'));
const en = new Set(keysOf(dict('en')));
const it = new Set(keysOf(dict('it')));
for (const k of en) if (!it.has(k)) problems.push(`it.json lacks "${k}"`);
for (const k of it) if (!en.has(k)) problems.push(`en.json lacks "${k}"`);

console.log(`Checked ${htmlFiles.length} HTML pages in dist/.`);
if (problems.length) {
  for (const p of problems) console.log(' - ' + p);
  console.log(`${problems.length} problem(s).`);
  console.log('ESITO: non fatto');
  process.exit(1);
}
console.log('No problems found.');
console.log('ESITO: fatto');
