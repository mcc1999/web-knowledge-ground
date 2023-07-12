import { useTheme } from '@mui/material/styles';
import { withStyles, createStyles } from '@mui/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useContext } from 'react';
import { ColorModeContext } from 'src/pages/_app';
import { Switch } from '@mui/material';

const PurpleSwitch = withStyles({
  switchBase: {
    "&$checked": {
      color: "#8e24aa !important"
    },
    "&$checked + $track": {
      backgroundColor: "#8e24aa !important"
    }
  },
  checked: {},
  track: {backgroundColor: "#8e24aa"}
})(Switch)

const ThemeSwitch = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <PurpleSwitch
      icon={<LightModeIcon color='warning' fontSize='small' />}
      checkedIcon={<DarkModeIcon color='info' fontSize='small' style={{color: '#8e24aa'}} />}
      checked={theme.palette.mode === 'dark'}
      onChange={() => {
        colorMode.toggleColorMode();
        localStorage.setItem('theme', theme.palette.mode === 'dark' ? 'light' : 'dark')
      }}
    />
  )
}

export default ThemeSwitch;