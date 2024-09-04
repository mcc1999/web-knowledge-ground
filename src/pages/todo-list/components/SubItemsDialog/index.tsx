import { TodoItem, TodoItemChild } from "@/store/todoList";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import TodoItemComponent from "../TodoItemComponent";
import EditDialog, { DialogType } from "../EditDialog";
import useWebPlaygroundStore from "@/store";

import styles from "./index.module.scss";

export interface ISubItemsDialog {
  open: boolean;
  todoItem: Partial<TodoItem>;
  onClose: () => void;
}

const SubItemsDialog: React.FC<ISubItemsDialog> = (props) => {
  const { open, todoItem, onClose } = props;
  const [dialogType, setDialogType] = useState<DialogType | undefined>();
  const [editItem, setEditItem] = useState<TodoItem | TodoItemChild>();

  const [addTodoItemChild, updateSubItem] = useWebPlaygroundStore((state) => [
    state.addTodoItemChild,
    state.updateSubItem,
  ]);

  const onCreateOrUpdateSubItem = (subItem: Partial<TodoItem>) => {
    if (dialogType === DialogType.CREATE) {
      addTodoItemChild(todoItem.id!, {
        ...subItem,
        done: false,
        date: todoItem.date!,
      } as TodoItemChild);
    } else if (dialogType === DialogType.EDIT) {
      const subItemId = editItem?.id;
      if (subItemId === undefined) return;
      updateSubItem(todoItem.id!, subItemId, subItem);
    }

    setDialogType(undefined);
  };

  return (
    <Dialog open={open} className={styles["subItems-dialog"]}>
      <DialogTitle>
        <div className="subItems-dialog__title">
          <div>主事项：{todoItem?.title}</div>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent
        className="subItems-dialog__content"
        sx={{ bgcolor: "cardBg.main" }}
      >
        <Box>
          <div className="todo-item__remark">
            <div className="todo-item__remark-title">主事项备注：</div>
            <div className="todo-item__remark-content">
              {todoItem.remark ? todoItem.remark : "无"}
            </div>
          </div>
          <div
            className="subItems-dialog__add-btn"
            onClick={() => setDialogType(DialogType.CREATE)}
          >
            新建子事项
          </div>
          <div className="subItems-dialog__subItem-list">
            {todoItem?.children &&
              todoItem.children.map((todo, i) => (
                <TodoItemComponent
                  key={i}
                  parentItem={todoItem as TodoItem}
                  todo={todo}
                  onEdit={() => {
                    setEditItem(todo);
                    setDialogType(DialogType.EDIT);
                  }}
                />
              ))}
          </div>
        </Box>
      </DialogContent>
      {!!dialogType && (
        <EditDialog
          open={!!dialogType}
          type={dialogType}
          onOk={onCreateOrUpdateSubItem}
          todoItem={dialogType === DialogType.EDIT ? editItem : undefined}
          onCancel={() => setDialogType(undefined)}
        />
      )}
    </Dialog>
  );
};

export default SubItemsDialog;
