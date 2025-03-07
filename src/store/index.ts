import { create } from "zustand";
import createMDXSlice, { MDXSlice } from "./mdx";
import createTodoListSlice, { TodoListSlice } from "./todoList";
import createCalendarListSlice, { CalendarSlice } from "./calendar";

const useWebPlaygroundStore = create<
  MDXSlice & TodoListSlice & CalendarSlice
>()((...a) => ({
  ...createMDXSlice(...a),
  ...createTodoListSlice(...a),
  ...createCalendarListSlice(...a),
}));

export default useWebPlaygroundStore;
