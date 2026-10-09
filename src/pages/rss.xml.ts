import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { t } from '../i18n';
import { getAll, articleUrl } from '../lib/content';
import { AUTHOR } from '../lib/site';

export async function GET(context: APIContext) {
  const all = await getAll();
  return rss({
    title: t('rss.title'),
    description: t('rss.description'),
    site: context.site!,
    items: all.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.date,
      link: articleUrl(e),
      categories: [e.data.track, ...e.data.tags],
      author: AUTHOR.name,
    })),
    customData: '<language>en</language>',
  });
}
