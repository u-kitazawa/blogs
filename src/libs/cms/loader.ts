import type { Loader } from "astro/loaders";
import { BlogSchema, type Blog } from "./schema";
import { getBlogDetail, getBlogs } from "./microcms";
import { renderMarkdown } from "../markdown/render";

export const microCmsLoader = (): Loader => {
  return {
    name: "microcms-loader",
    load: async ({
      store,
      logger,
      parseData,
      meta,
      generateDigest,
    }): Promise<void> => {
      const blogs = await getBlogs({
        fields: ["id"],
      });

      store.clear();

      await Promise.all(
        blogs.contents.map(async (item: { id: string }) => {
          // 詳細情報を取得
          const detail = (await getBlogDetail(item.id, {
            fields: [
              "id",
              "title",
              "content",
              "eyecatch",
              "tags",
              "createdAt",
              "updatedAt",
            ],
          })) as Blog;

          const rendered = await renderMarkdown(detail.content ?? "");
          const data = await parseData({
            id: item.id,
            data: { ...detail, toc: rendered.toc },
          });

          const digest = generateDigest(data);

          store.set({
            id: data.id,
            data,
            digest,
            body: data.content,
            rendered: {
              html: rendered.code,
              metadata: rendered.metadata,
            },
          });
        }),
      );

      logger.info(`Loaded ${blogs.contents.length} posts from MicroCMS`);
    },
    schema: BlogSchema,
  };
};
