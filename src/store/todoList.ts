import { StateCreator } from 'zustand'
import { produce } from 'immer'
import { persist } from 'zustand/middleware';

export interface TodoItemChild {
  id: number;
  title: string;
  remark?: string;
  deadline?: string;
}

export interface TodoItem extends TodoItemChild {
  /**
   * YYYY-MM-DD
   */
  date: string;
  tags?: string[];
  children?: TodoItemChild[];
}

export enum UpdateTagType {
  ADD = 'ADD',
  DELETE = 'DELETE',
}

export interface TodoListSlice {
  todoList: TodoItem[];
  /**
   * 根据日期获取TodoItem列表
   * @param date string 日期YYYY-MM-DD
   * @returns TodoItem[ ]
   */
  getTodoListByDate: (date: string) => TodoItem[];
  /**
   * 根据tag获取TodoItem列表
   * @param tag string
   * @returns TodoItem[ ]
   */
  getTodoListByTag: (tag: string) => TodoItem[];
  /**
   * 新增Todo Item事项
   * @param todoItem 
   * @returns void
   */
  addTodoItem: (todoItem: TodoItem) => void;
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
}

const createTodoListSlice: StateCreator<
  TodoListSlice,
  [],
  [["zustand/persist", {todoList: TodoItem[]}]],
  TodoListSlice
> = persist(
  (set, get) => ({
    todoList: [],
    getTodoListByDate: (date: string) => {
      const { todoList } = get();
      return todoList.filter(todo => todo.date === date)
    },
    getTodoListByTag: (tag: string) => {
      const { todoList } = get();
      return todoList.filter(todo => todo.tags?.includes(tag))
    },
    addTodoItem: (todoItem: TodoItem) => set(produce((state: TodoListSlice) => {
      const { todoList } = state
      todoList.push(todoItem)
    })),
    addTodoItemChild: (todoItemId: number, todoItemChild: TodoItemChild) => set(produce((state: TodoListSlice) => {
      const { todoList } = state
      const todoItemIndex = todoList.findIndex(todo => todo.id === todoItemId)
      if (todoItemIndex > -1) {
        todoList[todoItemIndex].children = [...(todoList[todoItemIndex].children || []), todoItemChild]
      }
    })),
    updateTodoItemTags: (updateTagType: UpdateTagType, todoItemId: number, tag: string) => set(produce((state: TodoListSlice) => {
      const { todoList } = state
      const todoItemIndex = todoList.findIndex(todo => todo.id === todoItemId)
      if (todoItemIndex > -1) {
        if (updateTagType === UpdateTagType.ADD) {
          todoList[todoItemIndex].tags = [...(todoList[todoItemIndex].tags || []), tag]
        } else if (updateTagType === UpdateTagType.DELETE) {
          todoList[todoItemIndex].tags = todoList[todoItemIndex].tags?.filter(t => t !== tag)
        }
      }
    })),
  }),
  {
    name: 'todoListState',
    partialize: state => ({todoList: state.todoList}),
  }
)

export default createTodoListSlice;