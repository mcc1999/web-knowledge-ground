import glob from 'fast-glob'
import FrameworkContentPage from '../../components/FrameworkContentPage'
import { GetStaticPaths, GetStaticProps } from 'next'
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

export const getStaticProps: GetStaticProps<any, { slug: string[] }> = async (context) => {
  const { slug } = context.params!

  const rawString = allFrameworks.find((item: Framework) => item._raw.flattenedPath === slug.join('/'))!.body.html;
  const siderData = allFrameworks.map(item => ({ id: item._id, title: item.title, linkTo: item._raw.flattenedPath }))
  return { props: { rawString, siderData } };
}