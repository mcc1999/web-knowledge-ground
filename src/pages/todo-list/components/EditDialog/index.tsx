import { TodoItem } from '@/store/todoList';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, TypeOf, z } from 'zod';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeletableMultiSelect from '@/components/DeletableMultiSelcet';
import dayjs, { Dayjs } from 'dayjs';
import { createFilterOptions } from '@mui/material/Autocomplete';
import useWebPlaygroundStore from '@/store';

export enum DialogType {
  'CREATE' = 'CREATE',
  'EDIT' = 'EDIT'
}

export interface FormContext {
  title: string;
  remark?: string;
}

export interface EditDialogProps {
  open: boolean;
  type?: DialogType;
  todoItem?: Partial<TodoItem>;
  onOk: (todoItem: Omit<Partial<TodoItem>, 'date'>) => Promise<void> | void;
  onCancel: () => void;
}

const registerSchema = object({
  title: string()
    .nonempty('请输入标题')
    .max(32, '标题长度不能超过32个字符'),
  remark: string()
    .max(256, '标题长度不能超过256个字符')
    .optional(),
  deadline: z.instanceof(dayjs as unknown as typeof Dayjs)
    .refine((d) => d.isAfter(dayjs()), 'Deadline需晚于当前时间')
    .optional(),
  tags: string()
    .array()
    .optional(),
})


type RegisterInput = TypeOf<typeof registerSchema>;

const filter = createFilterOptions<string>();

const EditDialog:React.FC<EditDialogProps> = (props) => {
  const { open, type, todoItem, onOk, onCancel } = props
  const [ tags ] = useWebPlaygroundStore((state) =>[ state.tags ])
  console.log('tags', tags)
  const {
    watch,
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      title: todoItem?.title ?? '',
      remark: todoItem?.remark ?? undefined,
      deadline: todoItem?.deadline ? dayjs(todoItem?.deadline): undefined,
      tags: todoItem?.tags ?? [],
    },
  });

  const onSubmit = () => {
    const {deadline, tags: tagsValue, ...formData} = watch()
    handleSubmit(() => onOk({
      deadline: deadline?.format('YYYY-MM-DD HH:mm:ss'), 
      tags: tagsValue?.map(t => t.replace(/Add "([\w\u4e00-\u9fa5\d]+)"/, '$1')),
      ...formData,
    }))()
  }  

  return (
    <Dialog open={open}>
      <DialogTitle>{type === DialogType.CREATE ? '新建TODO' : '编辑TODO'}</DialogTitle>
        <DialogContent>
          <Box component='form'>
            <TextField
              label="标题"
              required
              fullWidth
              size='small'
              margin='dense'
              error={!!errors['title']}
              helperText={errors['title'] ? errors['title'].message : ''}
              {...register('title')}
            />
            <TextField
              label="详情"
              multiline
              rows={2}
              fullWidth
              size='small'
              margin='dense'
              error={!!errors['remark']}
              helperText={errors['remark'] ? errors['remark'].message : ''}
              {...register('remark')}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                control={control}
                name='deadline'
                render={({ field: { onChange, value } }) => (
                  <DateTimePicker
                    disablePast
                    onChange={onChange}
                    value={value}
                    label="Deadline"
                    views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                    ampm={false}
                    slotProps={{ textField: {
                      label: 'Deadline',
                      size: 'small',
                      margin: 'dense',
                      fullWidth: true,
                      error: !!errors['deadline'],
                      helperText: errors['deadline'] ? errors['deadline'].message : '',
                    }}}
                />
                )}
              />
            </LocalizationProvider>
            <Controller 
              control={control}
              name='tags'
              render={({ field: { value, onChange } }) => (
                <DeletableMultiSelect
                  value={value}
                  onChange={(e, newValue) => onChange(newValue)}
                  options={tags.map(t => t.value)}
                  size='small'
                  fullWidth
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
            
                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option);
                    if (inputValue !== '' && !isExisting) {
                      filtered.push(`Add "${inputValue}"`);
                    }
            
                    return filtered;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      margin='dense'
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>取消</Button>
          <Button onClick={onSubmit}>确定</Button>
        </DialogActions>
    </Dialog>  
  )
}

export default EditDialog