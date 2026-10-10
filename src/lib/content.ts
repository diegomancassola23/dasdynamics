import { getCollection, type CollectionEntry } from 'astro:content';
import path from 'node:path';
import sharp from 'sharp';
import { TRACKS, VERDICTS } from '../content.config';

export type Entry = CollectionEntry<'articles'>;
export type Track = (typeof TRACKS)[number];
export type Verdict = (typeof VERDICTS)[number];
export { TRACKS, VERDICTS };

/** Drafts show in `npm run dev`, or in a build run with SHOW_DRAFTS=true (for previews and screenshots). */
export const SHOW_DRAFTS = import.meta.env.DEV || process.env.SHOW_DRAFTS === 'true';

const byDateDesc = (a: Entry, b: Entry) => b.data.date.valueOf() - a.data.date.valueOf();

export async function getAll(): Promise<Entry[]> {
  const all = await getCollection('articles', (e) => SHOW_DRAFTS || !e.data.draft);
  return all.sort(byDateDesc);
}

export const isArticle = (e: Entry) => e.data.kind === 'article';
export const isNote = (e: Entry) => e.data.kind === 'note';

/** Pinned first (newest first), then the rest by date. */
export function pinnedFirst(entries: Entry[]): Entry[] {
  return [...entries.filter((e) => e.data.pinned), ...entries.filter((e) => !e.data.pinned)];
}

export const articleUrl = (e: Entry | string) => `/articles/${typeof e === 'string' ? e : e.id}/`;
export const tagUrl = (tag: string) => `/tags/${slugify(tag)}/`;
export const trackUrl = (track: Track) => `/articles/track/${track}/`;
export const verdictUrl = (verdict: Verdict) => `/archive/${verdict}/`;

export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\+\+/g, 'pp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const dayFmt = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
export const formatDay = (d: Date) => dayFmt.format(d);
export const formatMonth = (d: Date) => monthFmt.format(d);
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** Entries of the same series, ordered by part. */
export function seriesOf(entry: Entry, all: Entry[]): Entry[] {
  if (!entry.data.series) return [];
  return all
    .filter((e) => e.data.series === entry.data.series)
    .sort((a, b) => (a.data.seriesPart ?? 0) - (b.data.seriesPart ?? 0) || a.data.date.valueOf() - b.data.date.valueOf());
}

/** "integration-architecture" -> "Integration Architecture". */
export const seriesTitle = (series: string) =>
  series
    .split('-')
    .map((w) => (w.length <= 3 && w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');

/** Notes per calendar year, oldest first, with empty years left out. */
export function notesPerYear(notes: Entry[]): { year: number; count: number }[] {
  const counts = new Map<number, number>();
  for (const n of notes) counts.set(n.data.date.getUTCFullYear(), (counts.get(n.data.date.getUTCFullYear()) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count }));
}

/** Versions in a stable, historical order. */
const VERSION_ORDER = ['AX 4.0', 'AX 2009', 'AX 2012', 'AX7', 'D365FO'];
export function versionsCovered(entries: Entry[]): string[] {
  const set = new Set(entries.flatMap((e) => e.data.versions));
  return [...set].sort((a, b) => {
    const ia = VERSION_ORDER.indexOf(a);
    const ib = VERSION_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
  });
}

export const readingMinutes = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 220));

export const isLinkedIn = (url?: string) => !!url && /^https:\/\/([a-z]+\.)?linkedin\.com\//.test(url);

export interface Cover {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const coverCache = new Map<string, Promise<Cover | undefined>>();

/** The entry's cover image with its real size (read from public/), or undefined when it has none. */
export function coverOf(e: Entry): Promise<Cover | undefined> {
  const { image, imageAlt } = e.data;
  if (!image) return Promise.resolve(undefined);
  if (!coverCache.has(image)) {
    coverCache.set(
      image,
      sharp(path.join(process.cwd(), 'public', image))
        .metadata()
        .then((m) => ({ src: image, alt: imageAlt ?? '', width: m.width ?? 1280, height: m.height ?? 720 })),
    );
  }
  return coverCache.get(image)!;
}
