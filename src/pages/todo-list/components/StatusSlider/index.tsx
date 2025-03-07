import { Slider, SliderProps, Typography } from "@mui/material";
import React from "react";

const colorMap: Record<string, "warning" | "info" | "success"> = {
  0: "warning",
  50: "info",
  100: "success",
};

export interface StatusSliderProps extends SliderProps {
  defaultValue: number;
  handleChange: (value: number) => void;
}
export default function StatusSlider({
  defaultValue,
  handleChange,
  ...props
}: StatusSliderProps) {
  const [value, setValue] = React.useState(defaultValue);
  const marks = [
    {
      value: 0,
      label: (
        <Typography
          color={value === 0 ? "warning" : "rgba(255, 255, 255, 0.7)"}
          sx={{ fontSize: "smaller" }}
        >
          TODO
        </Typography>
      ),
    },
    {
      value: 50,
      label: (
        <Typography
          color={value === 50 ? "info" : "rgba(255, 255, 255, 0.7)"}
          sx={{ fontSize: "smaller" }}
        >
          DOING
        </Typography>
      ),
    },
    {
      value: 100,
      label: (
        <Typography
          color={value === 100 ? "success" : "rgba(255, 255, 255, 0.7)"}
          sx={{ fontSize: "smaller" }}
        >
          DONE
        </Typography>
      ),
    },
  ];
  return (
    <Slider
      sx={{ width: "100%" }}
      aria-label="Task Status"
      marks={marks}
      valueLabelDisplay="off"
      color={colorMap[String(value)]}
      step={null}
      value={value}
      {...props}
      onChange={(_, value) => {
        const val = typeof value === "number" ? value : value[0];
        setValue(val);
        handleChange(val);
      }}
    />
  );
}
