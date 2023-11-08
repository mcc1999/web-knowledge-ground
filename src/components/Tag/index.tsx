import React from 'react'
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import CloseIcon from '@mui/icons-material/Close';

import styles from './index.module.scss'

interface TagsProps {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
  closable?: boolean;
  onClose?: (e: React.MouseEvent) => void;
}
const Tag: React.FC<TagsProps> = ({ color, children, style, closable, onClose }) => {
  return (
    <span 
      className={styles.tagItem} 
      data-color={color?.includes('#') ? '' : color} 
      style={color?.includes('#') ? { background: color, color: '#fff', ...style } : { ...style}}
    >
      {color === 'success' && <CheckCircleOutlineIcon style={{ fontSize: '1rem' }} />}
      {color === 'processing' && <RestartAltIcon style={{ fontSize: '1rem' }} />}
      {color === 'error' && <HighlightOffIcon style={{ fontSize: '1rem' }} />}
      {color === 'warning' && <ReportGmailerrorredIcon style={{ fontSize: '1rem' }} />}
      {children}
      {closable && 
        <CloseIcon 
          style={{ color: color?.includes('#') ? '#fff' : 'rgba(0, 0, 0, 0.45)' }} 
          sx={{ display: 'flex', alignItems: 'center' }} 
          className='tag-close-icon'
          onClick={onClose}
        />
      }
    </span>
  )
}

export default Tag
