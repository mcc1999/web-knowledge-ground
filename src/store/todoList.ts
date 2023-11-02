import { StateCreator } from 'zustand'
import { produce } from 'immer'
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';

export interface TodoItemChild {
  id: number;
  title: string;
  done: boolean;
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
   * 更新Todo Item信息
   * @param Partial<todoItem> 
   * @returns void
   */
  updateTodoItem: (todoItemId: number, newInfo: Partial<TodoItem>) => void;
}

export type TodoListSlice = TodoListState & TodoListActions

const initTodoListStates: TodoListState  = {
  todoList: [
    {
      id: 1,
      date: dayjs('2023-10-31').format('YYYY-MM-DD'),
      title: 'title1',
      remark: 'remark1',
      deadline: dayjs('2023-11-22').format('YYYY-MM-DD HH:mm:ss'),
      tags: ['tag1', 'tag2'],
      children: [
        {
          id: 11,
          title: 'title1-1',
          remark: 'remark1-1',
          deadline: dayjs('2023-11-06').format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          id: 12,
          title: 'title1-2',
          remark: 'remark1-2',
          deadline: dayjs('2023-11-08').format('YYYY-MM-DD HH:mm:ss'),
        },
      ],
    },
    {
      id: 2,
      date: dayjs('2023-10-28').format('YYYY-MM-DD'),
      title: 'title2',
      remark: 'remark2',
      deadline: dayjs('2023-10-22').format('YYYY-MM-DD HH:mm:ss'),
      tags: ['tag1', 'tag2'],
    },
  ],
  tags: [],
}

const createTodoListSlice: StateCreator<
  TodoListSlice,
  [],
  [[ "zustand/persist", { todoList: TodoListState } ]],
  TodoListSlice
> = persist(
  (set, get) => ({
    ...initTodoListStates,
    // getTodoListByTag: (tag: string) => {
    //   const { todoList } = get();
    //   return todoList.filter(todo => todo.tags?.includes(tag))
    // },
    addTodoItem: (todoItem: Partial<TodoItem>) => set(produce((state: TodoListSlice) => {
      const { todoList } = state
      todoList.push({
        ...todoItem,
        id: todoList.length,
      } as TodoItem)
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
    updateTodoItem: (todoItemId: number, newInfo: Partial<TodoItem>) => set(produce((state: TodoListSlice) => {
      const { todoList, tags } = state
      const todoItemIndex = todoList.findIndex(todo => todo.id === todoItemId)
      if (todoItemIndex > -1) {
        // 更新state：tags
        if (newInfo.tags?.length) {
          let tagsCnt = tags.length
          tags.push(
            ...newInfo.tags
              .filter(tag => !tags.map(t => t.value).includes(tag))
              .map(tag => ({id: tagsCnt++, value: tag}))
          )
        }
        // 更新相应ID的TodoItem
        todoList[todoItemIndex] = {
          ...todoList[todoItemIndex],
          ...newInfo,
        }
      }
    })),
  }),
  {
    name: 'todoListState',
    skipHydration: true,
    // partialize: state => ({todoList: state.todoList}),
  }
)

export default createTodoListSlice;