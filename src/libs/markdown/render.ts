import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit"; // 追加
import type { Parent } from "unist";
import type { Element, Text as HastText, ElementContent } from "hast";
export type TocItem = {
  depth: number;
  text: string;
  id: string;
};
export async function renderMarkdown(rawContent: string) {
  // --- 自作のフロントマター解析 ---
  let content = rawContent;
  let metadata: Record<string, string> = {};

  const match = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    const yaml = match[1];
    content = match[2];

    // YAMLの簡易パース (単純なキーバリュー形式であればこれでも動作します)
    const lines = yaml.split("\n");
    for (const line of lines) {
      const [key, ...values] = line.split(":");
      if (key && values.length > 0) {
        metadata[key.trim()] = values
          .join(":")
          .trim()
          .replace(/^['"]|['"]$/g, "");
      }
    }
  }

  const toc: TocItem[] = [];

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkToc)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: { class: "anchor" },
    })
    .use(rehypeShiki, { theme: "github-dark" })
    .use(rehypeKatex)
    .use(() => (tree) => {
      visit(tree, "element", (node: Element, index, parent) => {
        if (node.tagName === "pre" && parent && typeof index === "number") {
          const lang =
            node.properties?.class?.toString().match(/language-(\w+)/)?.[1] ||
            "txt";
          const wrapper = {
            type: "element",
            tagName: "div",
            properties: { class: "code-wrapper" },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: { class: "code-lang" },
                children: [{ type: "text", value: `.${lang}` }],
              },
              node,
            ],
          };
          (parent as Parent).children[index] = wrapper;
        }

        if (/^h[1-3]$/.test(node.tagName)) {
          const id = node.properties?.id as string;
          const extractText = (n: ElementContent): string => {
            if (n.type === "text") return (n as HastText).value;
            if (
              n.type === "element" &&
              n.properties?.class !== "anchor" &&
              "children" in n
            ) {
              return n.children.map(extractText).join("");
            }
            return "";
          };
          const text = extractText(node);
          if (id && text.trim()) {
            toc.push({
              depth: parseInt(node.tagName[1]),
              text: text.trim(),
              id,
            });
          }
        }
      });
    })
    .use(rehypeStringify);

  const file = await processor.process(content);
  return { code: String(file), toc, metadata };
}
