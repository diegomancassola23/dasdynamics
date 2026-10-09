// Full-page screenshots of the built site (dist/) at 1440 and 390 px, light
// and dark, saved under docs/screenshots/. Uses the local Chrome through
// playwright-core. Run `npm run build` first, then: npm run screenshots
// Optional: pass page paths, e.g. `npm run screenshots -- / /archive/`.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { findChrome } from './lib-chrome.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const outDir = path.join(root, 'docs/screenshots');
fs.mkdirSync(outDir, { recursive: true });

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(dist, p);
  if (!file.startsWith(dist) || !fs.existsSync(file)) {
    res.writeHead(404, { 'Content-Type': types['.html'] });
    res.end(fs.readFileSync(path.join(dist, '404.html')));
    return;
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// Default sample: a published note with the "changed" verdict (dark box) and a published article in a series.
const articlesSrc = path.join(root, 'src/content/articles');
const front = (f) => (fs.readFileSync(path.join(articlesSrc, f), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/) || [, ''])[1];
const published = fs.readdirSync(articlesSrc).filter((f) => f.endsWith('.md') && !/^draft: true\s*$/m.test(front(f))).sort();
const pick = (re) => published.find((f) => re.test(front(f)))?.replace(/\.md$/, '');
const samples = [pick(/^verdict: changed\s*$/m), pick(/^series: /m)].filter(Boolean).map((s) => `/articles/${s}/`);
// Paths may be given without the leading slash (Git Bash rewrites '/x' into a Windows path).
const pages = process.argv.slice(2).length ? process.argv.slice(2).map((p) => (p.startsWith('/') ? p : '/' + p)) : ['/', '/archive/', ...samples];
const widths = [1440, 390];
const schemes = ['light', 'dark'];

const browser = await chromium.launch({ executablePath: findChrome() });
const written = [];
let imagesOk = true;
for (const scheme of schemes) {
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, deviceScaleFactor: 1 });
    const tab = await ctx.newPage();
    for (const p of pages) {
      await tab.goto(base + p, { waitUntil: 'networkidle' });
      await tab.evaluate(() => document.fonts.ready);
      // Scroll through the page so lazily loaded images are fetched, then wait for every image.
      await tab.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 50));
        }
        window.scrollTo(0, 0);
        await Promise.all([...document.images].map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }))));
        await Promise.all([...document.images].map((img) => img.decode().catch(() => null)));
      });
      const broken = await tab.evaluate(() => [...document.images].filter((img) => !img.naturalWidth).map((img) => img.getAttribute('src')));
      if (broken.length) imagesOk = false;
      if (broken.length) console.log(`WARNING images not loaded on ${p} at ${width}: ${broken.join(', ')}`);
      const overflow = await tab.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) console.log(`WARNING horizontal overflow ${overflow}px on ${p} at ${width}`);
      const name = (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-')) + `-${width}-${scheme}.png`;
      await tab.screenshot({ path: path.join(outDir, name), fullPage: true });
      written.push(name);
    }
    await ctx.close();
  }
}
await browser.close();
server.close();

const ok = imagesOk && written.every((n) => fs.existsSync(path.join(outDir, n)));
console.log(written.map((n) => 'docs/screenshots/' + n).join('\n'));
console.log(ok ? 'ESITO: fatto' : 'ESITO: non fatto');
