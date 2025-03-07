import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogProps,
} from "@mui/material";
import React from "react";

export interface BaseDialogProps
  extends Omit<DialogProps, "onClose" | "title"> {
  title?: React.ReactNode;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  showActions?: boolean;
  children?: React.ReactNode;
}

const BaseDialog: React.FC<BaseDialogProps> = ({
  title,
  open,
  onOk,
  onCancel,
  okText = "确定",
  cancelText = "取消",
  showActions = true,
  children,
  ...dialogProps
}) => {
  return (
    <Dialog
      open={open}
      onClose={(evt, reason) => {
        reason !== "backdropClick" && onCancel();
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "24px",
            backdropFilter: "blur(8px)",
          },
        },
      }}
      {...dialogProps}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent sx={{ padding: "12px 24px !important" }}>
        {children}
      </DialogContent>
      {showActions && (
        <DialogActions>
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button onClick={onOk}>{okText}</Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default BaseDialog;
