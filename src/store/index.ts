import create from 'zustand'
import createMDXSlice, { MDXSlice } from './mdx'
import createTodoListSlice, { TodoListSlice } from './todoList'


const useWebPlaygroundStore = create<MDXSlice & TodoListSlice>()((...a) => ({
    ...createMDXSlice(...a), 
    ...createTodoListSlice(...a),
}))

export default useWebPlaygroundStore;