import type { AppProps } from "next/app";
import type { NextPage } from "next";
import {
  createContext,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MDXProvider } from "@mdx-js/react";
import dynamic from "next/dynamic";
import MDXLayout from "@/layout/mdx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMediaQuery } from "@mui/material";
import { getThemeTokens } from "@/utils/getThemeTokens";
import "../styles/globals.scss";
import "../styles/markdown.scss";
import NavBar from "@/layout/navBar";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  layoutType?: string;
};

const CodeBlockWithNoSSR = dynamic(
  () => import("@/components/mdxComponents/Codeblock"),
  { ssr: false }
);

const components = {
  code: CodeBlockWithNoSSR,
} as import("mdx/types").MDXComponents;

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );

  useEffect(() => {
    const themeModeFromLocal = localStorage.getItem("theme") as
      | "light"
      | "dark";
    if (!!themeModeFromLocal) {
      setMode(themeModeFromLocal);
    }
    setMounted(true);
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  const theme = useMemo(() => createTheme(getThemeTokens(mode)), [mode]);

  const getLayout =
    Component.getLayout ??
    ((page: React.ReactElement) => {
      switch (Component.layoutType) {
        case "mdx":
          return (
            <MDXLayout>
              <MDXProvider components={components}>{page}</MDXProvider>
            </MDXLayout>
          );
        default:
          return <MDXProvider components={components}>{page}</MDXProvider>;
      }
    });

  if (!mounted) {
    return null;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
        <div style={{ height: "calc(100vh - 64px)", overflow: 'auto' }}>
          {getLayout(<Component {...pageProps} />)}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
