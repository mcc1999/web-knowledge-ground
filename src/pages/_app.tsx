import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import '../styles/globals.scss'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { MDXProvider } from '@mdx-js/react'
import dynamic from 'next/dynamic'
import FrameworkLayout from '../components/Layout/framework'
import { ThemeProvider } from "styled-components"
import { lightTheme, darkTheme, GlobalStyles } from "../../themeConfig"
import useDarkMode from "use-dark-mode"
import useWebPlaygroundStore from 'src/store'
import { ThemeType } from 'src/store/theme'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
  layoutType?: string;
}

const CodeBlockWithNoSSR = dynamic(() => import('../components/Codeblock'), { ssr: false })

const components = {
  code: CodeBlockWithNoSSR,
} as import("mdx/types").MDXComponents;

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [isMounted, setIsMounted] = useState(false)
  const [theme, updateDarkmode, updateTheme] = useWebPlaygroundStore(state => [state.theme, state.updateDarkmode, state.updateTheme])
  const darkmode = useDarkMode(theme === 'dark')
  updateDarkmode(darkmode);

  useEffect(() => {
    setIsMounted(true);
    const themeInLocalStorage = localStorage.getItem('theme')
    updateTheme(!!themeInLocalStorage && themeInLocalStorage === 'dark' ? ThemeType.Dark : ThemeType.Light)
  }, [])

  const getLayout =
    Component.getLayout ?? ((page: React.ReactElement) => {
      switch (Component.layoutType) {
        case 'framework':
          return (
            <FrameworkLayout>
              <MDXProvider components={components} >
                {page}
              </MDXProvider >
            </FrameworkLayout>
          )
        default:
          return (
            <MDXProvider components={components} >
              {page}
            </MDXProvider >
          )
      }
    })
  return <ThemeProvider theme={darkmode?.value ? darkTheme : lightTheme}>
    <GlobalStyles />
    {isMounted && getLayout(<Component {...pageProps} />)}
  </ThemeProvider>
}
