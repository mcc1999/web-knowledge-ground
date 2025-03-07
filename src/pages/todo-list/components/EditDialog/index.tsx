import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { object, string, TypeOf, z } from "zod";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import DeletableMultiSelect from "@/components/DeletableMultiSelect";
import dayjs, { Dayjs } from "dayjs";
import { createFilterOptions } from "@mui/material/Autocomplete";
import useWebPlaygroundStore from "@/store";
import { TodoTask, TodoTaskStatus } from "@/store/calendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect } from "react";
import FormDialog from "@/components/FormDialog";

export enum DialogType {
  "CREATE" = "CREATE",
  "EDIT" = "EDIT",
}

export interface FormContext {
  title: string;
  detail?: string;
}

export interface EditDialogProps {
  open: boolean;
  date: Dayjs;
  type?: DialogType;
  todoItem?: Partial<TodoTask>;
  onOk: (
    todoItem: Omit<Partial<TodoTask>, "date"> & {
      type: DialogType;
      date: Dayjs;
    }
  ) => Promise<void> | void;
  onCancel: () => void;
}

const registerSchema = object({
  title: string().min(1, "请输入标题").max(8, "标题长度不能超过8个字符"),
  detail: string().max(256, "详情长度不能超过256个字符").optional(),
  startTime: z.instanceof(dayjs as unknown as typeof Dayjs),
  endTime: z.instanceof(dayjs as unknown as typeof Dayjs),
  taskGroup: string().min(1, "请选择任务分组"),
  tags: string().array().optional(),
}).refine(
  (data) => {
    // 如果开始时间和结束时间都存在，则校验开始时间是否早于结束时间
    if (data.startTime && data.endTime) {
      return data.startTime.isBefore(data.endTime);
    }
    return true;
  },
  {
    message: "开始时间必须早于结束时间",
    path: ["startTime"],
  }
);

type RegisterInput = TypeOf<typeof registerSchema>;

const filter = createFilterOptions<string>();

const EditDialog: React.FC<EditDialogProps> = (props) => {
  const { open, type, date, todoItem, onOk, onCancel } = props;
  const [calendarTags, taskGroups] = useWebPlaygroundStore((state) => [
    state.calendarTags,
    state.taskGroups,
  ]);

  useEffect(() => {
    // @ts-ignore
    useWebPlaygroundStore?.persist.rehydrate();
  }, []);

  const handleSubmit = (data: RegisterInput) => {
    const {
      startTime,
      endTime,
      tags: tagsValue,
      ...formData
    } = data;
    onOk({
      id: todoItem?.id ?? "0", // 创建时 "0" 会在 Zustand 被 uuid 替换
      type: type ?? DialogType.CREATE,
      status: todoItem?.status ?? TodoTaskStatus.TODO,
      date: todoItem?.date ? dayjs(todoItem.date) : date,
      timeRange: [startTime, endTime],
      tags: tagsValue,
      ...formData,
    });
  };

  return (
    <>
      <FormDialog<RegisterInput, typeof registerSchema>
        open={open}
        title={type === DialogType.CREATE ? "新建TODO" : "编辑TODO"}
        schema={registerSchema}
        defaultValues={{
          title: todoItem?.title ?? "",
          detail: todoItem?.detail ?? undefined,
          startTime: todoItem?.timeRange
            ? date
                .hour(dayjs(todoItem.timeRange[0]).hour())
                .minute(dayjs(todoItem.timeRange[0]).minute())
            : date.hour(0).minute(0),
          endTime: todoItem?.timeRange
            ? date
                .hour(dayjs(todoItem.timeRange[1]).hour())
                .minute(dayjs(todoItem.timeRange[1]).minute())
            : date.hour(0).minute(0),
          tags: todoItem?.tags ?? [],
          taskGroup: todoItem?.taskGroup ?? "default",
        }}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      >
        {({ control, register, trigger, formState: { errors } }) => (
          <>
            <TextField
              label="标题"
              required
              fullWidth
              size="small"
              margin="dense"
              error={!!errors["title"]}
              helperText={errors["title"] ? errors["title"].message : ""}
              {...register("title")}
            />
            <TextField
              label="详情"
              multiline
              rows={2}
              fullWidth
              size="small"
              margin="dense"
              error={!!errors["detail"]}
              helperText={errors["detail"] ? errors["detail"].message : ""}
              {...register("detail")}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                control={control}
                name="startTime"
                render={({ field: { onChange, value } }) => (
                  <TimePicker
                    label="开始时间"
                    views={["hours", "minutes"]}
                    format="HH:mm"
                    ampm={false}
                    value={value}
                    onChange={(newValue) => {
                      onChange(newValue);
                      trigger(["startTime", "endTime"]);
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: false,
                        margin: "dense",
                        error: !!errors["startTime"],
                        helperText: errors["startTime"]?.message,
                      },
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="endTime"
                render={({ field: { onChange, value } }) => (
                  <TimePicker
                    label="结束时间"
                    views={["hours", "minutes"]}
                    format="HH:mm"
                    ampm={false}
                    value={value}
                    onChange={(newValue) => {
                      onChange(newValue);
                      trigger(["startTime", "endTime"]);
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: false,
                        margin: "dense",
                        error: !!errors["endTime"],
                        helperText: errors["endTime"]?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <Controller
              control={control}
              name="taskGroup"
              render={({ field: { onChange, value } }) => (
                <FormControl sx={{ m: "8px 0 4px 0", width: "100%" }}>
                  <InputLabel
                    id="task-group-select-label"
                    size="small"
                    required
                  >
                    TaskGroup
                  </InputLabel>
                  <Select
                    labelId="task-group-select-label"
                    id="task-group-select"
                    label="任务分组"
                    value={value}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    required
                    fullWidth
                    size="small"
                    margin="dense"
                    error={!!errors["taskGroup"]}
                  >
                    {Object.values(taskGroups).map(({ id, value }) => (
                      <MenuItem key={id} value={id}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors["taskGroup"] && (
                    <FormHelperText>
                      {errors["taskGroup"].message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="tags"
              render={({ field: { value, onChange } }) => (
                <DeletableMultiSelect
                  value={value}
                  onChange={(e, newValue) => onChange(newValue)}
                  options={calendarTags.map((t) => t.id)}
                  size="small"
                  fullWidth
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some(
                      (option) => inputValue === option
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push(`Add "${inputValue}"`);
                    }

                    return filtered;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      margin="dense"
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
          </>
        )}
      </FormDialog>
    </>
  );
};

export default EditDialog;
