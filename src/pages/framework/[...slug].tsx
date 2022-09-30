import glob from 'fast-glob'
import FrameworkContentPage from '../../components/FrameworkContentPage'
import { GetStaticPaths, GetStaticProps } from 'next'
import { getFrontmatterBySlug } from '../../utils/framework/framework'
import { getFrameworkSiderData } from '../../utils/framework/sidebarData'
import { allFrameworks, Framework } from 'contentlayer/generated'

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

// export const getStaticProps: GetStaticProps<any, { slug: string[] }> = async (context) => {
//   const { slug } = context.params!
//   const { data: frontmatter } = await getFrontmatterBySlug(slug)
//   const siderData = await getFrameworkSiderData();

//   return { props: { slug, frontmatter, siderData } }
// }
export const getStaticProps: GetStaticProps<any, { slug: string[] }> = async (context) => {
  const { slug } = context.params!
  console.log('allFrameworks', allFrameworks, 'slug', slug);

  const rawString = allFrameworks.find((item: Framework) => item._raw.flattenedPath === slug.join('/'))!.body.raw;
  const siderData = allFrameworks.map(item => ({ id: item._id, title: item.title, linkTo: item.url.slice(4,) }))
  return { props: { rawString, siderData } };
}