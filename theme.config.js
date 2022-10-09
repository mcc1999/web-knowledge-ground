import { createStitches } from "@stitches/react";

export const { createTheme, theme, css, styled, globalCss, getCssText } = createStitches({
  theme: {
    colors: {
      background: "white",
      foreground: "black"
    }
  }
});

export const darkTheme = createTheme({
  colors: {
    background: "rgb(30,30,30)",
    foreground: "#f5f5f5"
  }
});

const globalStyles = globalCss({
  html: {
    boxSizing: "border-box"
  },

  "*": { boxSizing: "inherit" },
  "*::before": { boxSizing: "inherit" },
  "*::after": { boxSizing: "inherit" },

  body: {
    background: "$background",
    color: "$foreground",
    borderColor: "$foreground",
    margin: 0
  }
});

globalStyles();
