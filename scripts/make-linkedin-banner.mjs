// Renders the LinkedIn profile banner (1584x396 at 2x) in the site's "Notturno" style to docs/linkedin-banner.png.
// The left third stays quiet: LinkedIn puts the profile photo there.
// Run: node scripts/make-linkedin-banner.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import { findChrome } from './lib-chrome.mjs';
import { SITE_URL } from '../site.config.mjs';

const W = 1584;
const H = 396;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const en = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/en.json'), 'utf8'));
const out = path.join(root, 'docs/linkedin-banner.png');
const font = (pkg, file) => pathToFileURL(path.join(root, 'node_modules/@fontsource', pkg, 'files', file)).href;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Fixed seed: the banner is the same on every run.
let h = 20141;
const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) + 0x6d2b79f5) >>> 0) / 4294967296;

let stars = '';
for (let i = 0; i < 140; i++) {
  stars += `<circle cx="${Math.round(rnd() * W)}" cy="${Math.round(rnd() * H)}" r="${(rnd() * 1.7 + 0.4).toFixed(1)}" fill="#fff" opacity="${(rnd() * 0.6 + 0.2).toFixed(2)}"/>`;
}
const pts = [[1428, 44], [1476, 92], [1530, 66], [1552, 140], [1490, 196], [1540, 262]];
let constellation = `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#F5C66B" stroke-opacity=".5" stroke-width="2"/>`;
for (const [x, y] of pts) constellation += `<circle cx="${x}" cy="${y}" r="12" fill="#F5C66B" opacity=".16"/><circle cx="${x}" cy="${y}" r="4.5" fill="#FBE3A8"/>`;

const D_OUT = 'M20 25a7 7 0 0 1 7-7h15a30 30 0 0 1 0 60H27a7 7 0 0 1-7-7z';
const D_IN = 'M36 36a4 4 0 0 1 4-4h4a16 16 0 0 1 0 32h-4a4 4 0 0 1-4-4z';
const domain = SITE_URL.replace(/^https?:\/\//, '');
const x = 560;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
  + `<defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B1028"/><stop offset=".65" stop-color="#1B2152"/><stop offset="1" stop-color="#2E2763"/></linearGradient>`
  + `<radialGradient id="glow" cx=".88" cy=".25" r=".4"><stop offset="0" stop-color="#8E7BD6" stop-opacity=".25"/><stop offset="1" stop-color="#8E7BD6" stop-opacity="0"/></radialGradient></defs>`
  + `<rect width="${W}" height="${H}" fill="url(#sky)"/><rect width="${W}" height="${H}" fill="url(#glow)"/>`
  + stars + constellation
  + `<text x="${x}" y="112" font-family="'IBM Plex Mono', monospace" font-size="19" letter-spacing="3" fill="#F5C66B">${esc(en.home.eyebrow.toUpperCase())}</text>`
  // The payoff is the headline; the site address is the call to action below it.
  + `<text x="${x}" y="196" font-family="Fraunces, Georgia, serif" font-weight="600" font-size="64" fill="#F4EFE3">${esc(en.site.payoffLead)} <tspan fill="#F5C66B">${esc(en.site.payoffTail)}</tspan></text>`
  + `<g transform="translate(${x - 14} 236) scale(.85)"><path d="${D_OUT}" fill="none" stroke="#F4EFE3" stroke-width="7" stroke-linejoin="round"/><path d="${D_IN}" fill="#F5C66B"/></g>`
  + `<text x="${x + 70}" y="294" font-family="'IBM Plex Sans', sans-serif" font-size="38" fill="#F4EFE3">${esc(domain)} <tspan fill="#F5C66B">→</tspan></text>`
  + `</svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fraunces;font-weight:600;src:url(${font('fraunces', 'fraunces-latin-600-normal.woff2')})}
@font-face{font-family:'IBM Plex Mono';font-weight:400;src:url(${font('ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2')})}
@font-face{font-family:'IBM Plex Sans';font-weight:400;src:url(${font('ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff2')})}
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#0B1028}svg{display:block}
</style></head><body>${svg}</body></html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'banner-'));
const page = path.join(tmp, 'banner.html');
fs.writeFileSync(page, html);
const browser = await chromium.launch({ executablePath: findChrome() });
// Rendered at 2x (3168x792) so it stays sharp on high-density screens; LinkedIn scales it down.
const tab = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await tab.goto(pathToFileURL(page).href);
await tab.evaluate(() => document.fonts.ready);
await tab.screenshot({ path: out, type: 'png' });
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });

const ok = fs.existsSync(out) && fs.statSync(out).size > 10000;
console.log(ok ? `Wrote ${path.relative(root, out)} (${fs.statSync(out).size} bytes)` : 'Banner missing or empty');
console.log(ok ? 'ESITO: fatto' : 'ESITO: non fatto');
