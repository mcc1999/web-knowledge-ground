import { useTheme } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useContext } from 'react';
import { ColorModeContext } from 'src/pages/_app';
import Switch from '@mui/material/Switch';

const ThemeSwitch = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Switch
      icon={<LightModeIcon color='primary' fontSize='small' />}
      checkedIcon={<DarkModeIcon fontSize='small' />}
      checked={theme.palette.mode === 'dark'}
      onChange={() => {
        colorMode.toggleColorMode();
        localStorage.setItem('theme', theme.palette.mode === 'dark' ? 'light' : 'dark')
      }}
    />
  )
}

export default ThemeSwitch;