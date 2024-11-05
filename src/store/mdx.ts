import { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

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
  mdxTOCFolded: boolean;
  siderFolded: boolean;
  selectPostId: string,
  siderData: SiderDataType[];
  updateSiderData: (newData: SiderDataType[]) => void;
  updateSelectPostId: (postId: string) => void;
  toggleSiderFolded: () => void;
  toggleMdxTOCFolded: () => void;
}
const createMDXSlice: StateCreator<
  MDXSlice,
  [],
  [["zustand/persist", {siderFolded: boolean}]],
  MDXSlice
> = persist(
  (set) => ({
    mdxTOCFolded: true,
    siderFolded: false,
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
    updateSelectPostId: (postId) => set(() => ({ selectPostId: postId })),
    toggleSiderFolded: () => set(state => ({ siderFolded: !state.siderFolded })),
    toggleMdxTOCFolded: () => set(state => ({ mdxTOCFolded: !state.mdxTOCFolded })),
  }),
  {
    name: 'siderState',
    partialize: state => ({siderFolded: state.siderFolded, mdxTOCFolded: state.mdxTOCFolded}),
  },
)

export default createMDXSlice;