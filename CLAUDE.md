# dasdynamics (repo folder: dynamicsdreams)

Diego Mancassola's personal site: articles on Dynamics 365 Finance & Operations and AI.
The site is the home of new articles; LinkedIn only carries a summary and a link.

## Rules

- Site copy, code, file names, comments and commits in English. Open points (`docs/PUNTI-APERTI.md`) stay in Italian.
- Diego works alone on this repo: no feature-branch requirement. Push only when Diego asks; the remote is not set yet.
- `sources/` holds the originals (Blogger feed, LinkedIn HTML) as downloaded by `scripts/fetch-sources.mjs`. Never edit them.
- Articles live in `src/content/articles/` as Markdown with the frontmatter in `docs/CONTENT-SCHEMA.md`.
- Never invent technical facts. A D365FO claim in a rewrite is either in the original, or verified on Microsoft Learn and linked, or the note is marked `to-review`.
- No customer names, no secrets, no e-mail addresses in pages.
- JSON in UTF-8 without BOM.
- Scripts that change things re-read and print `ESITO: fatto` or `ESITO: non fatto`.
- Site: Astro, see `README.md`. Writing guide: `docs/WRITING.md`. UI strings live in `src/i18n/en.json` and `it.json`, never in components.
- Before committing site changes: `npm run build` then `npm run check` must print `ESITO: fatto`.
