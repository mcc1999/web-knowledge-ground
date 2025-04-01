import { TodoTask } from "@/store/calendar";
import { Box } from "@mui/material";
import React from "react";
import TodoItemComponent from "../TodoItem";

export interface TodoTasksTimelineProps {
  dailyTodoTasks: Array<TodoTask[]>;
  scrollRef: React.RefObject<HTMLDivElement>;
  handleEditTodoTask: (todoTask: TodoTask) => void;
}
export default function TodoTasksTimeline({
  dailyTodoTasks,
  scrollRef,
  handleEditTodoTask,
}: TodoTasksTimelineProps) {
  return (
    <Box className="daily-list" ref={scrollRef}>
      {/* 24 小时时间线 */}
      <div className="daily-list__timeline">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="daily-list__timeline-item">
            <div>
              {i}
              {i < 12 ? "am" : "pm"}
            </div>
            <div className="daily-list__timeline-item-line" />
          </div>
        ))}
      </div>
      {/* daily Todo List */}
      <div className="daily-list__todo-list">
        {dailyTodoTasks.map((dayTodoTasks, i) => (
          <div className="daily-list__todo-list-day" key={i}>
            {dayTodoTasks.map((todoTask) => (
              <TodoItemComponent
                key={todoTask.id}
                id={todoTask.id}
                timeRange={todoTask.timeRange}
                status={todoTask.status}
                title={todoTask.title}
                tags={todoTask.tags ?? []}
                taskGroup={todoTask.taskGroup}
                detail={todoTask.detail ?? ""}
                handleEditTodoTask={() => handleEditTodoTask(todoTask)}
              />
            ))}
          </div>
        ))}
      </div>
    </Box>
  );
}
