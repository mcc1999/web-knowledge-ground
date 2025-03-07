import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { Dayjs } from "dayjs";
import { Box } from "@mui/material";

export interface TodoTasksDateRangeListProps {
  dateRangeList: Dayjs[];
  datePicked: Dayjs;
  handleDatePick: (date: Dayjs) => void;
  handleDateRangeNavigate: (direction: "prev" | "next") => void;
}
const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export default function TodoTasksDateRangeList({
  datePicked,
  dateRangeList,
  handleDateRangeNavigate,
  handleDatePick,
}: TodoTasksDateRangeListProps) {
  return (
    <div className="date-range-list">
      <div
        className="date-range-list__operator"
        onClick={() => handleDateRangeNavigate("prev")}
      >
        <NavigateBeforeIcon />
      </div>
      {dateRangeList.map((date) => (
        <Box
          key={date.format("mm-dd")}
          className="date-range-list__item"
          sx={
            date.isSame(datePicked, "day")
              ? {
                  backgroundColor: "#8B5FBF !important",
                }
              : {}
          }
          onClick={() => handleDatePick(date)}
        >
          <div className="date-range-list__item-week">{dayMap[date.day()]}</div>
          <div className="date-range-list__item-date">
            {date.date() === 1 ? date.format("MM-DD") : date.format("DD")}
          </div>
        </Box>
      ))}
      <div
        className="date-range-list__operator"
        onClick={() => handleDateRangeNavigate("next")}
      >
        <NavigateNextIcon />
      </div>
    </div>
  );
}
