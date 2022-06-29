import React, { useContext } from 'react'
import HtmlPreview from './components/HtmlPreview'
import ReactPreview from './components/ReactPreview'
import { LiveContext } from '../LiveProvider'

//  注意，该组件只支持 html 与 jsx，tsx 不受支持
const LivePreview: React.FC<{
  language: string,
  className?: string;
}> = (props) => {
  const { language } = useContext(LiveContext)

  const Preview = {
    html: HtmlPreview,
    jsx: ReactPreview,
  }[language as string]

  return Preview ? <Preview {...props} /> : null
}

export default LivePreview
