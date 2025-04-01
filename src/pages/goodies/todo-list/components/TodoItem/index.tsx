import { Box, MenuItem, MenuList } from "@mui/material";
import Chip, { ChipProps } from "@mui/material/Chip";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import type { Dayjs } from "dayjs";
import React, { useRef } from "react";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import useTodoItemHeight from "../useTodoItemHeight";
import dayjs from "dayjs";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import StatusSlider from "../StatusSlider";
import { TaskGroup, TodoTaskStatus } from "@/store/calendar";
import { styled } from "@mui/material/styles";
import useWebPlaygroundStore from "@/store";

export interface TodoItemProps {
  id: string;
  timeRange: [Dayjs, Dayjs];
  title: string;
  detail: string;
  status: TodoTaskStatus;
  tags: string[];
  taskGroup: string;
  handleEditTodoTask: () => void;
}
const defaultValueMap = {
  [TodoTaskStatus.TODO]: 0,
  [TodoTaskStatus.DOING]: 50,
  [TodoTaskStatus.DONE]: 100,
};
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: "#fff",
    boxShadow: theme.shadows[1],
    fontSize: 12,
    height: 156,
  },
  [`& .${tooltipClasses.tooltip} ul`]: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  [`& .${tooltipClasses.tooltip} li`]: {
    justifyContent: "center",
    flex: 1,
  },
  [`& .${tooltipClasses.tooltip} li:not(:last-of-type)`]: {
    borderBottom: "1px solid #e8e8e8",
  },
}));
const TodoItem: React.FC<TodoItemProps> = (props) => {
  const [taskGroups, calendarTags, toggleTodoTaskStatus] =
    useWebPlaygroundStore((state) => [
      state.taskGroups,
      state.calendarTags,
      state.toggleTodoTaskStatus,
    ]);
  const ref = useRef<HTMLDivElement>(null);
  const { height: itemHeight } = useTodoItemHeight(ref);

  const taskGroup =
    taskGroups.find((group) => group.id === props.taskGroup) ||
    ({ value: "", bgcolor: "#000" } as TaskGroup);

  const tags = props.tags.map((tag) => {
    const tagItem = calendarTags.find((item) => item.id === tag);
    return tagItem?.value || "";
  });

  function getDayHours(date: Dayjs) {
    return date.hour() + date.minute() / 60;
  }

  function getTodoItemStyle(
    timeRange: [Dayjs, Dayjs],
    status: TodoItemProps["status"]
  ) {
    const hoursFromZero = getDayHours(dayjs(timeRange[0]));
    const hoursDiff = dayjs(timeRange[1]).diff(dayjs(timeRange[0]), "hour");
    const style: React.CSSProperties & { chipColor: ChipProps["color"] } = {
      top: `${8 + 64 + hoursFromZero * 128}px`,
      height: `${hoursDiff * 128}px`,
      chipColor: "warning",
    };
    if (status === "done") {
      style.backgroundColor = "#cfeba4";
      style.chipColor = "success";
    } else if (status === "doing") {
      style.backgroundColor = "#cfcffb";
      style.chipColor = "info";
    } else {
      style.backgroundColor = "#f9dfb4";
    }
    return style;
  }

  const { backgroundColor, top, height, chipColor } = getTodoItemStyle(
    [props.timeRange[0], props.timeRange[1]],
    props.status
  );

  return (
    <Box
      ref={ref}
      className="daily-list__todo-item"
      sx={{ top, height, backgroundColor }}
    >
      <div className="daily-list__todo-item-title">
        {props.title}
        <LightTooltip
          title={
            <MenuList>
              <MenuItem>
                <StatusSlider
                  sx={{ width: 96 }}
                  size="small"
                  defaultValue={defaultValueMap[props.status]}
                  handleChange={(value) => {
                    const newStatus =
                      value === 0
                        ? TodoTaskStatus.TODO
                        : value === 50
                        ? TodoTaskStatus.DOING
                        : TodoTaskStatus.DONE;
                    toggleTodoTaskStatus(props.id, newStatus);
                  }}
                />
              </MenuItem>
              <MenuItem onClick={props.handleEditTodoTask}>编辑</MenuItem>
            </MenuList>
          }
          placement="right-start"
        >
          <MoreHorizIcon sx={{ cursor: "pointer" }} />
        </LightTooltip>
      </div>
      <div className="daily-list__todo-item-content">
        <div className="daily-list__todo-item-timeRange">
          <WatchLaterIcon fontSize="small" />
          {dayjs(props.timeRange[0]).format("HH:mm")}-
          {dayjs(props.timeRange[1]).format("HH:mm")}
          <div className="daily-list__todo-item-tags">
            {tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>
        <div className="daily-list__todo-item-header">
          <Chip
            // color={}
            size="small"
            label={taskGroup.value}
            sx={{
              color: "white",
              fontSize: "0.8rem",
              height: "18px",
              bgcolor: taskGroup.bgcolor,
            }}
          />
          <Chip
            color={chipColor}
            size="small"
            label={props.status?.toUpperCase()}
            sx={{ color: "white", fontSize: "0.8rem", height: "18px" }}
          />
        </div>
        <div
          className="daily-list__todo-item-detail"
          title={props.detail}
          style={{
            WebkitLineClamp: Math.min(Math.floor((itemHeight - 87) / 16), 8),
          }}
        >
          <span>Detail: </span>
          {props.detail || "无"}
        </div>
      </div>
    </Box>
  );
};

export default TodoItem;
