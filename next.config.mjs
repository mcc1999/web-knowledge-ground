import remarkMdxMetaToProps from './remark-mdx-meta-to-props.mjs'
import remarkMdxTitleHeader from './remark-mdx-title-header.mjs'
import mdx from '@next/mdx'
// remarkFrontmatter去除mdx顶部属性信息
// import remarkFrontmatter from 'remark-frontmatter'
import { withContentlayer } from 'next-contentlayer'

/** @type {import('next').NextConfig} */
const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkMdxMetaToProps,
      // remarkFrontmatter,
      remarkMdxTitleHeader,
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

