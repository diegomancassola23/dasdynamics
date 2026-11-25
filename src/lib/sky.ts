import { TRACKS, slugify, type Entry, type Track } from './content';

/**
 * The topics page: every tag is a star, every track a constellation with its
 * sun in the middle. A tag belongs to the track where it appears most (ties
 * go to the first track); its brightness, 1 to 4, grows with how often it is
 * used. Each constellation also gets a drawn map, laid out at build time so
 * that no two labels touch: named stars (used more than once) are tried on a
 * golden-angle spiral until their label fits; stars used once become unlabeled
 * dust placed in the gaps.
 */

export interface Star {
  tag: string;
  url: string;
  n: number;
  brightness: 1 | 2 | 3 | 4;
  /** Twinkle delay in seconds, stable per tag. */
  delay: number;
}

export interface MapStar extends Star {
  x: number;
  y: number;
  r: number;
  /** Label size in map units; 0 for dust. */
  size: number;
  anchor: 'start' | 'end';
}

export interface SkyMap {
  width: number;
  height: number;
  sun: { x: number; y: number };
  stars: MapStar[];
  lines: { x1: number; y1: number; x2: number; y2: number }[];
}

export interface Constellation {
  track: Track;
  /** Entries in this track. */
  n: number;
  stars: Star[];
  map: SkyMap;
}

function hash(text: string): number {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0) / 4294967296;
}

const brightness = (n: number): Star['brightness'] => (n >= 8 ? 4 : n >= 4 ? 3 : n >= 2 ? 2 : 1);
const RADIUS = { 1: 1.8, 2: 3.4, 3: 4.6, 4: 6 } as const;
const FONT = { 1: 0, 2: 15, 3: 17, 4: 20 } as const;
/** IBM Plex Mono advances 0.6 em per character. */
const CHAR = 0.6;
const STEP = 44;
const FLAT = 0.72;

interface Box {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
const overlaps = (a: Box, b: Box, pad = 6) =>
  a.x1 < b.x2 + pad && b.x1 < a.x2 + pad && a.y1 < b.y2 + pad && b.y1 < a.y2 + pad;
const around = (x: number, y: number, r: number): Box => ({ x1: x - r, y1: y - r, x2: x + r, y2: y + r });

function labelBox(x: number, y: number, r: number, size: number, text: string, anchor: 'start' | 'end'): Box {
  const w = text.length * size * CHAR;
  const x1 = anchor === 'start' ? x + r + 6 : x - r - 6 - w;
  return { x1, y1: y - size * 0.7, x2: x1 + w, y2: y + size * 0.45 };
}

function layout(stars: Star[]): SkyMap {
  const placed: MapStar[] = [];
  const boxes: Box[] = [around(0, 0, 22)]; // the sun
  const points: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  const lines: SkyMap['lines'] = [];

  let slot = 1;
  for (const s of stars.filter((st) => st.n > 1)) {
    const r = RADIUS[s.brightness];
    const size = FONT[s.brightness];
    for (let tries = 0; tries < 400; tries++, slot++) {
      const angle = slot * 2.39996;
      const radius = STEP * Math.sqrt(slot);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * FLAT;
      const anchor = x >= 0 ? 'start' : 'end';
      const label = labelBox(x, y, r, size, s.tag, anchor);
      const dot = around(x, y, r + 4);
      if (boxes.some((b) => overlaps(b, label) || overlaps(b, dot))) continue;
      const near = points.reduce((best, p) => (Math.hypot(p.x - x, p.y - y) < Math.hypot(best.x - x, best.y - y) ? p : best));
      lines.push({ x1: near.x, y1: near.y, x2: x, y2: y });
      points.push({ x, y });
      boxes.push(label, dot);
      placed.push({ ...s, x, y, r, size, anchor });
      slot++;
      break;
    }
  }

  const reach = Math.max(STEP * 2, ...placed.map((p) => Math.hypot(p.x, p.y / FLAT))) + STEP * 0.6;
  for (const s of stars.filter((st) => st.n === 1)) {
    for (let k = 0; k < 60; k++) {
      const angle = hash(`${s.tag}:a${k}`) * Math.PI * 2;
      const radius = reach * (0.25 + 0.75 * Math.sqrt(hash(`${s.tag}:r${k}`)));
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * FLAT;
      const dot = around(x, y, 7);
      if (boxes.some((b) => overlaps(b, dot, 2))) continue;
      boxes.push(dot);
      placed.push({ ...s, x, y, r: RADIUS[1], size: 0, anchor: x >= 0 ? 'start' : 'end' });
      break;
    }
  }

  // Fit the view box around everything, labels included.
  const minX = Math.min(...boxes.map((b) => b.x1)) - 24;
  const minY = Math.min(...boxes.map((b) => b.y1)) - 24;
  const maxX = Math.max(...boxes.map((b) => b.x2)) + 24;
  const maxY = Math.max(...boxes.map((b) => b.y2)) + 24;
  const rx = (v: number) => Math.round((v - minX) * 10) / 10;
  const ry = (v: number) => Math.round((v - minY) * 10) / 10;

  return {
    width: Math.ceil(maxX - minX),
    height: Math.ceil(maxY - minY),
    sun: { x: rx(0), y: ry(0) },
    stars: placed.map((p) => ({ ...p, x: rx(p.x), y: ry(p.y) })),
    lines: lines.map((l) => ({ x1: rx(l.x1), y1: ry(l.y1), x2: rx(l.x2), y2: ry(l.y2) })),
  };
}

export function buildSky(entries: Entry[]): Constellation[] {
  const tags = new Map<string, { tag: string; n: number; byTrack: Map<Track, number> }>();
  for (const e of entries) {
    for (const tag of e.data.tags) {
      const key = slugify(tag);
      const item = tags.get(key) ?? { tag, n: 0, byTrack: new Map() };
      item.n++;
      item.byTrack.set(e.data.track, (item.byTrack.get(e.data.track) ?? 0) + 1);
      tags.set(key, item);
    }
  }

  const home = (byTrack: Map<Track, number>) => {
    const best = Math.max(...byTrack.values());
    return TRACKS.find((tr) => byTrack.get(tr) === best);
  };

  return TRACKS.map((track) => {
    const stars: Star[] = [...tags.entries()]
      .filter(([, v]) => home(v.byTrack) === track)
      .sort((a, b) => b[1].n - a[1].n || a[1].tag.localeCompare(b[1].tag))
      .map(([key, v]) => ({
        tag: v.tag,
        url: `/tags/${key}/`,
        n: v.n,
        brightness: brightness(v.n),
        delay: Math.round(hash(key) * 60) / 10,
      }));
    return { track, n: entries.filter((e) => e.data.track === track).length, stars, map: layout(stars) };
  }).filter((c) => c.stars.length > 0);
}
