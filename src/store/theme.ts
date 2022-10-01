import create, { StateCreator } from 'zustand'
import {DarkMode} from "use-dark-mode"

export enum ThemeType {
  Dark = 'dark',
  Light = 'light'
}
export interface ThemeSlice {
  theme: ThemeType;
  darkmode: DarkMode,
  updateTheme: (theme: ThemeType) => void;
  updateDarkmode: (darkmode: DarkMode) => void;
}
const createThemeSlice: StateCreator<
  ThemeSlice,
  [],
  [],
  ThemeSlice
> = (set) => ({
  theme: ThemeType.Light,
  darkmode: undefined as unknown as DarkMode,
  updateTheme: (theme) => set(() => ({ theme })),
  updateDarkmode: (darkmode) => set(() => ({darkmode}))
})

export default createThemeSlice;