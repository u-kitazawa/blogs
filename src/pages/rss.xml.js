import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { getMetadata } from "../libs/cms/microcms";

export async function GET(context) {
  const posts = await getCollection("blog");
  const metadata = await getMetadata();
  return rss({
    title: metadata.title,
    description: metadata.description,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.id}/`,
    })),
  });
}
