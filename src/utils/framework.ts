import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

// NOTE: 这样动态导入不利于 SEO
// 备选方案一 使用 require.context 预先导入所有 mdx 文件，然后根据 slug 匹配而不是在 useEffect 中动态导入
// 备选方案二 next-mdx-remote，缺点是不可以用导入导出功能
// 备选方案三 mdx-bundler，没有方案一的缺点
export async function getContentBySlug(slug: string[]) {
  // 这里的路径由于是动态的，格式需要严格注意
  // https://webpack.js.org/api/module-methods/#dynamic-expressions-in-import
  return import(`../framework/${slug.join('/')}.mdx`).catch(
    () => import(`../framework/${slug.join('/')}/index.mdx`)
  )
}

// export async function getFrontmatterBySlug(slug: string[]) {
//   const readMdx = (path: string) => fs.readFile(path, 'utf8')
//   const rawMdx = await readMdx(path.join(process.cwd(), `src/framework/${slug.join('/')}.mdx`)).catch(
//     () => readMdx(path.join(process.cwd(), `src/framework/${slug.join('/')}/index.mdx`))
//   )
//   return matter(rawMdx)
// }
