import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import HourglassEmpty from "@mui/icons-material/HourglassEmpty";
import AddIcon from "@mui/icons-material/Add";
import { TodoItem } from "@/store/todoList";
import useWebPlaygroundStore from "@/store";
import { Button, Box } from "@mui/material";
import EditDialog, { DialogType } from "./components/EditDialog";
import TodoItemComponent from "./components/TodoItemComponent";

import styles from "./index.module.scss";

const TodoDay: React.FC = () => {
  const router = useRouter();
  const [todoList, addTodoItem, updateTodoItem] = useWebPlaygroundStore(
    (state) => [state.todoList, state.addTodoItem, state.updateTodoItem]
  );
  const [dialogType, setDialogType] = useState<DialogType | undefined>();
  const [editItem, setEditItem] = useState<TodoItem>();

  useEffect(() => {
    // @ts-ignore
    useWebPlaygroundStore?.persist.rehydrate();
  }, []);

  /**
   * 根据日期获取TodoItem列表
   * @param date string 日期YYYY-MM-DD
   * @returns TodoItem[ ]
   */
  const getTodoListByDate = (date: string, done = false) => {
    return Object.values(todoList).filter((todo) => todo.date === date && todo.done === done);
  };

  const onCreateOrUpdateItem = (todoItem: Partial<TodoItem>) => {
    if (dialogType === DialogType.CREATE) {
      addTodoItem({
        ...todoItem,
        done: false,
        date: router.query.slug!.toString(),
        children: {},
      });
    } else if (dialogType === DialogType.EDIT) {
      const todoItemId = editItem?.id;
      if (todoItemId === undefined) return;
      updateTodoItem(todoItemId, todoItem);
    }

    setDialogType(undefined);
  };

  return (
    <div className={styles["todo-list-detail-container"]}>
      <div className="todo-list-box">
        <Box className="todo-list list-box" sx={{ bgcolor: "cardBg.main" }}>
          <div className="list-box__header">
            <div className="header-title">Todo</div>
            <div>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                color="primary"
                onClick={() => setDialogType(DialogType.CREATE)}
              >
                新建
              </Button>
            </div>
          </div>
          {!!getTodoListByDate(router.query.slug as string).length ? (
            <div className="todo-list-content">
              {getTodoListByDate(router.query.slug as string).map((todo, i) => (
                <TodoItemComponent
                  key={i}
                  todo={todo}
                  onEdit={() => {
                    setEditItem(todo);
                    setDialogType(DialogType.EDIT);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="todo-list-content--empty">
              <HourglassEmpty />
              暂无内容
            </div>
          )}
        </Box>
        <Box className="todo-list list-box" sx={{ bgcolor: "cardBg.main" }}>
          <div className="list-box__header">
            <div className="header-title">Done</div>
          </div>
          {!!getTodoListByDate(router.query.slug as string, true).length ? (
            <div className="todo-list-content">
              {getTodoListByDate(router.query.slug as string, true).map(
                (todo, i) => (
                  <TodoItemComponent
                    key={i}
                    todo={todo}
                    onEdit={() => {
                      setEditItem(todo);
                      setDialogType(DialogType.EDIT);
                    }}
                  />
                )
              )}
            </div>
          ) : (
            <div className="todo-list-content--empty">
              <HourglassEmpty />
              暂无内容
            </div>
          )}
        </Box>
      </div>
      {!!dialogType && (
        <EditDialog
          open={!!dialogType}
          type={dialogType}
          onOk={onCreateOrUpdateItem}
          todoItem={dialogType === DialogType.EDIT ? editItem : undefined}
          onCancel={() => setDialogType(undefined)}
        />
      )}
    </div>
  );
};

export default TodoDay;
