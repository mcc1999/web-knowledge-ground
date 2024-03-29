import { withContentlayer } from 'next-contentlayer'
import remarkMdxMetaToProps from './src/plugins/remark-mdx-meta-to-props.mjs'
import remarkMdxTitleHeader from './src/plugins/remark-mdx-title-header.mjs'
import remarkNoteBlock from './src/plugins/remark-note-block.mjs'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkDirective from 'remark-directive'
import mdx from '@next/mdx'

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
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
    jsx: true,
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: "@mdx-js/react",
  },
})
export default withContentlayer(withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx', 'md'],
  reactStrictMode: false,
  experimental: {
    esmExternals: true,
    externalDir: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
      }
    }
    return config
  },
}))