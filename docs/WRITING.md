# Writing an article

## 1. Create

```
npm run new -- "My title"
```

This creates `src/content/articles/<slug>.md` with the frontmatter filled in
(`kind: article`, today's date, `draft: true`) and an empty images folder.
Fill `description` (one sentence, max 160 characters: it is what Google and
LinkedIn show), `track` (`integrations`, `ai`, `xpp` or `platform`) and
`tags` (the template puts `["d365fo"]`: at least one tag is required).
All fields: [CONTENT-SCHEMA.md](CONTENT-SCHEMA.md).

## 2. Preview

```
npm run dev
```

Open http://localhost:4321/articles/<slug>/. The page reloads as you save.
Drafts are visible here, with a "Draft" banner.

Code blocks: use ` ```xpp `, ` ```sql `, ` ```csharp `, ` ```powershell `,
` ```json ` or ` ```yaml `.

## 3. Images

Put them in `public/images/articles/<slug>/` and link them with a description:

```
![The APIM policy editor with the rate-limit policy](/images/articles/<slug>/policy.png)
```

The description (alt text) is required: the quality gate fails without it.

## 4. Cover

Every article gets the same night-sky cover, made from its title and track:
nothing to draw. After creating an article, or changing its title or track, run:

```
npm run covers
```

It writes `public/images/covers/<slug>.jpg`, the picture shown when the link is
shared (LinkedIn, X). On the site the same cover is drawn inline. The validator
fails if an article has no cover file.

## 5. Pinned

`pinned: true` puts the article first on the home page. Keep one or two.

## 6. Publish

1. Set `draft: false`.
2. `npm run build` and `npm run check` (optional: the workflow runs both).
3. Commit and push to `main`: the workflow builds and deploys the site.
4. `npm run linkedin -- <slug>` prints the LinkedIn post: title, summary and the
   link to the site. Paste it on LinkedIn.
