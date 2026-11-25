// Builds docs/blogger-notice-gadget.html: an HTML/JavaScript gadget for the old Blogger theme that puts,
// at the top of each old post, a link to its new page on the site (retired posts link to the home page).
// The mapping comes from originalUrl/mergedFrom in the published articles. Run: node scripts/make-blogger-notice.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL } from '../site.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const posts = JSON.parse(fs.readFileSync(path.join(root, 'sources/blogger/posts.json'), 'utf8'));
const dir = path.join(root, 'src/content/articles');
const pathOf = (u) => new URL(u).pathname;

const slugByPath = new Map();
for (const f of fs.readdirSync(dir)) {
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  if (/^draft: true/m.test(text)) continue;
  for (const u of text.match(/https?:\/\/dynamicsaxnotes\.blogspot\.com[^"'\s\],]*/g) ?? []) slugByPath.set(pathOf(u), f.replace(/\.md$/, ''));
}

const map = {};
for (const p of posts) map[pathOf(p.url)] = slugByPath.get(pathOf(p.url)) ?? '';

const site = SITE_URL.replace(/\/$/, '');
const html = `<script>
(function () {
  var map = ${JSON.stringify(map)};
  var path = location.pathname;
  if (!(path in map)) return;
  var url = '${site}/' + (map[path] ? 'articles/' + map[path] + '/' : '');
  var text = map[path]
    ? '<b>This note has moved.</b> An updated version, checked against today\\'s D365FO, is on <a href="' + url + '">dasdynamics.dev</a>.'
    : '<b>This blog has moved</b> to <a href="' + url + '">dasdynamics.dev</a>, where my notes are re-read against today\\'s D365FO.';
  function add() {
    var body = document.querySelector('.post-body');
    if (!body || document.getElementById('dasdynamics-moved')) return;
    var p = document.createElement('p');
    p.id = 'dasdynamics-moved';
    p.style.cssText = 'padding:10px 14px;border-left:4px solid #1D4ED8;background:#F1F5FF;color:#111';
    p.innerHTML = text;
    body.insertBefore(p, body.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();
</script>
`;

const out = path.join(root, 'docs/blogger-notice-gadget.html');
fs.writeFileSync(out, html);
const mapped = Object.values(map).filter(Boolean).length;
const ok = fs.readFileSync(out, 'utf8') === html && Object.keys(map).length === posts.length;
console.log(`posts ${posts.length}, linked to their note ${mapped}, linked to the home page ${posts.length - mapped}`);
console.log(ok ? 'ESITO: fatto' : 'ESITO: non fatto');
