import { useRouter } from 'next/router';
import React, { useReducer } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import GrainIcon from '@mui/icons-material/Grain';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import BreadcrumbsThemeHeader from '@/components/BreadcrumbsThemeHeader';
import dayjs, { Dayjs } from 'dayjs';
import Tag from '@/components/Tag';

import styles from './index.module.scss'
import { TodoItem } from '@/store/todoList';

const TodoDay: React.FC = () => {
  const router = useRouter()
  // const [ ] = use  
  const todoList: TodoItem[] = [
    {
      id: 1,
      date: dayjs('2023-10-22').format('YYYY-MM-DD'),
      title: 'title1',
      remark: 'remark1',
      deadline: dayjs('2023-10-22').format('YYYY-MM-DD HH:mm:ss'),
      tags: ['tag1', 'tag2'],
      children: [
        {
          id: 11,
          title: 'title1-1',
          remark: 'remark1-1',
          deadline: dayjs('2023-11-06').format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          id: 12,
          title: 'title1-2',
          remark: 'remark1-2',
          deadline: dayjs('2023-11-08').format('YYYY-MM-DD HH:mm:ss'),
        },
      ],
    },
    {
      id: 2,
      date: dayjs('2023-10-28').format('YYYY-MM-DD'),
      title: 'title2',
      remark: 'remark2',
      deadline: dayjs('2023-10-22').format('YYYY-MM-DD HH:mm:ss'),
      tags: ['tag1', 'tag2'],
    },
  ]

  const onCloseTag = (id: number, tag: string) => {

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
          <h2 className='list-box__header'>TODO</h2>
          {todoList.map((todo, i) => (
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
                      style={{ marginRight: idx === todoList.length - 1 ? 0 : 4}}
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
    </div>
  )
}

export default TodoDay