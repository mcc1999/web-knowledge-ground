import { StateCreator } from "zustand";
import { produce } from "immer";
import { persist } from "zustand/middleware";

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

/**
 * ADD || DELETE
 */
export enum UpdateTagType {
  ADD = "ADD",
  DELETE = "DELETE",
}

export interface TodoListState {
  todoList: Record<string, TodoItem>;
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
  updateTodoItemTags: (
    updateTagType: UpdateTagType,
    todoItemId: number,
    tag: string
  ) => void;
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
  updateSubItemTags: (
    updateTagType: UpdateTagType,
    todoItemId: number,
    subItemId: number,
    tag: string
  ) => void;
  /**
   * 更新SubItem信息
   * @param Partial<TodoItemChild>
   * @returns void
   */
  updateSubItem: (
    todoItemId: number,
    subItemId: number,
    newInfo: Partial<TodoItem>
  ) => void;
  /**
   * 删除TodoItem
   * @param todoItemId
   * @returns
   */
  deleteTodoItem: (todoItemId: number) => void;
  /**
   * 删除TodoItem
   * @param todoItemId
   * @returns
   */
  deleteSubItem: (todoItemId: number, subItemId: number) => void;
  /**
   * 删除TodoItem
   * @param todoItemId
   * @returns
   */
  toggleItemCompleteStatus: (todoItemId: number, subItemId?: number) => void;
}

export type TodoListSlice = TodoListState & TodoListActions;

const initTodoListStates: TodoListState = {
  todoList: {},
  tags: [],
};

const createTodoListSlice: StateCreator<
  TodoListSlice,
  [],
  [["zustand/persist", TodoListState]],
  TodoListSlice
