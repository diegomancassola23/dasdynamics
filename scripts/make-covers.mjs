// Renders the generated cover of every article (src/lib/cover.mjs) to public/images/covers/<slug>.jpg,
// the Open Graph image of that article. The site itself inlines the same SVG.
// Run after adding an article or changing its title or track: npm run covers
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { findChrome } from './lib-chrome.mjs';
import { coverSvg, COVER_W, COVER_H } from '../src/lib/cover.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const en = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/en.json'), 'utf8'));
const articlesDir = path.join(root, 'src/content/articles');
const outDir = path.join(root, 'public/images/covers');
const font = (pkg, file) => pathToFileURL(path.join(root, 'node_modules/@fontsource', pkg, 'files', file)).href;

/** title, track and kind from the flat frontmatter. */
function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const get = (k) => {
    const raw = fm.match(new RegExp(`^${k}:\\s*(.*)$`, 'm'))?.[1]?.trim();
    return raw?.startsWith('"') ? JSON.parse(raw) : raw;
  };
  return { title: get('title'), track: get('track'), kind: get('kind') };
}

const articles = fs
  .readdirSync(articlesDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => ({ slug: f.replace(/\.md$/, ''), ...frontmatter(path.join(articlesDir, f)) }))
  .filter((a) => a.kind === 'article');

fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'covers-'));
const browser = await chromium.launch({ executablePath: findChrome() });
const tab = await browser.newPage({ viewport: { width: COVER_W, height: COVER_H } });

for (const a of articles) {
  const svg = coverSvg({
    slug: a.slug,
    title: a.title,
    label: `${en.tracks[a.track].short} · ${en.cover.article}`.toUpperCase(),
    footer: en.cover.footer,
  });
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fraunces;font-weight:600;src:url(${font('fraunces', 'fraunces-latin-600-normal.woff2')})}
@font-face{font-family:'IBM Plex Mono';font-weight:400;src:url(${font('ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2')})}
@font-face{font-family:'IBM Plex Sans';font-weight:400;src:url(${font('ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff2')})}
html,body{margin:0;width:${COVER_W}px;height:${COVER_H}px;overflow:hidden;background:#0B1028}svg{display:block}
</style></head><body>${svg}</body></html>`;
  const page = path.join(tmp, `${a.slug}.html`);
  fs.writeFileSync(page, html);
  await tab.goto(pathToFileURL(page).href);
  await tab.evaluate(() => document.fonts.ready);
  const png = await tab.screenshot({ type: 'png' });
  await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(outDir, `${a.slug}.jpg`));
}
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });

// Covers of articles that no longer exist.
const wanted = new Set(articles.map((a) => `${a.slug}.jpg`));
for (const f of fs.readdirSync(outDir)) if (!wanted.has(f)) fs.rmSync(path.join(outDir, f));

// Read back what is on disk.
let ok = 0;
let bytes = 0;
for (const a of articles) {
  const file = path.join(outDir, `${a.slug}.jpg`);
  if (!fs.existsSync(file)) { console.log(`MISSING ${a.slug}`); continue; }
  const m = await sharp(file).metadata();
  if (m.width === COVER_W && m.height === COVER_H && m.format === 'jpeg') ok++;
  else console.log(`WRONG ${a.slug}: ${m.width}x${m.height} ${m.format}`);
  bytes += fs.statSync(file).size;
}
const extra = fs.readdirSync(outDir).filter((f) => !wanted.has(f)).length;
console.log(`Covers: ${ok}/${articles.length} at ${COVER_W}x${COVER_H}, ${(bytes / 1024).toFixed(0)} KB in all, ${extra} extra file(s)`);
console.log(ok === articles.length && extra === 0 ? 'ESITO: fatto' : 'ESITO: non fatto');
