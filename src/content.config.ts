import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Mirrors docs/CONTENT-SCHEMA.md. Keep the two in step.
export const TRACKS = ['integrations', 'ai', 'xpp', 'platform'] as const;
export const VERDICTS = ['valid', 'changed', 'historical', 'to-review'] as const;

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z
    .object({
      title: z.string().min(1),
      description: z.string().max(160),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      kind: z.enum(['article', 'note']),
      track: z.enum(TRACKS),
      versions: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      verdict: z.enum(VERDICTS).optional(),
      verdictNote: z.string().optional(),
      originalUrl: z.url().optional(),
      mergedFrom: z.array(z.url()).default([]),
      series: z.string().optional(),
      seriesPart: z.number().int().positive().optional(),
      cover: z.string().max(12).optional(),
      // Cover image under public/: /images/articles/<slug>/cover.<ext>. Needs imageAlt.
      image: z.string().regex(/^\/images\/articles\/[a-z0-9-]+\/[\w.-]+\.(png|jpe?g|webp|gif|avif)$/).optional(),
      imageAlt: z.string().min(1).optional(),
      pinned: z.boolean().default(false),
      draft: z.boolean().default(false),
    })
    .refine((d) => d.kind !== 'note' || d.verdict !== undefined, {
      message: 'A note needs a verdict (valid | changed | historical | to-review).',
      path: ['verdict'],
    })
    .refine((d) => !d.image || !!d.imageAlt, {
      message: 'An image needs imageAlt (a short description of the picture).',
      path: ['imageAlt'],
    }),
});

export const collections = { articles };
