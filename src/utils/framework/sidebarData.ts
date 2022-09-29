import { promises as fs } from 'fs'
import matter from 'gray-matter';
import path from 'path'

export async function getFrameworkSiderData() {
  const frameworkDirectory = path.join(process.cwd(), '/src/framework')
  const frameworkContents: { filename: string; fileContent: string }[] = []

  async function getFileContents(dirName: string) {
    const filenames = await fs.readdir(dirName)

    const frameworkContent = filenames.map(async (filename) => {
      const filePath = path.join(dirName, filename)
      const stat = await fs.stat(filePath)

      if (stat.isDirectory()) {
        await getFileContents(filePath)
      } else if (stat.isFile()) {
        const fileContent = await fs.readFile(filePath, 'utf8')
        return {
          filename: filePath.slice(filePath.indexOf('src') + 3, -4),
          fileContent
        }
      }
    })
    const contents = await Promise.all(frameworkContent)
    contents.forEach(i => {
      i && frameworkContents.push(i)
    })
  }
  await getFileContents(frameworkDirectory);

  return formatSiderData(frameworkContents);
}

function formatSiderData(siderData: { filename: string; fileContent: string }[]) {
  const formattedSiderData = siderData.map((item) => {
    const { data: frontmatter } = matter(item.fileContent);
    if (frontmatter.title) {
      return {
        id: Math.random(),
        title: frontmatter.title,
        linkTo: item.filename
      }
    }
  })
  return formattedSiderData;
}