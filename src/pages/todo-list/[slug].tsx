import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import GrainIcon from '@mui/icons-material/Grain';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AddIcon from '@mui/icons-material/Add';
import BreadcrumbsThemeHeader from '@/components/BreadcrumbsThemeHeader';
import { TodoItem } from '@/store/todoList';
import useWebPlaygroundStore from '@/store';
import { Button } from '@mui/material';
import EditDialog, { DialogType } from './components/EditDialog';
import TodoItemComponent from './components/TodoItemComponent';

import styles from './index.module.scss'

const TodoDay: React.FC = () => {
  const router = useRouter()
  const [ 
    todoList, 
    addTodoItem,
    updateTodoItem,
  ] = useWebPlaygroundStore((state) =>[ 
    state.todoList, 
    state.addTodoItem,
    state.updateTodoItem,
  ])
  const [dialogType, setDialogType] = useState<DialogType | undefined>();
  const [editItem, setEditItem] = useState<TodoItem>()

  useEffect(() => {
    // @ts-ignore
    useWebPlaygroundStore?.persist.rehydrate()
  }, [])
  
  /**
   * 根据日期获取TodoItem列表
   * @param date string 日期YYYY-MM-DD
   * @returns TodoItem[ ]
   */
  const getTodoListByDate =  (date: string, done = false) => {
    return todoList.filter(todo => todo.date === date && todo.done === done)
  }
  
  const onCreateOrUpdateItem = (todoItem: Partial<TodoItem>) => {
    if (dialogType === DialogType.CREATE) {
      addTodoItem({
        ...todoItem,
        done: false,
        date: router.query.slug!.toString(),
      })
    } else if (dialogType === DialogType.EDIT) {
      const todoItemId = editItem?.id
      if (todoItemId === undefined) return
      updateTodoItem(todoItemId, todoItem)
    } 

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
            <TodoItemComponent 
              key={i} 
              todo={todo} 
              onEdit={() => {setEditItem(todo); setDialogType(DialogType.EDIT)}} 
            />
          ))}
        </div>
        <div className='done-list list-box'>
          <div className='list-box__header'>
            <div className='header-title'>Done</div>
          </div>
          {getTodoListByDate(router.query.slug as string, true).map((todo, i) => (
            <TodoItemComponent 
              key={i} 
              todo={todo} 
              onEdit={() => {setEditItem(todo); setDialogType(DialogType.EDIT)}} 
            />
          ))}
        </div>
      </div>
      {!!dialogType && <EditDialog 
        open={!!dialogType}
        type={dialogType}
        onOk={onCreateOrUpdateItem}
        todoItem={dialogType === DialogType.EDIT ? editItem : undefined}
        onCancel={() => setDialogType(undefined)}
      />}
    </div>
  )
}

export default TodoDay