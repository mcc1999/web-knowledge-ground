import create, { StateCreator } from 'zustand'

export interface SiderDataType {
  id: number;
  title: string;
  linkTo: string;
}

export interface FrameworkSlice {
  titleId: number;
  siderData: SiderDataType[];
  updateSiderData: (newData: SiderDataType[]) => void;
  updateTitleId: (id: number) => void;
}
const createFrameworkSlice: StateCreator<
  FrameworkSlice,
  [],
  [],
  FrameworkSlice
> = (set) => ({
  titleId: 0,
  siderData: [],
  updateSiderData: (newData) => set((state) => ({ siderData: [...state.siderData, ...newData] })),
  updateTitleId: (id) => set(() => ({ titleId: id }))
})

export default createFrameworkSlice;