// Generates public/og-default.png (1200x630), the default Open Graph image.
// Renders an HTML card with the self-hosted fonts in headless Chrome, then
// optimises it with sharp. Run: npm run og
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { findChrome } from './lib-chrome.mjs';
import { SITE_URL } from '../site.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const en = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/en.json'), 'utf8'));
const font = (pkg, file) => pathToFileURL(path.join(root, 'node_modules/@fontsource', pkg, 'files', file)).href;
const out = path.join(root, 'public/og-default.png');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:SG;font-weight:700;src:url(${font('space-grotesk', 'space-grotesk-latin-700-normal.woff2')})}
@font-face{font-family:SG;font-weight:500;src:url(${font('space-grotesk', 'space-grotesk-latin-500-normal.woff2')})}
@font-face{font-family:PM;font-weight:400;src:url(${font('ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2')})}
html,body{margin:0;width:1200px;height:630px;background:#12161C;color:#F4F5F1;overflow:hidden}
.card{box-sizing:border-box;width:1200px;height:630px;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;align-items:center;gap:28px}
.word{font:700 88px/1 SG;letter-spacing:-2px}
.payoff{font:500 44px/1.2 SG;letter-spacing:-0.5px}
.payoff em{font-style:normal;color:#7CC4FF}
.rule{width:96px;height:8px;background:#1D4ED8;margin-bottom:28px}
.meta{font:400 24px/1.4 PM;color:#A9B4C7;letter-spacing:1px}
</style></head><body><div class="card">
<div class="top"><svg width="150" height="150" viewBox="0 0 96 96"><path d="M20 18h22a30 30 0 0 1 0 60H20z" fill="none" stroke="#F4F5F1" stroke-width="7"/><path d="M36 32h8a16 16 0 0 1 0 32h-8z" fill="#7CC4FF"/></svg>
<div class="word">${en.site.name}</div></div>
<div><div class="rule"></div><div class="payoff">${en.site.payoffLead} <em>${en.site.payoffTail}</em></div></div>
<div class="meta">${en.site.tagline.replace("&", "&amp;")}<br>${en.site.author} · ${new URL(SITE_URL).host}</div>
</div></body></html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'og-'));
const page = path.join(tmp, 'og.html');
fs.writeFileSync(page, html);

const browser = await chromium.launch({ executablePath: findChrome() });
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await tab.goto(pathToFileURL(page).href);
await tab.evaluate(() => document.fonts.ready);
const png = await tab.screenshot({ type: 'png' });
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });

await sharp(png).resize(1200, 630).png({ compressionLevel: 9, palette: true }).toFile(out);
const meta = await sharp(out).metadata();
console.log(`${path.relative(root, out)}: ${meta.width}x${meta.height}`);
console.log(meta.width === 1200 && meta.height === 630 ? 'ESITO: fatto' : 'ESITO: non fatto');
