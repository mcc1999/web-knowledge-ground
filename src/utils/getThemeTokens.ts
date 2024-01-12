import { PaletteMode, ThemeOptions } from "@mui/material";
import { blue, green, purple } from "@mui/material/colors";

const commonPalette = {
  // purple: {
  //   light: purple[100],
  //   main: purple[600],
  //   contrastText: "#fff",
  // },
  orange: { main: "#ed6c02" },
  green: { main: green[600], contrastText: "#fff" },
};
export const getThemeTokens: (mode: PaletteMode) => ThemeOptions = (
  mode: PaletteMode
) => {
  return mode === "dark" ? darkTheme : lightTheme;
};
const lightTheme = {
  palette: {
    mode: "light",
    primary: { main: "#8B5FBF" },
    secondary: { main: blue[600] },
    purple: { light: "#D6C6E1", main: "#8B5FBF" },
    text: { primary: "#000000" },
    background: { default: "#f5f3f7", paper: "#f5f3f7" },
    cardBg: { main: "#E9E4ED" },
    actionBg: { main: "#8B5FBF" },
    itemBg: { main: "#f5f3f7" },
    ...commonPalette,
  },
} as const;
const darkTheme = {
  palette: {
    mode: "dark",
    primary: { main: "#6c35de" },
    background: { default: "#241b35", paper: "#241b35" },
    purple: { light: "#cb80ff", main: "#6c35de" },
    text: { primary: "#ffffff" },
    cardBg: { main: "#4d425f" },
    actionBg: { main: "#6c35de" },
    itemBg: { main: "#241b35" },
    ...commonPalette,
  },
} as const;

declare module "@mui/material/styles" {
  interface Palette {
    purple: Palette["primary"];
    green: Palette["primary"];
    cardBg?: Palette["primary"];
    actionBg?: Palette["primary"];
    itemBg?: Palette["primary"];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    purple?: PaletteOptions["primary"];
    green?: PaletteOptions["primary"];
    cardBg?: PaletteOptions["primary"];
    actionBg?: PaletteOptions["primary"];
    itemBg?: PaletteOptions["primary"];
  }
}
