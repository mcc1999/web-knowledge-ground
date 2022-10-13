import { PaletteMode, ThemeOptions } from "@mui/material";
import { blue, green, purple } from "@mui/material/colors";

const commonPalette = {
  purple: { main: purple[600], contrastText: '#fff' },
  green: { main: green[600], contrastText: '#fff' }
}
export const getThemeTokens: (mode: PaletteMode) => ThemeOptions = (mode: PaletteMode) => {
  return mode === 'dark' ? darkTheme : lightTheme;
};
const lightTheme = {
  palette: {
    mode: 'light',
    primary: { main: purple[600] },
    secondary: { main: blue[600] },
    ...commonPalette
  },
} as const;
const darkTheme = {
  palette: {
    mode: 'dark',
    ...commonPalette
  },
} as const;

declare module '@mui/material/styles' {
  interface Palette {
    purple: Palette['primary'];
    green: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    purple?: PaletteOptions['primary'];
    green?: PaletteOptions['primary'];
  }
}