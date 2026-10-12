// The "Notturno" cover: night sky, a constellation of linked nodes, and the site logo (D-inside-D) as the signature.
// One template for every article. The sky (stars and constellation) is seeded by the slug,
// so each cover is unique and stays the same across builds.
// Used inline by Cover.astro and rendered to JPEG for Open Graph by scripts/make-covers.mjs.

const D_OUT = 'M20 18h22a30 30 0 0 1 0 60H20z';
const D_IN = 'M36 32h8a16 16 0 0 1 0 32h-8z';
export const COVER_W = 1280;
export const COVER_H = 720;

/** Deterministic pseudo-random sequence from a string. */
function seeded(s) {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function wrap(text, max) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line);
      line = word;
    } else line = line ? line + ' ' + word : word;
  }
  if (line) lines.push(line);
  return lines;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r0 = (n) => Math.round(n);

/** Largest title size whose wrapped lines fit the left column (about 760px). */
function fitTitle(title) {
  for (const [size, maxLines] of [[64, 4], [56, 4], [50, 5], [44, 6]]) {
    const lines = wrap(title, Math.floor(740 / (size * 0.56)));
    if (lines.length <= maxLines) return { size, lines };
  }
  return { size: 44, lines: wrap(title, 30) };
}

/**
 * @param {{ slug: string, title: string, label: string, footer: string }} c
 *   label: the line above the title (e.g. "INTEGRATIONS · ARTICLE"); footer: the signature line.
 * @returns {string} SVG markup, 1280x720.
 */
export function coverSvg({ slug, title, label, footer }) {
  const rnd = seeded(slug);
  const id = `c-${slug}`;

  let stars = '';
  for (let i = 0; i < 90; i++) {
    stars += `<circle cx="${r0(rnd() * COVER_W)}" cy="${r0(rnd() * COVER_H)}" r="${(rnd() * 1.8 + 0.4).toFixed(1)}" fill="#fff" opacity="${(rnd() * 0.6 + 0.2).toFixed(2)}"/>`;
  }

  const n = 5 + Math.floor(rnd() * 3);
  const pts = Array.from({ length: n }, () => [r0(960 + rnd() * 260), r0(290 + rnd() * 340)]).sort((a, b) => a[0] - b[0]);
  let constellation = `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="#F5C66B" stroke-opacity=".55" stroke-width="2"/>`;
  for (const [x, y] of pts) constellation += `<circle cx="${x}" cy="${y}" r="14" fill="#F5C66B" opacity=".18"/><circle cx="${x}" cy="${y}" r="5" fill="#FBE3A8"/>`;

  const { size, lines } = fitTitle(title);
  const lead = r0(size * 1.2);
  const top = r0(372 - (lines.length * lead) / 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COVER_W} ${COVER_H}" width="${COVER_W}" height="${COVER_H}">`
    + `<defs><linearGradient id="${id}-sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B1028"/><stop offset=".7" stop-color="#1B2152"/><stop offset="1" stop-color="#2E2763"/></linearGradient>`
    + `<radialGradient id="${id}-glow" cx=".86" cy=".2" r=".35"><stop offset="0" stop-color="#8E7BD6" stop-opacity=".22"/><stop offset="1" stop-color="#8E7BD6" stop-opacity="0"/></radialGradient></defs>`
    + `<rect width="${COVER_W}" height="${COVER_H}" fill="url(#${id}-sky)"/><rect width="${COVER_W}" height="${COVER_H}" fill="url(#${id}-glow)"/>`
    + stars + constellation
    + `<text x="80" y="${top - 28}" font-family="'IBM Plex Mono', monospace" font-size="24" letter-spacing="4" fill="#F5C66B">${esc(label)}</text>`
    + `<text font-family="Fraunces, Georgia, serif" font-weight="600" font-size="${size}" fill="#F4EFE3">`
    + lines.map((l, i) => `<tspan x="80" y="${top + size + i * lead}">${esc(l)}</tspan>`).join('')
    + `</text>`
    // The logo as in the site header: outlined outer D, gold inner D.
    + `<g transform="translate(66 606) scale(.8)"><path d="${D_OUT}" fill="none" stroke="#F4EFE3" stroke-width="7"/><path d="${D_IN}" fill="#F5C66B"/></g>`
    + `<text x="148" y="652" font-family="'IBM Plex Sans', sans-serif" font-size="24" fill="#B9B6D9">${esc(footer)}</text>`
    + `</svg>`;
}
