import { useTheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useContext } from "react";
import { ColorModeContext } from "src/pages/_app";
import { Switch } from "@mui/material";

const ThemeSwitch = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Switch
      icon={<LightModeIcon color="warning" fontSize="small" />}
      checkedIcon={
        <DarkModeIcon
          color="info"
          fontSize="small"
          sx={{ color: "purple.main" }}
        />
      }
      checked={theme.palette.mode === "dark"}
      onChange={() => {
        colorMode.toggleColorMode();
        localStorage.setItem(
          "theme",
          theme.palette.mode === "dark" ? "light" : "dark"
        );
      }}
    />
  );
};

export default ThemeSwitch;
