import { Button } from "@mui/material";
import { Dayjs } from "dayjs";
import React from "react";

export interface TodoTasksHeaderProps {
  datePicked: Dayjs;
  addTodoTask: () => void;
}
export default function TodoTasksHeader({ datePicked, addTodoTask }: TodoTasksHeaderProps) {
  return (
    <div className="daily-list__header">
      <div className="daily-list__header-date">
        {datePicked.format("YYYY-MM-DD")}
      </div>
      <Button variant="contained" color="primary" onClick={addTodoTask}>
        新建事项
      </Button>
    </div>
  );
}
