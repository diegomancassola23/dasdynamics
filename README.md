# dasdynamics

**D as Dynamics. D as Diego.**

Diego Mancassola's personal site about Dynamics 365 Finance & Operations and AI.
New articles are published here first; LinkedIn gets a summary and a link.
The archive holds the Dynamics AX Notes posts (Blogger, 2014–2024), each re-read
with a verdict for D365FO today.

Static site built with [Astro](https://astro.build): no trackers, no external
JavaScript, fonts self-hosted.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies (Node 24). |
| `npm run dev` | Local preview at http://localhost:4321, drafts included. |
| `npm run new -- "My title"` | Create a draft article with the frontmatter filled in. |
| `npm run linkedin -- <slug>` | Print the LinkedIn post for an article (title, summary, link). |
| `npm run build` | Build the site into `dist/` (drafts left out). |
| `npm run check` | Quality gate on `dist/`: links, alt text, titles, descriptions, canonicals, JSON-LD. Prints `ESITO: fatto` / `ESITO: non fatto`. |
| `npm run preview` | Serve `dist/` locally. |
| `npm run og` | Regenerate `public/og-default.png` (uses the local Chrome). |
| `npm run screenshots` | Full-page screenshots of `dist/` into `docs/screenshots/` (local Chrome). |

`SHOW_DRAFTS=true npm run build` builds with drafts, for previews and screenshots.

How to write an article: [docs/WRITING.md](docs/WRITING.md).
Frontmatter: [docs/CONTENT-SCHEMA.md](docs/CONTENT-SCHEMA.md).

## Structure

```
site.config.mjs            site URL (domain still to choose) and name
astro.config.mjs           Astro config: sitemap, Markdown, code highlighting
src/content.config.ts      content collection and its schema
src/content/articles/      one Markdown file per article or archive note
src/data/editorial.json    archive editorial pass: retired and merged counts, then→now links
src/i18n/en.json, it.json  every UI string (only English is rendered for now)
src/lib/                   content helpers, author facts, the Markdown section plugin
src/components/            logo, header, footer, cards, verdict pill, archive and list pages
src/layouts/Base.astro     page shell: SEO, Open Graph, JSON-LD, fonts
src/pages/                 routes: /, /articles/, /archive/, /about/, /tags/, 404, rss.xml, robots.txt
public/                    favicon, Open Graph image, portrait, article images
scripts/                   new article, LinkedIn post, quality gate, OG image, screenshots
docs/                      schema, writing guide, open points (Italian), mockups, screenshots
sources/                   originals (Blogger feed, LinkedIn HTML), never edited
```

Routes:

- `/` home: hero, pinned and latest articles, four tracks, archive band, about.
- `/articles/` all long articles; `/articles/track/<track>/` per track.
- `/archive/` all archive notes by year; `/archive/<verdict>/` per verdict.
- `/articles/<slug>/` one page per article or note.
- `/about/`, `/tags/<tag>/`, `/rss.xml`, `/sitemap-index.xml`, `/robots.txt`.

## Deploy

### GitHub Pages (default)

`.github/workflows/deploy.yml` builds, runs the quality gate and deploys on every
push to `main`. In the repository settings: *Pages → Source: GitHub Actions*.
With a custom domain, add it under *Pages → Custom domain* and set `SITE_URL` in
`site.config.mjs`. Without a custom domain the site lives under
`https://<user>.github.io/<repo>/`: then also set `base: '/<repo>'` in
`astro.config.mjs` (or use a `<user>.github.io` repository).

### Azure Static Web Apps (alternative)

1. Create a Static Web App (Free plan is enough) linked to the GitHub repository,
   build preset *Astro*, app location `/`, output location `dist`.
2. Azure commits its own workflow; delete `.github/workflows/deploy.yml` so only
   one deploy runs.
3. Add the custom domain in the Static Web App and set `SITE_URL` in
   `site.config.mjs`.
4. Optional: a `public/staticwebapp.config.json` with
   `{ "responseOverrides": { "404": { "rewrite": "/404.html" } } }` to serve the
   404 page.

## Domain

Not chosen yet (see `docs/PUNTI-APERTI.md`). `site.config.mjs` uses
`https://dasdynamics.dev` as a placeholder: canonical URLs, sitemap, RSS and
Open Graph all follow it.
