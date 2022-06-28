import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import '../../styles/globals.css'
import { ReactElement, ReactNode } from 'react'
import { MDXProvider } from '@mdx-js/react'
// import CodeBlock from '../components/Codeblock'
import dynamic from 'next/dynamic'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

const CodeBlockWithNoSSR = dynamic(() => import('../components/Codeblock'), { ssr: false })

const components = {
  code: CodeBlockWithNoSSR,
  h1: props => <h1 style={{ color: 'blue' }} {...props} />,
  p: props => <p {...props} style={{ color: 'red' }} />,
} as import("mdx/types").MDXComponents;

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {

  const getLayout =
    Component.getLayout ?? ((page: React.ReactElement) => (
      <MDXProvider components={components} >
        {page}
      </MDXProvider >
    ))
  return getLayout(<Component {...pageProps} />)
}
