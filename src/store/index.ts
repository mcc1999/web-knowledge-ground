import create from 'zustand'
import createMDXSlice, { MDXSlice } from './mdx'

const useWebPlaygroundStore = create<MDXSlice>()((...a) => ({
  ...createMDXSlice(...a),
}))

export default useWebPlaygroundStore;