import React, { useEffect, useState } from "react";
import { getDayOfWeek, getLastDayOfMonth } from "@/utils/todoList";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import GrainIcon from "@mui/icons-material/Grain";
import { Box, Divider } from "@mui/material";
import useWebPlaygroundStore from "@/store";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CancelIcon from "@mui/icons-material/Cancel";
import ListAltIcon from "@mui/icons-material/ListAlt";

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
  const [monthWeekDay, setMonthWeekDay] = useState({
    monthFirstWeekday: 0,
    lastDayOfMonth: 0,
  });
  const todoList = useWebPlaygroundStore((state) => state.todoList);
  const todoListArray = Object.values(todoList);

  useEffect(() => {
    // @ts-ignore
    useWebPlaygroundStore?.persist.rehydrate();
  }, []);

  useEffect(() => {
    setMonthWeekDay({
      monthFirstWeekday: getDayOfWeek(date.format("YYYY-MM")),
      lastDayOfMonth: getLastDayOfMonth(date.format("YYYY-MM")),
    });
  }, [date]);

  console.log("render", date);

  return (
    <div className={styles["todo-list-container"]}>
      <div className="todo-list-data">
        <Box
          className="todo-list-data__wrap"
          sx={{
            bgcolor: "cardBg.main",
          }}
        >
          <div className="todo-list-data__item">
            <div className="todo-list-data__title">
              <ListAltIcon color="primary" />
              Total:
            </div>
            <div className="todo-list-data__value">
              {Object.keys(todoList).length}
            </div>
          </div>
          <Divider flexItem orientation="vertical" />
          <div className="todo-list-data__item">
            <div className="todo-list-data__title">
              <CheckBoxIcon color="success" />
              Done:{todoListArray.filter((item) => item.done).length}
            </div>
            <div className="todo-list-data__percentage">
              {Number(
                (
                  todoListArray.filter((item) => item.done).length /
                  todoListArray.length
                ).toFixed(2)
              ) *
                100 +
                "%"}
            </div>
          </div>
          <Divider flexItem orientation="vertical" />
          <div className="todo-list-data__item">
            <div className="todo-list-data__title">
              <CancelIcon color="error" />
              Undo:{todoListArray.filter((item) => !item.done).length}
            </div>
            <div className="todo-list-data__percentage">
              {Number(
                (
                  todoListArray.filter((item) => !item.done).length /
                  todoListArray.length
                ).toFixed(2)
              ) *
                100 +
                "%"}
            </div>
          </div>
        </Box>
      </div>
      <div className="calender">
        <Box
          className="calender-wrap"
          sx={{
            bgcolor: "cardBg.main",
          }}
        >
          <div className="calender-header">
            <div className="calender-header__title">
              {date.format("YYYY-MM")}
            </div>
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
                const { monthFirstWeekday, lastDayOfMonth } = monthWeekDay;
                if (
                  i >= monthFirstWeekday &&
                  i - monthFirstWeekday + 1 <= lastDayOfMonth
                ) {
                  content = i - monthFirstWeekday + 1;
                }
                if (!content) return <div />;

                const todoListInToday = todoListArray.filter(
                  (item) =>
                    item.date ===
                    dayjs(`${date.format("YYYY-MM")}-${content}`).format(
                      "YYYY-MM-DD"
                    )
                );
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
                        backgroundColor:
                          date.format("YYYY-MM") ===
                            dayjs().format("YYYY-MM") && content === date.date()
                            ? "actionBg.main"
                            : "default",
                      }}
                      className="date-item"
                    >
                      <div className="date-item__date">{content}日</div>
                      {!!todoListInToday.length && (
                        <div className="date-item__date-info">
                          <div className="date-item__date-todo-status">
                            {todoListInToday.filter((item) => item.done).length}
                            {/* * <CheckBoxIcon color="success" fontSize="small" /> */}
                          </div>
                          <Divider orientation="vertical" flexItem />
                          <div className="date-item__date-todo-status">
                            {
                              todoListInToday.filter((item) => !item.done)
                                .length
                            }
                            {/* * <CancelIcon color="error" fontSize="small" /> */}
                          </div>
                        </div>
                      )}
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
