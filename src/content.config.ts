import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { microCmsLoader } from "./libs/cms/loader";
import { BlogMinSchema, BlogSchema } from "./libs/cms/schema";

const blog = defineCollection({
  loader: await microCmsLoader(),
  // Type-check frontmatter using a schema
  schema: ({}) => BlogSchema,
});

export const collections = { blog };
