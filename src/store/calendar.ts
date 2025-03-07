import { StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Dayjs } from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { hasTimeConflict } from "@/utils";

export enum TodoTaskStatus {
  TODO = "todo",
  DOING = "doing",
  DONE = "done",
}

export interface CalendarTag {
  id: string;
  value: string;
}
export interface TaskGroup {
  id: string;
  value: string;
  bgcolor: string;
}
export interface PersistState {
  todoTasks: Record<string, TodoTask[]>;
  calendarTags: CalendarTag[];
  taskGroups: TaskGroup[];
}
export interface TodoTask {
  id: string;
  title: string;
  status: TodoTaskStatus;
  date: Dayjs;
  timeRange: [Dayjs, Dayjs];
  /**
   * taskGroup ID
   */
  taskGroup: string;
  detail?: string;
  /**
   * taskGroup tags ID
   */
  tags?: string[];
}
export interface CalendarSlice {
  calendarTags: CalendarTag[];
  todoTasks: Record<string, TodoTask[]>;
  taskGroups: TaskGroup[];
  addTodoTask: (todoTask: TodoTask) => boolean;
  editTodoTask: (todoTask: TodoTask) => boolean;
  toggleTodoTaskStatus: (todoTaskId: string, status: TodoTaskStatus) => void;
  addCalendarTag: (value: string) => void;
  addTaskGroup: (value: Omit<TaskGroup, "id">) => void;
  editTaskGroup: (group: TaskGroup) => void;
  deleteCalendarTag: (id: string) => boolean;
}

const createCalendarSlice: StateCreator<
  CalendarSlice,
  [],
  [["zustand/immer", never], ["zustand/persist", PersistState]],
  CalendarSlice
> = immer(
  persist(
    (set, get) => ({
      todoTasks: {},
      calendarTags: [],
      taskGroups: [{ id: "default", value: "默认分组", bgcolor: "#d6c6e1" }],
      addTodoTask: (todoTask: TodoTask) => {
        const state = get();
        const dateStr = todoTask.date.format("YYYY-MM-DD");
        const tasksOnSameDay = state.todoTasks[dateStr] || [];
        // 检查时间冲突
        const hasTimeConflictFlag = hasTimeConflict(todoTask, tasksOnSameDay);

        if (hasTimeConflictFlag) return false;

        set((state) => {
          // 处理新标签
          let tags = [...(todoTask.tags || [])];
          todoTask.tags?.forEach((tagId, i) => {
            if (tagId.startsWith('Add "')) {
              const newTagValue = tagId.replace(
                /Add "([\w\u4e00-\u9fa5\d]+)"/,
                "$1"
              );
              const index = state.calendarTags.findIndex(
                (tag) => tag.value === newTagValue
              );
              if (index === -1) {
                const id = uuidv4();
                state.calendarTags.push({
                  id,
                  value: newTagValue,
                });
                tags[i] = id;
              } else {
                tags[i] = state.calendarTags[index].id;
                tags = tags.filter(
                  (tag, index, self) => self.indexOf(tag) === index
                );
              }
            }
          });
          const newTask = {
            ...todoTask,
            tags,
            id: uuidv4(),
          };
          if (state.todoTasks[todoTask.date.format("YYYY-MM-DD")]) {
            state.todoTasks[todoTask.date.format("YYYY-MM-DD")].push(newTask);
          } else {
            state.todoTasks[todoTask.date.format("YYYY-MM-DD")] = [newTask];
          }
        });
        return true;
      },
      editTodoTask: (todoTask: TodoTask) => {
        const state = get();
        const dateStr = todoTask.date.format("YYYY-MM-DD");
        const tasksOnSameDay = state.todoTasks[dateStr] || [];

        // 检查时间冲突（排除自身）
        const hasTimeConflictFlag = hasTimeConflict(todoTask, tasksOnSameDay);

        if (hasTimeConflictFlag) return false;

        set((state) => {
          // 处理新标签
          let tags = [...(todoTask.tags || [])];
          todoTask.tags?.forEach((tagId, i) => {
            if (tagId.startsWith('Add "')) {
              const newTagValue = tagId.replace(
                /Add "([\w\u4e00-\u9fa5\d]+)"/,
                "$1"
              );
              const index = state.calendarTags.findIndex(
                (tag) => tag.value === newTagValue
              );
              if (index === -1) {
                const id = uuidv4();
                state.calendarTags.push({
                  id,
                  value: newTagValue,
                });
                tags[i] = id;
              } else {
                tags[i] = state.calendarTags[index].id;
                tags = tags.filter(
                  (tag, index, self) => self.indexOf(tag) === index
                );
              }
            }
          });
          todoTask.tags = tags;

          // 更新任务
          const dateKey = todoTask.date.format("YYYY-MM-DD");
          if (state.todoTasks[dateKey]) {
            const taskIndex = state.todoTasks[dateKey].findIndex(
              (task) => task.id === todoTask.id
            );
            if (taskIndex !== -1) {
              state.todoTasks[dateKey][taskIndex] = todoTask;
            }
          }
        });

        return true;
      },
      toggleTodoTaskStatus: (todoTaskId: string, status: TodoTaskStatus) => {
        set((state) => {
          const dateKey = Object.keys(state.todoTasks).find((key) =>
            state.todoTasks[key].some((task) => task.id === todoTaskId)
          );
          if (dateKey) {
            const taskIndex = state.todoTasks[dateKey].findIndex(
              (task) => task.id === todoTaskId
            );
            if (taskIndex !== -1) {
              state.todoTasks[dateKey][taskIndex].status = status;
            }
          }
        });
      },
      addCalendarTag: (value: string) => {
        set((state) => {
          // 检查标签是否已存在
          if (!state.calendarTags.some((tag) => tag.value === value)) {
            state.calendarTags.push({
              id: uuidv4(),
              value,
            });
          }
        });
      },
      addTaskGroup: (group: Omit<TaskGroup, "id">) => {
        set((state) => {
          if (!state.taskGroups.some((g) => g.value === group.value)) {
            state.taskGroups.push({
              id: uuidv4(),
              ...group,
            });
          }
        });
      },
      editTaskGroup: (group: TaskGroup) => {
        set((state) => {
          const groupIndex = state.taskGroups.findIndex(
            (g) => g.id === group.id
          );
          if (groupIndex !== -1) {
            state.taskGroups[groupIndex] = group;
          }
        });
      },
      deleteCalendarTag: (id: string) => {
        let canDelete = true;
        const state = get();

        // 检查是否有 todoTask 在使用该标签
        const tagToDelete = state.calendarTags.find((tag) => tag.id === id);
        if (tagToDelete) {
          Object.values(state.todoTasks).forEach((tasks) => {
            tasks.forEach((task) => {
              if (task.tags?.includes(id)) {
                canDelete = false;
              }
            });
          });
        }

        if (canDelete) {
          set((state) => {
            state.calendarTags = state.calendarTags.filter(
              (tag) => tag.id !== id
            );
          });
        }

        return canDelete;
      },
    }),
    {
      name: "calendar",
      skipHydration: true,
      partialize: (state) => ({
        todoTasks: state.todoTasks,
        calendarTags: state.calendarTags,
        taskGroups: state.taskGroups,
      }),
    }
  )
);

export default createCalendarSlice;
