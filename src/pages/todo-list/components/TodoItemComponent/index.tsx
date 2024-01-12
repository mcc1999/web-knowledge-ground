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
  isSubItem?: number; // 如果是子事项，该值为父事项id
  onEdit: () => void;
}

const TodoItemComponent: React.FC<ITodoItemComponent> = ({
  todo,
  onEdit,
  isSubItem,
}) => {
  const [popoverOpen, setPopoverOpen] = useState<PopoverType>();
  const [subItemsDialogOpen, setSubItemsDialogOpen] = useState<boolean>(false);

  const [
    updateTodoItemTags,
    updateTodoItem,
    updateSubItemTags,
    deleteTodoItem,
    updateSubItem,
  ] = useWebPlaygroundStore((state) => [
    state.updateTodoItemTags,
    state.updateTodoItem,
    state.updateSubItemTags,
    state.deleteTodoItem,
    state.updateSubItem,
  ]);

  const onDeleteTag = (id: number, tag: string) => {
    if (isSubItem !== undefined) {
      updateSubItemTags(UpdateTagType.DELETE, isSubItem, id, tag);
    } else {
      updateTodoItemTags(UpdateTagType.DELETE, id, tag);
    }
  };
  const onUpdateItem = (id: number, newInfo: Partial<TodoItem>) => {
    if (isSubItem !== undefined) {
      updateSubItem(isSubItem, id, newInfo);
    } else {
      updateTodoItem(id, newInfo);
    }
  };

  return (
    <Box className={styles["todo-list-item"]} sx={{ bgcolor: "itemBg.main" }}>
      <div className="todo-list-item__title">标题：{todo.title}</div>
      <div className="todo-list-item__remark">
        <span>内容：</span>
        <div className="todo-list-item__remark-content">
          {/* {todo.remark ? todo.remark : "无"} */}
          {todo.remark ? (
            <Tooltip title={todo.remark} arrow>
              <div className="todo-list-item__remark-content--overflow">
                {todo.remark}
              </div>
            </Tooltip>
          ) : (
            "无"
          )}
        </div>
      </div>
      <div className="todo-list-item__info">
        <div className="todo-list-item__deadline">
          <Tag
            color={
              !todo.deadline || dayjs().isBefore(dayjs(todo.deadline))
                ? "processing"
                : "error"
            }
          >
            Deadline:{todo.deadline ? todo.deadline : "无"}
          </Tag>
        </div>
        <div className="todo-list-item__tags-box">
          <Tooltip
            title={
              (todo.tags?.length || 0) > 4 ? (
                <div style={{ width: 320, display: "flex", flexWrap: "wrap" }}>
                  {todo.tags!.map((tag, idx) => (
                    <Tag
                      key={idx}
                      style={{
                        marginRight: idx === todo.tags!.length - 1 ? 0 : 4,
                      }}
                    >
                      #{tag}
                    </Tag>
                  ))}
                </div>
              ) : null
            }
            arrow
            placement="top"
          >
            <div className="todo-list-item__tags">
              {todo.tags?.slice(0, 4).map((tag, idx) => (
                <Tag
                  key={idx}
                  style={{
                    marginRight: idx === todo.tags!.length - 1 ? 0 : 4,
                  }}
                  closable={!todo.done}
                  onClose={() => onDeleteTag(todo.id, tag)}
                >
                  #{tag}
                </Tag>
              ))}
              {(todo.tags?.length || 0) > 4 ? "..." : null}
            </div>
          </Tooltip>
        </div>
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
                onUpdateItem(todo.id, { done: !todo.done });
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
                deleteTodoItem(todo.id);
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
        {isSubItem === undefined && (
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
