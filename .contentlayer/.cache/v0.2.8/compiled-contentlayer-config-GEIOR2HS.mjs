// contentlayer.config.js
import { defineDocumentType, makeSource } from "contentlayer/source-files";

// src/plugins/remark-mdx-meta-to-props.mjs
import { Parser } from "acorn";
import jsx from "acorn-jsx";
import { visit } from "unist-util-visit";
var parser = Parser.extend(jsx());
function remarkMdxMetaToProps() {
  return (tree) => {
    visit(tree, "code", (node, index, parent) => {
      console.log("node", node);
      if (!node.meta)
        return;
      const code = JSON.stringify(`${node.value}`);
      const value = `<code className="language-${node.lang}" ${node.meta}>{${code}}</code>`;
      const estree = parser.parse(value, { ecmaVersion: "latest" });
      console.log("estree", estree);
      parent.children[index] = { type: "mdxFlowExpression", value, data: { estree } };
    });
  };
}

// src/plugins/remark-mdx-title-header.mjs
import { visit as visit2 } from "unist-util-visit";
var remark_mdx_title_header_default = () => (tree, file) => {
  visit2(tree, "heading", (node) => {
    visit2(node, "text", (textNode) => {
      const text = textNode.value ? textNode.value.trim() : "";
      textNode.value = text;
    });
  });
};

// src/plugins/remark-note-block.mjs
import { visit as visit3 } from "unist-util-visit";
import { h } from "hastscript";
function remarkNoteBlock() {
  return (tree) => {
    visit3(tree, (node) => {
      if (node.type === "containerDirective") {
        if (!["tip", "warning", "danger"].includes(node.name))
          return;
        const data = node.data || (node.data = {});
        const tagName = "div";
        data.hName = tagName;
        data.hProperties = h(tagName, { class: `note ${node.name}` }).properties;
      }
    });
  };
}

// contentlayer.config.js
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkDirective from "remark-directive";
var Framework = defineDocumentType(() => ({
  name: "Framework",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: false
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `src/framework/${post._raw.flattenedPath}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "src/framework",
  documentTypes: [Framework],
  mdx: {
    remarkPlugins: [
      remarkDirective,
      remarkGfm,
      remarkMdxMetaToProps,
      remark_mdx_title_header_default,
      remarkNoteBlock
    ],
    rehypePlugins: [
      rehypeAutolinkHeadings,
      rehypeSlug
    ]
  }
});
export {
  Framework,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-GEIOR2HS.mjs.map
