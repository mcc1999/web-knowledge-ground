import React from 'react'
import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import ThemeSwitch from '../ThemeSwitch';

import styles from './index.module.scss'

export interface IBreadcrumbsThemeHeader {
  breadcrumbs: {
    name: string;
    path: string;
    icon?: React.ReactNode;
  }[]
}

const BreadcrumbsThemeHeader:React.FC<IBreadcrumbsThemeHeader> = (props) => {
  const { breadcrumbs } = props

  return (
    <div className={styles['breadcrumbs-theme-header']}>
      <div className='todo-list-breadcrumbs'>
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.slice(0, -1).map(({name, path, icon}, i) => (
            <MuiLink 
              key={i} 
              underline="hover" 
              color="inherit" 
              sx={{ display: 'flex', alignItems: 'center' }} 
              href={path}
            >
              {!!icon && icon}{name}
            </MuiLink>
          ))}
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            {!!breadcrumbs.length && breadcrumbs[breadcrumbs.length - 1].icon}{breadcrumbs[breadcrumbs.length - 1]?.name}
          </Typography>
        </Breadcrumbs>
      </div>
      <div className='theme-switch'><ThemeSwitch /></div>
    </div>
  )
}

export default BreadcrumbsThemeHeader