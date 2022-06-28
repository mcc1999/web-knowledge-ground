/* eslint react/jsx-key: 0 */

import React, { useEffect, useState } from 'react'
import style from './index.module.scss';
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import defaultTheme from 'prism-react-renderer/themes/nightOwlLight'
import lzString from 'lz-string';
import { scope } from './react-live-scope';
import LazyLoad from 'react-lazyload';
import LiveProvider from '../LiveProvider';
import LivePreview from '../LivePreview';
import { copyToClipboard } from '../../../utils/clipboard'

interface CodeBlockProps {
  children: string,
  className: string,
  live?: boolean,
  height?: number,
  onlyPreview?: boolean,
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, onlyPreview, height }) => {
  const language = className?.replace(/language-/, '') as Language;
  const [code, setCode] = useState(children || '')
  const [codeVisible, setCodeVisible] = useState(false);
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  const HighlightCode = (
    <Highlight {...defaultProps} code={children.trim()} language={language} theme={defaultTheme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: '20px' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )

  function fullscreen() {
    // TODO: scope 怎么传入？
    // prettier-ignore
    window.open(`/preview?code=${lzString.compressToEncodedURIComponent(code)}&language=${language}`, '_blank')
  }
  if (!language) return <code>{children}</code>;


  const previewCodeStyle = () => {
    if (codeVisible) {
      return {
        height,
      }
    }
  }
  if (onlyPreview) {
    return (
      <>
        <div className={style.codeBlock} style={height ? { height } : { maxHeight: 1080 }}>
          <LiveProvider language={language} defaultCode={children} scope={scope} onCodeChange={setCode}>
            {onlyPreview && (
              // 懒加载，窗口滚动到这里后才真正渲染 children
              <LazyLoad className={style.previewWrap}>
                <div className={style.previewHeader}>
                  <div className={style.previewActions}>
                    <span onClick={fullscreen} >分享</span>
                    <span onClick={() => setCodeVisible((v) => !v)}>{codeVisible ? "折叠代码" : "查看代码"}</span>
                  </div>
                </div>
                <div className={style.previewBody}>
                  {/* // @ts-ignore */}
                  <LivePreview className={style.preview} language={language} />
                </div>
              </LazyLoad>
            )}
          </LiveProvider>
          <div className={style.editorWrap} style={codeVisible ? {} : { display: "none" }}>
            <div className={style.editorHeader}>
              <span className={style.language}>{language}</span>
              <div className={style.editorActions}>
                {!copied ?
                  <span
                    onClick={async () => {
                      await copyToClipboard(code)
                      setCopied(true)
                    }}
                  >
                    复制
                  </span>
                  :
                  '✅'
                }
              </div>
            </div>
            <div className={style.eidtorBody}>
              <div className={style.previewCode}>
                {HighlightCode}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  return HighlightCode;
}
export default CodeBlock;