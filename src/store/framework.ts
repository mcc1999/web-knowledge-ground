import create, { StateCreator } from 'zustand'

export interface SiderDataType {
  id: number;
  title: string;
  linkTo: string;
}

export interface FrameworkSlice {
  selectPostId: number,
  siderData: SiderDataType[];
  updateSiderData: (newData: SiderDataType[]) => void;
  updateSelectPostId: (postId: number) => void;
}
const createFrameworkSlice: StateCreator<
  FrameworkSlice,
  [],
  [],
  FrameworkSlice
> = (set) => ({
  selectPostId: -1,
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

export default createFrameworkSlice;