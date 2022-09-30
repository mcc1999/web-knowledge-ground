// contentlayer.config.js
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Framework = defineDocumentType(() => ({
  name: "Framework",
  filePathPattern: `**/*.mdx`,
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true
    }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/framework/${post._raw.flattenedPath}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "framework",
  documentTypes: [Framework]
});
export {
  Framework,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-GYFKWN3M.mjs.map