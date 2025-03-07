import dayjs from "dayjs";
import { TodoTask, TodoTaskStatus } from "@/store/calendar";
import { hasTimeConflict } from "@/utils/index";

describe("hasTimeConflict", () => {
  const mockTaskGroup = {
    id: "1",
    value: "test group",
    bgcolor: "#fff",
  };

  const createMockTask = (start: string, end: string): TodoTask => ({
    id: "1",
    title: "Test Task",
    status: TodoTaskStatus.TODO,
    date: dayjs(),
    timeRange: [dayjs(start), dayjs(end)],
    taskGroup: mockTaskGroup,
    detail: "",
    tags: [],
  });

  it("should return false when tasks array is empty", () => {
    const newTask = createMockTask("2023-01-01 10:00", "2023-01-01 11:00");
    expect(hasTimeConflict(newTask, [])).toBeFalsy();
  });

  it("should return true when new task starts during existing task", () => {
    const existingTask = createMockTask("2023-01-01 10:00", "2023-01-01 12:00");
    const newTask = createMockTask("2023-01-01 11:00", "2023-01-01 13:00");
    expect(hasTimeConflict(newTask, [existingTask])).toBeTruthy();
  });

  it("should return true when new task ends during existing task", () => {
    const existingTask = createMockTask("2023-01-01 10:00", "2023-01-01 12:00");
    const newTask = createMockTask("2023-01-01 09:00", "2023-01-01 11:00");
    expect(hasTimeConflict(newTask, [existingTask])).toBeTruthy();
  });

  it("should return true when new task completely overlaps existing task", () => {
    const existingTask = createMockTask("2023-01-01 10:00", "2023-01-01 12:00");
    const newTask = createMockTask("2023-01-01 09:00", "2023-01-01 13:00");
    expect(hasTimeConflict(newTask, [existingTask])).toBeTruthy();
  });

  it("should return true when new task starts exactly at existing task start", () => {
    const existingTask = createMockTask("2023-01-01 10:00", "2023-01-01 12:00");
    const newTask = createMockTask("2023-01-01 10:00", "2023-01-01 11:00");
    expect(hasTimeConflict(newTask, [existingTask])).toBeTruthy();
  });

  it("should return true when new task ends exactly at existing task end", () => {
    const existingTask = createMockTask("2023-01-01 10:00", "2023-01-01 12:00");
    const newTask = createMockTask("2023-01-01 11:00", "2023-01-01 12:00");
    expect(hasTimeConflict(newTask, [existingTask])).toBeTruthy();
  });

  it("should return false when new task ends before existing task starts", () => {
    const existingTask = createMockTask("2023-01-01 10:00", "2023-01-01 12:00");
    const newTask = createMockTask("2023-01-01 08:00", "2023-01-01 09:00");
    expect(hasTimeConflict(newTask, [existingTask])).toBeFalsy();
  });

  it("should return false when new task starts after existing task ends", () => {
    const existingTask = createMockTask("2023-01-01 10:00", "2023-01-01 12:00");
    const newTask = createMockTask("2023-01-01 13:00", "2023-01-01 14:00");
    expect(hasTimeConflict(newTask, [existingTask])).toBeFalsy();
  });

  it("should return false when new task ends exactly at existing task starts", () => {
    const existingTask = createMockTask("2023-01-01 14:00", "2023-01-01 15:00");
    const newTask = createMockTask("2023-01-01 13:00", "2023-01-01 14:00");
    expect(hasTimeConflict(newTask, [existingTask])).toBeFalsy();
  });

  it("should check conflicts with multiple existing tasks", () => {
    const existingTasks = [
      createMockTask("2023-01-01 10:00", "2023-01-01 12:00"),
      createMockTask("2023-01-01 14:00", "2023-01-01 16:00"),
    ];
    const newTask = createMockTask("2023-01-01 11:00", "2023-01-01 13:00");
    expect(hasTimeConflict(newTask, existingTasks)).toBeTruthy();
  });
});
