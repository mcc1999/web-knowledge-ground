import useWebPlaygroundStore from "@/store";
import { Box, Slider, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import { TaskGroup, TodoTaskStatus } from "@/store/calendar";
import FormDialog from "@/components/FormDialog";
import { object, string, TypeOf } from "zod";
import ColorPicker from "@/components/ColorPicker";
import { Controller } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" color="inherit" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const registerSchema = object({
  name: string().min(1, "请输入名称").max(10, "长度不能超过10个字符"),
  bgcolor: string().min(1, "请选择背景色"),
});

type RegisterInput = TypeOf<typeof registerSchema>;
export default function TaskGroupComponent() {
  const [taskGroups, todoTasks, addTaskGroup, editTaskGroup] =
    useWebPlaygroundStore((state) => [
      state.taskGroups,
      state.todoTasks,
      state.addTaskGroup,
      state.editTaskGroup,
    ]);
  const [editTaskGroupOpen, setEditTaskGroupOpen] = useState<
    boolean | TaskGroup
  >(false);

  useEffect(() => {
    // @ts-ignore
    useWebPlaygroundStore?.persist.rehydrate();
  }, []);

  function handleClose() {
    setEditTaskGroupOpen(false);
  }

  function handleSubmit(data: RegisterInput) {
    if (typeof editTaskGroupOpen === "boolean") {
      addTaskGroup({ value: data.name, bgcolor: data.bgcolor });
    } else {
      editTaskGroup({
        id: editTaskGroupOpen.id,
        value: data.name,
        bgcolor: data.bgcolor,
      });
    }
    handleClose();
  }

  // 计算每个分组的任务数量和完成进度
  const getGroupStats = (groupId: string) => {
    let taskCount = 0;
    let completedCount = 0;

    Object.values(todoTasks).forEach((tasks) => {
      tasks.forEach((task) => {
        if (task.taskGroup === groupId) {
          taskCount++;
          if (task.status === TodoTaskStatus.DONE) {
            completedCount++;
          }
        }
      });
    });

    return {
      taskCount,
      progress:
        taskCount === 0 ? 100 : Math.round((completedCount / taskCount) * 100),
    };
  };

  return (
    <>
      <Box className="task-group" sx={{ bgcolor: "cardBg.main" }}>
        <Box
          className="task-group__header"
          sx={{
            bgcolor: "itemBg.main",
          }}
        >
          <div>
            Task Group
            <Box
              className="task-group__header-count"
              sx={{ bgcolor: "primary.main" }}
            >
              {taskGroups.length}
            </Box>
          </div>
          <AddIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setEditTaskGroupOpen(true)}
          />
        </Box>
        <div className="task-group__content">
          {taskGroups.map((group) => {
            const { taskCount, progress } = getGroupStats(group.id);
            return (
              <Box
                key={group.id}
                className="task-group__content-item"
                sx={{
                  bgcolor: group.bgcolor,
                  position: "relative",
                  "&:hover .edit-icon": {
                    opacity: 1,
                  },
                }}
              >
                <div className="task-group__content-item-left">
                  <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />
                  <div>
                    <div className="task-group__content-item-group-name">
                      {group.value}
                    </div>
                    <div className="task-group__content-item-group-count">
                      {taskCount}Tasks
                    </div>
                  </div>
                </div>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {group.id !== "default" && (
                    <EditIcon
                      className="edit-icon"
                      sx={{
                        cursor: "pointer",
                        opacity: 0,
                        transition: "opacity 0.2s",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                      onClick={() => setEditTaskGroupOpen(group)}
                    />
                  )}
                  <CircularProgressWithLabel value={progress} />
                </Box>
              </Box>
            );
          })}
        </div>
      </Box>
      {!!editTaskGroupOpen && (
        <>
          <FormDialog<RegisterInput, typeof registerSchema>
            title="Create TaskGroup"
            open={!!editTaskGroupOpen}
            schema={registerSchema}
            slotProps={{
              paper: { sx: { width: "350px", bgcolor: "background.default" } },
            }}
            defaultValues={{
              name: editTaskGroupOpen === true ? "" : editTaskGroupOpen.value,
              bgcolor:
                editTaskGroupOpen === true
                  ? "#d6c6e1"
                  : editTaskGroupOpen.bgcolor,
            }}
            onCancel={handleClose}
            onSubmit={handleSubmit}
          >
            {({ control, register, formState: { errors } }) => {
              return (
                <>
                  <TextField
                    label="TaskGroup Name"
                    required
                    fullWidth
                    size="small"
                    error={!!errors["name"]}
                    helperText={errors["name"] ? errors["name"].message : ""}
                    {...register("name")}
                  />
                  <Controller
                    control={control}
                    name="bgcolor"
                    render={({ field: { value, onChange } }) => (
                      <ColorPicker
                        label="Bgcolor Picker"
                        value={value}
                        onChange={(evt, newColor) => {
                          console.log("v=-", newColor);
                          onChange(newColor);
                        }}
                        required
                        error={!!errors["bgcolor"]}
                        helperText={
                          errors["bgcolor"] ? errors["bgcolor"].message : ""
                        }
                      >
                        {(color) => (
                          <Box
                            sx={{
                              bgcolor: color,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "12px",
                              borderRadius: "12px",
                            }}
                          >
                            <Box sx={{ display: "flex" }}>
                              <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />
                              <div>
                                <Box
                                  sx={{
                                    fontWeight: "bold",
                                    marginLeft: "4px",
                                  }}
                                >
                                  TaskGroup Name
                                </Box>
                                <Box
                                  sx={{
                                    fontSize: "small",
                                    fontWeight: "bold",
                                    marginLeft: "4px",
                                  }}
                                >
                                  100Tasks
                                </Box>
                              </div>
                            </Box>
                            <CircularProgressWithLabel value={50} />
                          </Box>
                        )}
                      </ColorPicker>
                    )}
                  />
                </>
              );
            }}
          </FormDialog>
        </>
      )}
    </>
  );
}
