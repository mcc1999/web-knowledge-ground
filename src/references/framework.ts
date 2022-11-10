export type Page = {
  title: string
  url: string
  redirect?: string
  routes?: Page[]
}

export const PAGES: Page[] = [
  { title: 'MDX 测试页', url: '/framework/' },
]