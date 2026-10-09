import en from './en.json';
import it from './it.json';

// The site renders English only for now; it.json is kept in step for later.
const dictionaries = { en, it } as const;
export type Locale = keyof typeof dictionaries;
export const locale: Locale = 'en';

/** Look up a dotted key ("nav.archive") and fill {placeholders}. */
export function t(key: string, vars: Record<string, string | number> = {}, lang: Locale = locale): string {
  const value = key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], dictionaries[lang]);
  if (typeof value !== 'string') throw new Error(`Missing UI string "${key}" in ${lang}.json`);
  return value.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? String(vars[name]) : `{${name}}`));
}
