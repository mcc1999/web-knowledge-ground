import glob from 'fast-glob'
import FrameworkContentPage from '../../components/FrameworkContentPage'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getFrontmatterBySlug } from '../../utils/framework/framework'
import { getFrameworkSiderData } from '../../utils/framework/sidebarData'

export default FrameworkContentPage

export const getStaticPaths: GetStaticPaths<{ slug: string[] }> = async () => {
  const framework = await glob('src/framework/**/*.mdx')

  return {
    paths: framework.map((path) => ({
      params: { slug: path.replace(/^src\/framework\/|(\/index)?\.mdx$/g, '').split('/') },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<any, { slug: string[] }> = async (context) => {
  const { slug } = context.params!
  const { data: frontmatter } = await getFrontmatterBySlug(slug)
  const siderData = await getFrameworkSiderData();

  return { props: { slug, frontmatter, siderData } }
}
