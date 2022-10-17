import { withContentlayer } from 'next-contentlayer'

export default withContentlayer({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx', 'md'],
  reactStrictMode: false,
  experimental: {
    esmExternals: true,
    externalDir: true,
  },
})