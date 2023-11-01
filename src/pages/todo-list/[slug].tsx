import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import GrainIcon from '@mui/icons-material/Grain';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AddIcon from '@mui/icons-material/Add';
import BreadcrumbsThemeHeader from '@/components/BreadcrumbsThemeHeader';
import dayjs, { Dayjs } from 'dayjs';
import Tag from '@/components/Tag';
import { TodoItem, UpdateTagType } from '@/store/todoList';
import useWebPlaygroundStore from '@/store';
import { Button, Dialog } from '@mui/material';

import styles from './index.module.scss'
import EditDialog, { DialogType } from './components/EditDialog';

const TodoDay: React.FC = () => {
  const router = useRouter()
  const [ 
    todoList, 
    updateTodoItemTags,
    addTodoItem,
  ] = useWebPlaygroundStore((state) =>[ 
    state.todoList, 
    state.updateTodoItemTags,
    state.addTodoItem,
  ])
  const [dialogType, setDialogType] = useState<DialogType | undefined>();

  /**
   * 根据日期获取TodoItem列表
   * @param date string 日期YYYY-MM-DD
   * @returns TodoItem[ ]
   */
  const getTodoListByDate =  (date: string) => {
    return todoList.filter(todo => todo.date === date)
  }

  const onCloseTag = (id: number, tag: string) => {
    updateTodoItemTags(UpdateTagType.DELETE, id, tag)
  }

  const onAddTodoItem = (todoItem: Partial<TodoItem>) => {
    addTodoItem({
      ...todoItem,
      date: router.query.slug!.toString(),
    })
    setDialogType(undefined)
  }
  
  const breadcrumbs = [
    {
      name: 'Font Page',
      path: '/',
      icon: <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
    },
    {
      name: 'Todo List',
      path: '/todo-list',
      icon: <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
    },
    {
      name: router.query.slug?.toString() || '',
      path: `/todo-list/${router.query.slug}`,
      icon: <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
    },
  ]

  return (
    <div className={styles['todo-list-detail-container']}>
      <BreadcrumbsThemeHeader breadcrumbs={breadcrumbs} />
      <div className='todo-list-box'>
        <div className='todo-list list-box'>
          <div className='list-box__header'>
            <div className='header-title'>TODO</div>
            <div>
              <Button 
                variant='contained' 
                size='small' 
                startIcon={<AddIcon />}
                onClick={() => setDialogType(DialogType.CREATE)}
              >新建</Button>
            </div>
          </div>
          {getTodoListByDate(router.query.slug as string).map((todo, i) => (
            <div key={i} className='todo-list-item'>
              <div className='todo-list-item__title'>{todo.title}</div>
              {/* <div className='todo-list-item__remark'>{todo.remark}</div> */}
              <div className='todo-list-item__info'>
                {!!todo.deadline && <div className='todo-list-item__deadline'>
                  <Tag color={dayjs().isBefore(dayjs(todo.deadline)) ? 'processing' : 'error'}>Deadline:{todo.deadline}</Tag>
                </div>}
                {!!todo.tags?.length && <div className='todo-list-item__tags'>
                  {todo.tags.map((tag, idx) => (
                    <Tag 
                      key={idx} 
                      style={{ marginRight: idx === getTodoListByDate(router.query.slug as string).length - 1 ? 0 : 4}}
                      closable
                      onClose={() => onCloseTag(todo.id, tag)}
                    >
                      #{tag}
                    </Tag>  
                  ))}
                </div>}
              </div>
            </div>
          ))}
        </div>
        <div className='done-list list-box'>
          <h2 className='list-box__header'>Done</h2>

        </div>
      </div>
      {!!dialogType && <EditDialog 
        open={!!dialogType}
        type={dialogType}
        todoItem={{
          title: '1213',
          remark: '123',
          deadline: dayjs().format('YYYY-MM-DD'),
          tags: ['tag1']
        }}
        onOk={onAddTodoItem}
        onCancel={() => setDialogType(undefined)}
      />}
    </div>
  )
}

export default TodoDay