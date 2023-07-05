import { SiderDataTreeItem, SiderDataType } from "@/store/mdx";

export function buildSiderDataTree(siderData: SiderDataType[]) {
  const tree: SiderDataTreeItem[] = []
  siderData.forEach(data => {
    const index = tree.findIndex(t => t.folder === data.id.split('/')[0])
    if (index !== -1) {
      tree[index].children.push(data)
    } else {
      tree.push({
        folder: data.id.split('/')[0],
        children: [data]
      })
    }
  })

  return tree
}