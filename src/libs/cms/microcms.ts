// SDK利用準備
import type { MicroCMSQueries, MicroCMSListContent } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";
import { MetadataSchema, type Blog, type Metadata } from "./schema";

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// 型定義

// APIの呼び出し
export const getBlogs = async (queries?: MicroCMSQueries) => {
  return await client.getList<Blog>({ endpoint: "blogs", queries });
};

export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) => {
  return await client.getListDetail<Blog>({
    endpoint: "blogs",
    contentId,
    queries,
  });
};

export const getMetadata = async (): Promise<Metadata> => {
  const obj = await client.getObject({ endpoint: "metadata" });
  obj.eyecatch = {
    url: obj.eyecatch as string,
    height: 1080,
    width: 1920,
  };
  return MetadataSchema.parse(obj);
};
