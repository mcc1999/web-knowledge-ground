import React, { useState } from 'react'
import { getDayOfWeek, getLastDayOfMonth } from '@/utils/todoList'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import Link from 'next/link';
import BreadcrumbsThemeHeader from '@/components/BreadcrumbsThemeHeader';
import HomeIcon from '@mui/icons-material/Home';
import GrainIcon from '@mui/icons-material/Grain';

import styles from './index.module.scss'

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
]

const TodoList:React.FC = () => {
  const [month, setMonth] = useState<Dayjs>(() => dayjs())
  const monthFirstWeekday = getDayOfWeek(month.format('YYYY-MM'))
  const lastDayOfMonth = getLastDayOfMonth(month.format('YYYY-MM-DD'))

  return (
    <div className={styles['todo-list-container']}>
      <BreadcrumbsThemeHeader breadcrumbs={breadcrumbs} />
      <div className='calender'>
        <div className='calender-wrap'>
          <div className='calender-header'>
            <h1 className='calender-header__title'>
              {month.format('YYYY-MM')}
            </h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={['year', 'month']}
                label="Year and Month"
                value={dayjs(month)}
                onChange={(newValue) => {
                  newValue && setMonth(newValue);
                }}
                slotProps={{ textField: { size: 'small' } }}
              />
            </LocalizationProvider>
          </div>
          <div className='calender-dates'>
            <div className='dates-header'>
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className='dates-body'>
              {new Array(42).fill(0).map((_, i) => {
                let content;
                if (i >= monthFirstWeekday && (i - monthFirstWeekday + 1) <= lastDayOfMonth) {
                  content = i - monthFirstWeekday + 1
                }
                return (
                  <Link key={i.toString() + content} href={`/todo-list/${month.format('YYYY-MM')}`}>
                    <div className='date-item'>{content}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodoList