import { StateCreator } from 'zustand'
import { produce } from 'immer'
import { persist } from 'zustand/middleware';

export interface TodoItemChild {
  id: number;
  title: string;
  done: boolean;
  /**
   * YYYY-MM-DD
   */
  date: string;
  remark?: string;
  deadline?: string;
  tags?: string[];
}

export interface TodoItem extends TodoItemChild {
  children: TodoItemChild[];
}

export interface Tag {
  id: number;
  value: string;
}

export enum UpdateTagType {
  ADD = 'ADD',
  DELETE = 'DELETE',
}

export interface TodoListState {
  todoList: TodoItem[];
  tags: Tag[];
}
export interface TodoListActions {
  /**
   * 根据tag获取TodoItem列表
   * @param tag string
   * @returns TodoItem[ ]
   */
  // getTodoListByTag: (tag: string) => TodoItem[];
  /**
   * 新增Todo Item事项
   * @param todoItem 
   * @returns void
   */
  addTodoItem: (todoItem: Partial<TodoItem>) => void;
  /**
   * 新增Todo Item子事项
   * @param todoItem 
   * @returns void
   */
  addTodoItemChild: (todoItemId: number, todoItemChild: TodoItemChild) => void;
  /**
   * 新增/删除 Todo Item的tag
   * @param todoItem 
   * @returns void
   */
  updateTodoItemTags: (updateTagType: UpdateTagType, todoItemId: number, tag: string) => void;
  /**
   * 更新TodoItem信息
   * @param Partial<TodoItem> 
   * @returns void
   */
  updateTodoItem: (todoItemId: number, newInfo: Partial<TodoItem>) => void;
  /**
   * 新增/删除 SubItem的tag
   * @param todoItem 
   * @returns void
   */
  updateSubItemTags: (updateTagType: UpdateTagType, todoItemId: number, subItemId: number, tag: string) => void;
  /**
   * 更新SubItem信息
   * @param Partial<TodoItemChild> 
   * @returns void
   */
  updateSubItem: (todoItemId: number, subItemId: number, newInfo: Partial<TodoItem>) => void;
  /**
   * 删除TodoItem
   * @param todoItemId 
   * @returns 
   */
  deleteTodoItem: (todoItemId: number) => void;
}

export type TodoListSlice = TodoListState & TodoListActions

const initTodoListStates: TodoListState  = {
  todoList: [],
  tags: [],
}

const createTodoListSlice: StateCreator<
  TodoListSlice,
  [],
  [[ "zustand/persist", TodoListState ]],
  TodoListSlice
> = persist(
  (set) => ({
    ...initTodoListStates,
    addTodoItem: (todoItem: Partial<TodoItem>) => set(produce((state: TodoListSlice) => {
      const { todoList, tags } = state
      todoList.push({
        ...todoItem,
        id: todoList.length,
      } as TodoItem)
      // 更新state：tags
      tags.push(...getUniqueTags(tags, todoItem.tags))
    })),
    addTodoItemChild: (todoItemId: number, todoItemChild: TodoItemChild) => set(produce((state: TodoListSlice) => {
      const { todoList, tags } = state
      const todoItemIndex = todoList.findIndex(todo => todo.id === todoItemId)
      if (todoItemIndex > -1) {
        tags.push(...getUniqueTags(tags, todoItemChild.tags))
        todoList[todoItemIndex].children = [...(todoList[todoItemIndex].children || []), { ...todoItemChild, id: 1000000 + todoList[todoItemIndex].id! }]
      }
    })),
    updateTodoItemTags: (updateTagType: UpdateTagType, todoItemId: number, tag: string) => set(produce((state: TodoListSlice) => {
      const { todoList, tags } = state
      const todoItemIndex = todoList.findIndex(todo => todo.id === todoItemId)
      if (todoItemIndex > -1) {
        if (updateTagType === UpdateTagType.ADD) {
          if (!tags.map(tag => tag.value).includes(tag)) {
            tags.push({
              id: tags.length,
              value: tag
            })
          }
          todoList[todoItemIndex].tags = [...(todoList[todoItemIndex].tags || []), tag]
        } else if (updateTagType === UpdateTagType.DELETE) {
          todoList[todoItemIndex].tags = todoList[todoItemIndex].tags?.filter(t => t !== tag)
        }
      }
    })),
    updateTodoItem: (todoItemId: number, newInfo: Partial<TodoItem>) => set(produce((state: TodoListSlice) => {
      const { todoList, tags } = state
      const todoItemIndex = todoList.findIndex(todo => todo.id === todoItemId)
      if (todoItemIndex > -1) {
        tags.push(...getUniqueTags(tags, newInfo.tags))
        // 更新相应ID的TodoItem
        todoList[todoItemIndex] = {
          ...todoList[todoItemIndex],
          ...newInfo,
        }
      }
    })),
    updateSubItemTags: (updateTagType: UpdateTagType, todoItemId: number, subItemId: number, tag: string) => set(produce((state: TodoListSlice) => {
      const { todoList, tags } = state
      const todoItemIndex = todoList.findIndex(todo => todo.id === todoItemId)
    
      if (todoItemIndex > -1) {
        const subItemIndex = todoList[todoItemIndex].children?.findIndex(subItem => subItem.id === subItemId)

        if (subItemIndex && subItemIndex > -1) {
          if (updateTagType === UpdateTagType.ADD) {
            if (!tags.map(tag => tag.value).includes(tag)) {
              tags.push({
                id: tags.length,
                value: tag
              })
            }
            todoList[todoItemIndex].children[subItemIndex].tags = [...(todoList[todoItemIndex].children[subItemIndex].tags || []), tag]
          } else if (updateTagType === UpdateTagType.DELETE) {
            todoList[todoItemIndex].children[subItemId].tags = todoList[todoItemIndex].children[subItemIndex].tags?.filter(t => t !== tag)
          }
        }
      }
    })),
    updateSubItem: (todoItemId, subItemId, newInfo) => set(produce((state: TodoListSlice) => {
      const { todoList, tags } = state
      const todoItemIndex = todoList.findIndex(todo => todo.id === todoItemId)
      if (todoItemIndex > -1) {
        const subItemIndex = todoList[todoItemIndex].children?.findIndex(subItem => subItem.id === subItemId)
        if (subItemIndex && subItemIndex > -1) {
          tags.push(...getUniqueTags(tags, newInfo.tags))

          // 更新相应ID的TodoItem
          todoList[todoItemIndex].children[subItemIndex] = {
            ...todoList[todoItemIndex].children[subItemIndex],
            ...newInfo,
          }
        }
      }
    })),
    deleteTodoItem: (todoItemId) => set(produce((state: TodoListSlice) => {
      state.todoList = state.todoList.filter(todo => todo.id !== todoItemId)
    })),
  }),
  {
    name: 'todoListState',
    skipHydration: true,
    partialize: state => ({
      todoList: state.todoList,
      tags: state.tags,
    }),
  }
)

export function getUniqueTags (tags: Tag[], newTags: string[] | undefined) {
  if (!newTags || newTags.length === 0) return []

  let tagsCnt = tags.length
  return newTags
    .filter(tag => !tags.map(t => t.value).includes(tag))
    .map(tag => ({id: tagsCnt++, value: tag}))
}

export default createTodoListSlice;