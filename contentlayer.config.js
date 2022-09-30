import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Framework = defineDocumentType(() => ({
  name: 'Framework',
  filePathPattern: `**/*.mdx`,
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `src/framework/${post._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'src/framework',
  documentTypes: [Framework],
  mdx: {
    cwd: process.cwd(),
  }
})