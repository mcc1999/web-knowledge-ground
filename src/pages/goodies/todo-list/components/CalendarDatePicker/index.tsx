import React from "react";
import { Box, Button, IconButton } from "@mui/material";
import {
  ArrowLeftIcon,
  DateCalendar,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

export interface CalendarDatePickerProps {
  datePicked: Dayjs;
  setdatePicked: (date: Dayjs) => void;
}
export default function CalendarDatePicker({
  datePicked,
  setdatePicked,
}: CalendarDatePickerProps) {
  return (
    <Box className="date-picker" sx={{ bgcolor: "cardBg.main" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          views={["year", "month", "day"]}
          showDaysOutsideCurrentMonth
          value={datePicked}
          slots={{
            previousIconButton: (props) => (
              <div className="date-picker__header-custom-preview-button">
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setdatePicked(dayjs())}
                >
                  today
                </Button>
                <IconButton {...props}>
                  <ArrowLeftIcon />
                </IconButton>
              </div>
            ),
          }}
          onChange={setdatePicked}
        />
      </LocalizationProvider>
    </Box>
  );
}
