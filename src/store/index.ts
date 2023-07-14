import create from 'zustand'
import createMDXSlice, { MDXSlice } from './mdx'
import { persist } from 'zustand/middleware'


const useWebPlaygroundStore = create<MDXSlice>()((...a) => ({
  ...persist(createMDXSlice, {
    name: 'siderState',
    partialize: state => ({siderFolded: state.siderFolded}) ,
  })(...a),
}))

export default useWebPlaygroundStore;