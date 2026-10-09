// Downloads the original sources (Blogger feed and LinkedIn articles) into sources/.
// Re-reads what it wrote and prints ESITO: fatto / non fatto.
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_FEED = 'https://dynamicsaxnotes.blogspot.com/feeds/posts/default?alt=json&max-results=500';
const LINKEDIN = [
  'https://www.linkedin.com/pulse/d365fo-integration-architecture-real-world-approach-rest-mancassola-1hulf/',
  'https://www.linkedin.com/pulse/extending-copilot-chat-d365fo-what-worked-didnt-i-diego-mancassola-pmnif/',
  'https://www.linkedin.com/pulse/d365fo-integration-architecture-real-world-approach-rest-mancassola-gqbzf/',
  'https://www.linkedin.com/pulse/d356fo-copilot-code-review-diego-mancassola-aoynf/',
  'https://www.linkedin.com/pulse/virtual-zpl-printer-d365fo-diego-mancassola-ldw4f/',
  'https://www.linkedin.com/pulse/automating-label-creation-x-d365fo-diego-mancassola-j5d3f/',
  'https://www.linkedin.com/pulse/overcoming-incomplete-status-cloud-hosted-dynamics-365-mancassola-2anbf/',
  'https://www.linkedin.com/pulse/resolving-ssltls-secure-channel-error-net-diego-mancassola-awksf/',
  'https://www.linkedin.com/pulse/multithreading-d365fo-diego-mancassola-j4s8e/'
];
const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36' };

await mkdir(join(root, 'sources/blogger'), { recursive: true });
await mkdir(join(root, 'sources/linkedin'), { recursive: true });

const feed = await (await fetch(BLOG_FEED)).json();
const posts = (feed.feed.entry || []).map((e) => ({
  title: e.title.$t,
  published: e.published.$t,
  updated: e.updated.$t,
  url: (e.link.find((l) => l.rel === 'alternate') || {}).href,
  labels: (e.category || []).map((c) => c.term),
  html: (e.content || e.summary || {}).$t || ''
}));
await writeFile(join(root, 'sources/blogger/posts.json'), JSON.stringify(posts, null, 2), 'utf8');

const index = [];
for (const url of LINKEDIN) {
  const slug = url.split('/pulse/')[1].replace(/\/$/, '');
  const html = await (await fetch(url, { headers: UA })).text();
  const date = (html.match(/"datePublished":"([^"]+)"/) || [])[1] || null;
  await writeFile(join(root, `sources/linkedin/${slug}.html`), html, 'utf8');
  index.push({ slug, url, datePublished: date, bytes: html.length });
}
await writeFile(join(root, 'sources/linkedin/index.json'), JSON.stringify(index, null, 2), 'utf8');

// Re-read and verify
const back = JSON.parse(await readFile(join(root, 'sources/blogger/posts.json'), 'utf8'));
const li = JSON.parse(await readFile(join(root, 'sources/linkedin/index.json'), 'utf8'));
const okLi = li.every((x) => x.bytes > 50000 && x.datePublished);
console.log(`blogger posts: ${back.length} (feed says ${feed.feed.openSearch$totalResults.$t})`);
console.log(`linkedin articles: ${li.length}, all with body and date: ${okLi}`);
console.log(back.length === Number(feed.feed.openSearch$totalResults.$t) && li.length === LINKEDIN.length && okLi ? 'ESITO: fatto' : 'ESITO: non fatto');
