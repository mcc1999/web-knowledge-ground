import { unified } from "unified";
import markdown from "remark-parse";
import { visit } from "unist-util-visit";

export default function extractTOCHeadings(mdxContent) {
  const tree = unified().use(markdown).parse(mdxContent);

  const toc = [];

  visit(tree, "heading", (node) => {
    const level = node.depth; // 1 = H1, 2 = H2, etc.
    const text = node.children.map((child) => child.value).join("");
    toc.push({ level, text });
  });

  return formatTOC2Tree(toc);
}
function formatTOC2Tree(data) {
  const root = { ...data[0], children: [] };
  const stack = [root];

  data.slice(1).forEach((item) => {
    const newNode = {
      text: item.text,
      level: item.level,
      children: [],
    };

    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(newNode);
    stack.push(newNode);
  });

  return root;
}
