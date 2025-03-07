"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useSize } from "ahooks";
import useWebPlaygroundStore from "@/store";
import { TodoTask, TodoTaskStatus } from "@/store/calendar";
import EditDialog, { DialogType } from "./components/EditDialog";
import CalendarDatePicker from "./components/CalendarDatePicker";
import TodoTasksHeader from "./components/TodoTasksHeader";
import TodoTasksDateRangeList from "./components/TodoTasksDateRangeList";
import TodoTasksTimeline from "./components/TodoTasksTimeline";
import DataAnalysis from "./components/DataAnalysis";
import TaskGroup from "./components/TaskGroup";
import TagManage from "./components/TagManage";
import { useSnackbar } from "notistack";

import styles from "./index.module.scss";

const TodoList: React.FC = () => {
  // 选中的日期
  const [datePicked, setdatePicked] = useState<Dayjs>(dayjs());
  // 根据容器宽度计算
  const [dateRangeListSize, setDateRangeListSize] = useState(3);
  // 右侧展示的日期列表，选中日期前后各n天
  const [dateRangeList, setDateRangeList] = useState<Dayjs[]>([]);
  const [dailyTodoTasks, setDailyTodoTasks] = useState<Array<TodoTask[]>>([]);
  // 新增和关闭弹窗时设置 boolean 值
  const [operateTask, setOperateTask] = useState<TodoTask | boolean>(false);
  const [todoTasks, addTodoTask, editTodoTask] = useWebPlaygroundStore(
    (state) => [state.todoTasks, state.addTodoTask, state.editTodoTask]
  );
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  const { enqueueSnackbar } = useSnackbar();
  const firstRender = useRef(true);

  useEffect(() => {
    // @ts-ignore
    useWebPlaygroundStore?.persist.rehydrate();
  }, []);

  useEffect(() => {
    const halfSize = Math.floor(dateRangeListSize / 2);
    // 如果选择的日期在展示范围内，则不更新展示日期列表
    if (
      dateRangeList.length &&
      dateRangeList.length === dateRangeListSize &&
      Math.abs(datePicked.diff(dateRangeList[halfSize], "day")) <= halfSize
    )
      return;

    const dateRange = [
      ...Array.from({ length: halfSize }, (_, i) =>
        datePicked.subtract(i + 1, "day")
      ).reverse(),
      datePicked,
      ...Array.from({ length: halfSize }, (_, i) =>
        datePicked.add(i + 1, "day")
      ),
    ];
    setDateRangeList(dateRange);
  }, [datePicked, dateRangeListSize]);

  useEffect(() => {
    if (size?.width) {
      const floorNum = Math.floor(size.width / 240);
      setDateRangeListSize(floorNum % 2 === 0 ? floorNum - 1 : floorNum);
    }
  }, [size]);

  useEffect(() => {
    setDailyTodoTasks(
      dateRangeList.map((date) => todoTasks[date.format("YYYY-MM-DD")] || [])
    );
    // 找到最早的任务并滚动
    const allTasks = dateRangeList
      .map((date) => todoTasks[date.format("YYYY-MM-DD")] || [])
      .flat();

    if (allTasks.length > 0) {
      const earliestTask = allTasks.reduce((prev, curr) => {
        const prevTime =
          dayjs(prev.timeRange[0]).hour() * 60 +
          dayjs(prev.timeRange[0]).minute();
        const currTime =
          dayjs(curr.timeRange[0]).hour() * 60 +
          dayjs(curr.timeRange[0]).minute();
        return prevTime < currTime ? prev : curr;
      });
      const scrollTop =
        8 +
        64 +
        (dayjs(earliestTask.timeRange[0]).hour() +
          dayjs(earliestTask.timeRange[0]).minute() / 60) *
          128;
      if (scrollRef.current && firstRender.current) {
        firstRender.current = false;
        scrollRef.current.scrollTo({
          top: Math.max(0, scrollTop - 128), // 减去一个小时的高度，让任务更容易看到
          behavior: "smooth",
        });
      }
    }
  }, [dateRangeList, todoTasks]);

  function handleDateRangeNavigate(direction: "prev" | "next") {
    if (direction === "prev") {
      const newDateRange = dateRangeList.slice(0, dateRangeListSize - 1);
      setDateRangeList([newDateRange[0].subtract(1, "day"), ...newDateRange]);
    } else {
      const newDateRange = dateRangeList.slice(1);
      setDateRangeList([
        ...newDateRange,
        newDateRange[dateRangeListSize - 2].add(1, "day"),
      ]);
    }
  }

  async function handleEditTodoTask(
    todoItem: Omit<Partial<TodoTask>, "date"> & {
      type: DialogType;
      date: Dayjs;
    }
  ) {
    const newTask: TodoTask = {
      date: todoItem.date!,
      id: todoItem.id!,
      status: todoItem.status!,
      taskGroup: todoItem.taskGroup!,
      title: todoItem.title!,
      timeRange: todoItem.timeRange!,
      detail: todoItem.detail,
      tags: todoItem.tags,
    };
    console.log(todoItem, "-=-");

    const success =
      todoItem.type === DialogType.CREATE
        ? addTodoTask(newTask)
        : editTodoTask(newTask);
    if (!success) {
      enqueueSnackbar("时间范围与现有任务冲突", { variant: "error" });
      return;
    } else {
      setOperateTask(false);
    }
  }

  return (
    <>
      <Box className={styles.todoList}>
        <Box className="todo-list-container">
          {/* 左侧小组件 */}
          <div className="left-actions-container">
            <Box className="left-actions">
              {/* 日期选择器 */}
              <CalendarDatePicker
                datePicked={datePicked}
                setdatePicked={setdatePicked}
              />
              {/* 数据分析 */}
              <DataAnalysis todoTasks={todoTasks} />
              {/* 任务列表 */}
              <TaskGroup />
              {/* Tag 管理 */}
              <TagManage />
            </Box>
          </div>
          {/* 右侧日历组件 */}
          <Box
            ref={ref}
            className="right-daily-list"
            sx={{ bgcolor: "cardBg.main" }}
          >
            {/* Header: 当天日期 + 新建 todo 事项Btn */}
            <TodoTasksHeader
              datePicked={datePicked}
              addTodoTask={() => setOperateTask(true)}
            />
            {/* 日期列表 */}
            <TodoTasksDateRangeList
              datePicked={datePicked}
              dateRangeList={dateRangeList}
              handleDatePick={(date) => setdatePicked(date)}
              handleDateRangeNavigate={handleDateRangeNavigate}
            />
            {/* Daily TodoList */}
            <TodoTasksTimeline
              dailyTodoTasks={dailyTodoTasks}
              scrollRef={scrollRef}
              handleEditTodoTask={(task) => {
                setOperateTask(task);
              }}
            />
          </Box>
        </Box>
      </Box>
      {!!operateTask && (
        <EditDialog
          type={
            typeof operateTask === "boolean"
              ? DialogType.CREATE
              : DialogType.EDIT
          }
          todoItem={typeof operateTask === "boolean" ? {} : operateTask}
          date={datePicked}
          open={!!operateTask}
          onOk={handleEditTodoTask}
          onCancel={() => {
            setOperateTask(false);
          }}
        />
      )}
    </>
  );
};

export default TodoList;
