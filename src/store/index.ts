import create from 'zustand'
import createFrameworkSlice, { FrameworkSlice } from './framework'
import createThemeSlice, { ThemeSlice } from './theme';


const useWebPlaygroundStore = create<FrameworkSlice & ThemeSlice>()((...a) => ({
  ...createFrameworkSlice(...a),
  ...createThemeSlice(...a),
}))

export default useWebPlaygroundStore;