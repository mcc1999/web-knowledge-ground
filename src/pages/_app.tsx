import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import '../styles/globals.scss'
import { ReactElement, ReactNode } from 'react'
import { MDXProvider } from '@mdx-js/react'
import dynamic from 'next/dynamic'
import FrameworkLayout from '../components/Layout/framework'
import { ThemeProvider } from 'next-themes'
import { darkTheme } from "../../theme.config";

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
  return <ThemeProvider
    attribute="class"
    enableSystem={false}
    value={{
      light: "light",
      dark: darkTheme
    }}
  >
    {getLayout(<Component {...pageProps} />)}
  </ThemeProvider>
}
