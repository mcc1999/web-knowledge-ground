import Tag from '@/components/Tag'
import useWebPlaygroundStore from '@/store';
import { TodoItem, UpdateTagType } from '@/store/todoList'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { Button, Divider, IconButton, Popover, Tooltip } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SubjectIcon from '@mui/icons-material/Subject';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import InfoIcon from '@mui/icons-material/Info';

import styles from './index.module.scss'

export interface ITodoItemComponent {
  todo: TodoItem;
  onEdit: () => void;
}

const TodoItemComponent:React.FC<ITodoItemComponent> = ({todo, onEdit}) => {
  const [donePopoverOpen, setDonePopoverOpen] = useState<boolean>(false)

  const [
    updateTodoItemTags,
    updateTodoItem,
  ] = useWebPlaygroundStore((state) =>[ 
    state.updateTodoItemTags,
    state.updateTodoItem,
  ])

  const onDeleteTag = (id: number, tag: string) => {
    updateTodoItemTags(UpdateTagType.DELETE, id, tag)
  }

  return (
    <div className={styles['todo-list-item']}>

      <div></div>
      <div className='todo-list-item__title'>标题：{todo.title}</div>
      <div className='todo-list-item__remark'>
        <span>内容：</span>
        <Tooltip title={todo.remark} arrow placement='top'>
          <div className='todo-list-item__remark-content'>
            {todo.remark ? todo.remark : '无'}
          </div>
        </Tooltip>
      </div>
      <div className='todo-list-item__info'>
        <div className='todo-list-item__deadline'>
          <Tag color={dayjs().isBefore(dayjs(todo.deadline)) ? 'processing' : 'error'}>Deadline:{todo.deadline}</Tag>
        </div>
        <div className='todo-list-item__tags-box'>
          <Tooltip 
            title={(todo.tags?.length || 0) > 4 ? (
              <div style={{width: 320, display: 'flex', flexWrap: 'wrap'}}>          
                {todo.tags!.map((tag, idx) => (
                  <Tag 
                    key={idx} 
                    style={{ marginRight: idx === todo.tags!.length - 1 ? 0 : 4}}
                    closable
                    onClose={() => onDeleteTag(todo.id, tag)}
                  >
                    #{tag}
                  </Tag>  
                ))}
              </div>
            ): null}
            arrow 
            placement='top'
          >
            <div className='todo-list-item__tags'>              
              {todo.tags?.slice(0, 4).map((tag, idx) => (
                <Tag 
                  key={idx} 
                  style={{ marginRight: idx === todo.tags!.length - 1 ? 0 : 4}}
                  closable
                  onClose={() => onDeleteTag(todo.id, tag)}
                >
                  #{tag}
                </Tag>  
              ))}
              {(todo.tags?.length || 0) > 4 ? '...' : null}
            </div>
          </Tooltip>
        </div>
      </div>
      <div className='todo-list-actions'>
        <Popover
          open={donePopoverOpen} 
          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
          anchorEl={document.getElementById('doneIconButton')}
        >
          <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center' }}>
            <InfoIcon color='warning' sx={{ marginRight: 1 }} />确认完成吗？
          </div>
          <div style={{ padding: '12px 24px' }}>
            <Button 
              size='small' 
              variant="contained" 
              sx={{ marginRight: 1 }} 
              onClick={() => {updateTodoItem(todo.id, { done: true }); setDonePopoverOpen(false)}}
            >确认</Button>
            <Button 
              size='small' 
              variant="outlined" 
              onClick={() => setDonePopoverOpen(false)}
            >取消</Button>
          </div>
        </Popover>
        <Tooltip title='完成' arrow placement='top'>
          <IconButton onClick={() => setDonePopoverOpen(true)} id='doneIconButton'>
            <FactCheckIcon fontSize='small' color='primary' />
          </IconButton>
        </Tooltip>
        <Divider />
        <Tooltip title='编辑' arrow placement='top'>
          <IconButton onClick={onEdit}><BorderColorIcon fontSize='small' /></IconButton>
        </Tooltip>
        <Divider />
        <Tooltip title='子事项' arrow placement='top'>
          <IconButton><SubjectIcon fontSize='small' /></IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

export default TodoItemComponent