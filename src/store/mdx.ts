import create, { StateCreator } from 'zustand'

export interface SiderDataType {
  id: string;
  title: string;
  linkTo: string;
}

export interface SiderDataTreeItem {
  folder: string;
  children: SiderDataType[]
}

export interface MDXSlice {
  selectPostId: string,
  siderData: SiderDataType[];
  updateSiderData: (newData: SiderDataType[]) => void;
  updateSelectPostId: (postId: string) => void;
}
const createMDXSlice: StateCreator<
  MDXSlice,
  [],
  [],
  MDXSlice
> = (set) => ({
  selectPostId: '-1',
  siderData: [],
  updateSiderData: (newData) => set((state) => {
    const { siderData: oldData } = state
    const newState = [...oldData]

    newData?.forEach((d, i) => {
      if (newState.findIndex(j => j.linkTo === d.linkTo) === -1) {
        newState.push(d)
      }
    })
    return {
      siderData: newState,
    }
  }),
  updateSelectPostId: (postId) => set(() => ({ selectPostId: postId }))
})

export default createMDXSlice;