import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import matter from "gray-matter";
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
  const { data: metadata, content } = matter(rawContent);
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
      // 1つの visit に統合
      visit(tree, "element", (node: Element, index, parent) => {
        // --- 1. コードブロック処理 ---
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
          if (parent && typeof index === "number") {
            (parent as Parent).children[index] = wrapper;
          }
        }

        // --- 2. TOC抽出処理 ---
        if (/^h[1-3]$/.test(node.tagName)) {
          const id = node.properties?.id as string;
          // アンカーリンク（class="anchor"）は除外して抽出
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
