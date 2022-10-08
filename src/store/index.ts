import create from 'zustand'
import createFrameworkSlice, { FrameworkSlice } from './framework'


const useWebPlaygroundStore = create<FrameworkSlice>()((...a) => ({
  ...createFrameworkSlice(...a),
}))

export default useWebPlaygroundStore;