> = persist(
  (set) => ({
    ...initTodoListStates,
    addTodoItem: (todoItem: Partial<TodoItem>) =>
      set(
        produce((state: TodoListSlice) => {
          const { todoList, tags } = state;
          const id = Object.keys(todoList).length;
          todoList[id] = {
            ...todoItem,
            id,
          } as TodoItem;
          // 更新state：tags
          tags.push(...getUniqueTags(tags, todoItem.tags));
        })
      ),
    addTodoItemChild: (todoItemId: number, todoItemChild: TodoItemChild) =>
      set(
        produce((state: TodoListSlice) => {
          const { todoList, tags } = state;
          if (todoList[todoItemId]) {
            tags.push(...getUniqueTags(tags, todoItemChild.tags));
            const childId =
              1000000 +
              todoList[todoItemId].id! +
              todoList[todoItemId].children.length;
            todoList[todoItemId].children = [
              ...todoList[todoItemId].children,
              {
                ...todoItemChild,
                id: childId,
              },
            ];
          }
        })
      ),
    updateTodoItemTags: (
      updateTagType: UpdateTagType,
      todoItemId: number,
      tag: string
    ) =>
      set(
        produce((state: TodoListSlice) => {
          const { todoList, tags } = state;
          if (todoList[todoItemId]) {
            if (updateTagType === UpdateTagType.ADD) {
              if (!tags.map((tag) => tag.value).includes(tag)) {
                tags.push({
                  id: tags.length,
                  value: tag,
                });
              }
              todoList[todoItemId].tags = [
                ...(todoList[todoItemId].tags || []),
                tag,
              ];
            } else if (updateTagType === UpdateTagType.DELETE) {
              todoList[todoItemId].tags = todoList[todoItemId].tags?.filter(
                (t) => t !== tag
              );
            }
          }
        })
      ),
    updateTodoItem: (todoItemId: number, newInfo: Partial<TodoItem>) =>
      set(
        produce((state: TodoListSlice) => {
          const { todoList, tags } = state;
          if (todoList[todoItemId]) {
            tags.push(...getUniqueTags(tags, newInfo.tags));
            // 更新相应ID的TodoItem
            todoList[todoItemId] = {
              ...todoList[todoItemId],
              ...newInfo,
            };
          }
        })
      ),
    updateSubItemTags: (
      updateTagType: UpdateTagType,
      todoItemId: number,
      subItemId: number,
      tag: string
    ) =>
      set(
        produce((state: TodoListSlice) => {
          const { todoList, tags } = state;
          const subItemIndex = todoList[todoItemId].children.findIndex(
            (child) => child.id === subItemId
          );
          if (todoList[todoItemId] && subItemIndex !== -1) {
            const otherSubItem = todoList[todoItemId].children.filter(
              (child) => child.id !== subItemId
            );
            const subItem = todoList[todoItemId].children[subItemIndex];
            if (updateTagType === UpdateTagType.ADD) {
              if (!tags.map((tag) => tag.value).includes(tag)) {
                tags.push({
                  id: tags.length,
                  value: tag,
                });
              }
              subItem.tags = [...(subItem.tags || []), tag];
            } else if (updateTagType === UpdateTagType.DELETE) {
              subItem.tags = subItem.tags?.filter((t) => t !== tag);
            }
            console.log("before", JSON.stringify(otherSubItem));
            otherSubItem.splice(subItemIndex, 0, subItem);
            console.log("after", JSON.stringify(otherSubItem));

            todoList[todoItemId].children = otherSubItem;
          }
        })
      ),
    updateSubItem: (todoItemId, subItemId, newInfo) =>
      set(
        produce((state: TodoListSlice) => {
          const { todoList, tags } = state;
          const subItem = todoList[todoItemId].children.filter(
            (child) => child.id === subItemId
          )[0];
          if (todoList[todoItemId] && subItem) {
            const otherSubItem = todoList[todoItemId].children.filter(
              (child) => child.id !== subItemId
            );
            tags.push(...getUniqueTags(tags, newInfo.tags));
            // 更新相应ID的TodoItem
            todoList[todoItemId].children = [
              ...otherSubItem,
              {
                ...subItem,
                ...newInfo,
              },
            ];
          }
        })
      ),
    deleteTodoItem: (todoItemId) =>
      set(
        produce((state: TodoListSlice) => {
          delete state.todoList[todoItemId];
        })
      ),
    deleteSubItem: (todoItemId, subItemId) =>
      set(
        produce((state: TodoListSlice) => {
          state.todoList[todoItemId].children = state.todoList[
            todoItemId
          ].children.filter((child) => child.id !== subItemId);
        })
      ),
    toggleItemCompleteStatus: (todoItemId, subItemId) =>
      set(
        produce((state: TodoListSlice) => {
          const subItemIndex = state.todoList[todoItemId].children.findIndex(
            (child) => child.id === subItemId
          );
          if (subItemId && subItemIndex !== -1) {
            const subItem = state.todoList[todoItemId].children[subItemIndex];
            const otherSubItem = state.todoList[todoItemId].children.filter(
              (child) => child.id !== subItemId
            );
            subItem.done = !subItem.done;
            otherSubItem.splice(subItemIndex, 0, subItem);
            state.todoList[todoItemId].children = otherSubItem;
          } else {
            state.todoList[todoItemId].done = !state.todoList[todoItemId].done;
            state.todoList[todoItemId].children = state.todoList[
              todoItemId
            ].children.map((child) => {
              child.done = !child.done;
              return child;
            });
          }
        })
      ),
  }),
  {
    name: "todoListState",
    skipHydration: true,
    partialize: (state) => ({
      todoList: state.todoList,
      tags: state.tags,
    }),
  }
);

export function getUniqueTags(tags: Tag[], newTags: string[] | undefined) {
  if (!newTags || newTags.length === 0) return [];

  let tagsCnt = tags.length;
  return newTags
    .filter((tag) => !tags.map((t) => t.value).includes(tag))
    .map((tag) => ({ id: tagsCnt++, value: tag }));
}

export default createTodoListSlice;
