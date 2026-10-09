import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { SITE_URL } from './site.config.mjs';
import rehypeSections from './src/lib/rehype-sections.mjs';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
  markdown: {
    // unified (remark/rehype) instead of the default Sätteri, for the small
    // rehype plugin that wraps "## In D365FO today" and friends in sections.
    processor: unified({ rehypePlugins: [rehypeSections] }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      // No X++ grammar ships with Shiki: X++ reads well with the C# grammar.
      langAlias: { xpp: 'csharp', 'x++': 'csharp' },
    },
  },
});
