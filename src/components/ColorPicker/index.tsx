import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  Popover,
} from "@mui/material";
import { useSize } from "ahooks";
import React, { forwardRef, useRef, useState } from "react";
import { ColorResult, SliderPicker } from "react-color";

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (evt: any, value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  name?: string;
  children?: (color?: string) => React.ReactNode;
}

const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      label,
      error,
      helperText,
      required,
      name,
      children,
    },
    ref
  ) => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const [internalValue, setInternalValue] = useState(value || defaultValue);
    const colorBoxRef = useRef<HTMLDivElement>(null);
    const size = useSize(colorBoxRef);
    const currentColor = value ?? internalValue;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleChangeComplete = (color: ColorResult) => {
      if (!value) {
        setInternalValue(color.hex);
      }
      onChange?.("", color.hex);
    };

    const open = Boolean(anchorEl);

    return (
      <FormControl
        ref={ref}
        error={error}
        required={required}
        fullWidth
        sx={{
          margin: "8px 0 4px 0",
        }}
      >
        {label && (
          <InputLabel size="small" shrink={!!value}>
            {label}
          </InputLabel>
        )}
        {!!value && (
          <Box
            sx={{
              position: "absolute",
              left: "14px",
              top: "11px",
              fontSize: "small",
            }}
          >
            {value}
          </Box>
        )}
        <Box
          ref={colorBoxRef}
          role="button"
          tabIndex={0}
          onClick={handleClick}
          sx={{
            width: "100%",
            height: "40px",
            display: "inline-block",
            borderRadius: 1,
            backgroundColor: currentColor,
            border: error
              ? "1px solid #d32f2f"
              : "1px solid rgba(0, 0, 0, 0.23)",
            cursor: "pointer",
          }}
        />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          slotProps={{ paper: { sx: { width: size?.width ?? 0 } } }}
          disablePortal
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              maxWidth: "360px",
              flexDirection: "column",
              padding: "24px",
              fontWeight: "bold",
              "& > div:not(:last-of-type)": {
                paddingBottom: "8px",
                marginBottom: "8px",
                borderBottom: "2px solid",
              },
            }}
          >
            <Box>
              颜色选择器：
              <SliderPicker
                color={currentColor}
                onChangeComplete={handleChangeComplete}
              />
            </Box>
            {children && <Box>组件预览：{children(value)}</Box>}
          </Box>
        </Popover>
      </FormControl>
    );
  }
);

ColorPicker.displayName = "ColorPicker";
export default ColorPicker;
