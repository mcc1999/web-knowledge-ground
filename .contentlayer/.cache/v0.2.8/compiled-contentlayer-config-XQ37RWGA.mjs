// contentlayer.config.js
import { defineDocumentType, makeSource } from "contentlayer/source-files";

// remark-mdx-meta-to-props.mjs
import { Parser } from "acorn";
import jsx from "acorn-jsx";
import { visit } from "unist-util-visit";
var parser = Parser.extend(jsx());

// contentlayer.config.js
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
    cwd: process.cwd(),
    remarkPlugins: []
  }
});
export {
  Framework,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-XQ37RWGA.mjs.map
