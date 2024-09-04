import Tag from "@/components/Tag";
import useWebPlaygroundStore from "@/store";
import { TodoItem, TodoItemChild, UpdateTagType } from "@/store/todoList";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Box, Button, IconButton, Popover, Tooltip } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SubjectIcon from "@mui/icons-material/Subject";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import InfoIcon from "@mui/icons-material/Info";
import RestorePageIcon from "@mui/icons-material/RestorePage";
import SubItemsDialog from "../SubItemsDialog";
import DeleteIcon from "@mui/icons-material/Delete";

import styles from "./index.module.scss";

enum PopoverType {
  DONE = "DONE",
  DELETE = "DELETE",
}
export interface ITodoItemComponent {
  todo: TodoItem | TodoItemChild;
  parentItem?: TodoItem;
  onEdit: () => void;
}

const TodoItemComponent: React.FC<ITodoItemComponent> = ({
  todo,
  onEdit,
  parentItem,
}) => {
  const [popoverOpen, setPopoverOpen] = useState<PopoverType>();
  const [subItemsDialogOpen, setSubItemsDialogOpen] = useState<boolean>(false);

  const [
    updateTodoItemTags,
    updateSubItemTags,
    deleteTodoItem,
    deleteSubItem,
    toggleItemCompleteStatus,
  ] = useWebPlaygroundStore((state) => [
    state.updateTodoItemTags,
    state.updateSubItemTags,
    state.deleteTodoItem,
    state.deleteSubItem,
    state.toggleItemCompleteStatus,
  ]);

  const onDeleteTag = (id: number, tag: string) => {
    if (parentItem !== undefined) {
      updateSubItemTags(UpdateTagType.DELETE, parentItem.id, id, tag);
    } else {
      updateTodoItemTags(UpdateTagType.DELETE, id, tag);
    }
  };
  const onDeleteItem = (id: number) => {
    if (parentItem !== undefined) {
      deleteSubItem(parentItem.id, id);
    } else {
      deleteTodoItem(id);
    }
  };

  const onToggleItemCompleteStatus = (id: number) => {
    if (parentItem !== undefined) {
      toggleItemCompleteStatus(parentItem.id, id);
    } else {
      toggleItemCompleteStatus(id);
    }
  };

  return (
    <Box className={styles["todo-list-item"]} sx={{ bgcolor: "itemBg.main" }}>
      <div className="todo-list-item__title">标题：{todo.title}</div>
      <div className="todo-list-item__remark">
        <div className="todo-list-item__remark-title">备注：</div>
        <div className="todo-list-item__remark-content">
          {todo.remark ? todo.remark : "无"}
        </div>
      </div>
      <div className="todo-list-item__info">
        {todo.deadline && (
          <div className="todo-list-item__deadline">
            <Tag
              color={
                !todo.deadline || dayjs().isBefore(dayjs(todo.deadline))
                  ? "processing"
                  : "error"
              }
            >
              {todo.deadline}
            </Tag>
          </div>
        )}
        <>
          {todo.tags?.map((tag, idx) => (
            <Tag
              key={idx}
              style={{
                marginRight: 4,
                marginBottom: 4,
              }}
              closable={!todo.done}
              onClose={() => onDeleteTag(todo.id, tag)}
            >
              #{tag}
            </Tag>
          ))}
        </>
      </div>
      <Box
        className={styles["todo-list-actions"]}
        sx={{ color: "purple.main" }}
      >
        <Popover
          open={popoverOpen === PopoverType.DONE}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          anchorEl={document.getElementById(`doneIconButton${todo.id}`)}
        >
          <div
            style={{
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <InfoIcon color="warning" sx={{ marginRight: 1 }} />
            确认标记为{todo.done ? "未完成" : "完成"}吗？
          </div>
          <div style={{ padding: "12px 24px" }}>
            <Button
              size="small"
              variant="contained"
              sx={{ marginRight: 1 }}
              onClick={() => {
                onToggleItemCompleteStatus(todo.id);
                setPopoverOpen(undefined);
              }}
            >
              确认
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setPopoverOpen(undefined)}
            >
              取消
            </Button>
          </div>
        </Popover>
        <Popover
          open={popoverOpen === PopoverType.DELETE}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          anchorEl={document.getElementById(`deleteIconButton${todo.id}`)}
        >
          <div
            style={{
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <InfoIcon color="warning" sx={{ marginRight: 1 }} />
            确认删除吗？
          </div>
          <div style={{ padding: "12px 24px" }}>
            <Button
              size="small"
              variant="contained"
              sx={{ marginRight: 1 }}
              onClick={() => {
                onDeleteItem(todo.id);
                setPopoverOpen(undefined);
              }}
            >
              确认
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setPopoverOpen(undefined)}
            >
              取消
            </Button>
          </div>
        </Popover>
        <Tooltip title={todo.done ? "未完成" : "完成"} arrow placement="top">
          <IconButton
            onClick={() => setPopoverOpen(PopoverType.DONE)}
            id={`doneIconButton${todo.id}`}
          >
            {todo.done ? (
              <RestorePageIcon fontSize="small" color="primary" />
            ) : (
              <FactCheckIcon fontSize="small" color="primary" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="删除" arrow placement="top">
          <IconButton
            onClick={() => setPopoverOpen(PopoverType.DELETE)}
            id={`deleteIconButton${todo.id}`}
          >
            <DeleteIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
        {!todo.done && (
          <Tooltip title="编辑" arrow placement="top">
            <IconButton onClick={onEdit}>
              <BorderColorIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        )}
        {parentItem === undefined && (
          <Tooltip title="子事项" arrow placement="top">
            <IconButton onClick={() => setSubItemsDialogOpen(true)}>
              <SubjectIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <SubItemsDialog
        open={subItemsDialogOpen}
        todoItem={todo}
        onClose={() => setSubItemsDialogOpen(false)}
      />
    </Box>
  );
};

export default TodoItemComponent;
