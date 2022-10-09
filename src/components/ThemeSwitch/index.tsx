import { useTheme as useNextTheme } from 'next-themes'
import { Switch, useTheme } from '@nextui-org/react'
import { SunIcon } from './SunIcon';
import { MoonIcon } from './MoonIcon';

const ThemeSwitch = () => {
  const { setTheme } = useNextTheme();
  const { isDark } = useTheme();

  return (
    <Switch
      iconOn={<SunIcon filled size={undefined} height={undefined} width={undefined} label={undefined} />}
      iconOff={<MoonIcon filled size={undefined} height={undefined} width={undefined} label={undefined} />}
      checked={isDark}
      onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
    />
  )
}

export default ThemeSwitch;