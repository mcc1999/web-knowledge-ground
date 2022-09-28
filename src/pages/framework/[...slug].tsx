import glob from 'fast-glob'
import FrameworkContentPage from '../../components/FrameworkContentPage'
import { GetStaticPaths, GetStaticProps } from 'next'

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
  return { props: { slug } }
}
