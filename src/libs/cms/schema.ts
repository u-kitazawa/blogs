import { z } from "astro/zod";

export const BlogSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().optional(),
  eyecatch: z
    .object({
      url: z.string(),
      height: z.number().optional(),
      width: z.number().optional(),
    })
    .optional(),
  tags: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .array()
    .optional(),
  toc: z
    .object({
      depth: z.number(),
      text: z.string(),
      id: z.string(),
    })
    .array()
    .optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const BlogMinSchema = z.object({
  id: z.string(),
  title: z.string(),
  tags: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  eyecatch: z
    .object({
      url: z.string(),
      height: z.number(),
      width: z.number(),
    })
    .optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const MetadataSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date(),
  revisedAt: z.coerce.date(),
  title: z.string(),
  description: z.string(),
  aboutme: z.string(),
  credit: z.string(),
  eyecatch: z
    .object({
      url: z.string(),
      height: z.number(),
      width: z.number(),
    })
    .optional(),
});

export type Blog = z.infer<typeof BlogSchema>;
export type BlogMin = z.infer<typeof BlogMinSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
