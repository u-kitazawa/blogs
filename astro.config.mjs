// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || "http://localhost:3000",
  integrations: [mdx(), sitemap()],
  markdown: {
    // syntaxHighlight: "shiki",
    // shikiConfig: {
    //   theme: "github-dark",
    // },
    processor: unified({
      remarkPlugins: [remarkGfm, remarkMath, remarkToc],
      rehypePlugins: [rehypeKatex],
    }),
  },
  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()],
  },
});
