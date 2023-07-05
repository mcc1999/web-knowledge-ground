import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import remarkMdxMetaToProps from './src/plugins/remark-mdx-meta-to-props.mjs'
import remarkMdxTitleHeader from './src/plugins/remark-mdx-title-header.mjs'
import remarkNoteBlock from './src/plugins/remark-note-block.mjs'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkDirective from 'remark-directive'

export const MdxDocumentType = defineDocumentType(() => ({
  name: 'Framework',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `src/mdx/${post._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'src/mdx',
  documentTypes: [MdxDocumentType],
  mdx: {
    remarkPlugins: [
      remarkDirective,
      remarkGfm,
      remarkMdxMetaToProps,
      remarkMdxTitleHeader,
      remarkNoteBlock,
    ],
    rehypePlugins: [
      rehypeAutolinkHeadings,
      rehypeSlug,
    ],
  }
})