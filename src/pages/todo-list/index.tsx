import React, { useState } from "react";
import { getDayOfWeek, getLastDayOfMonth } from "@/utils/todoList";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import GrainIcon from "@mui/icons-material/Grain";
import { Box } from "@mui/material";

import styles from "./index.module.scss";

const breadcrumbs = [
  {
    name: "Font Page",
    path: "/",
    icon: <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
  },
  {
    name: "Todo List",
    path: "/todo-list",
    icon: <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />,
  },
];

const TodoList: React.FC = () => {
  const [date, setDate] = useState<Dayjs>(() => dayjs());
  const monthFirstWeekday = getDayOfWeek(date.format("YYYY-MM"));
  const lastDayOfMonth = getLastDayOfMonth(date.format("YYYY-MM-DD"));

  return (
    <div className={styles["todo-list-container"]}>
      <div className="calender">
        <Box
          className="calender-wrap"
          sx={{
            bgcolor: "cardBg.main",
          }}
        >
          <div className="calender-header">
            <h1 className="calender-header__title">{date.format("YYYY-MM")}</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year", "month"]}
                label="Year and Month"
                value={dayjs(date)}
                onChange={(newValue) => {
                  newValue && setDate(newValue);
                }}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          </div>
          <div className="calender-dates">
            <div className="dates-header">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>
            <div className="dates-body">
              {new Array(42).fill(0).map((_, i) => {
                let content;
                if (
                  i >= monthFirstWeekday &&
                  i - monthFirstWeekday + 1 <= lastDayOfMonth
                ) {
                  content = i - monthFirstWeekday + 1;
                }
                if (!content) return null;
                return (
                  <Link
                    key={i.toString() + content}
                    href={`/todo-list/${dayjs(
                      `${date.format("YYYY-MM")}-${content}`
                    ).format("YYYY-MM-DD")}`}
                  >
                    <Box
                      sx={{
                        ":hover": { backgroundColor: "actionBg.main" },
                        border: content === date.date() ? "1px dashed" : "none",
                        borderColor:
                          content === date.date() ? "actionBg.main" : "default",
                      }}
                      className="date-item"
                    >
                      {content}
                    </Box>
                  </Link>
                );
              })}
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default TodoList;
