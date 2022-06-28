import remarkMdxMetaToProps from './remark-mdx-meta-to-props.mjs'
// import remarkMdxTitleHeader from './remark-mdx-title-header.mjs'
import mdx from '@next/mdx'

/** @type {import('next').NextConfig} */
const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkMdxMetaToProps,
      // remarkMdxTitleHeader,
    ],
    jsx: true,
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: "@mdx-js/react",
  },
})
export default withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  reactStrictMode: false,
})

