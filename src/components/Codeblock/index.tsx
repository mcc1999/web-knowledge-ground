/* eslint react/jsx-key: 0 */

import React, { useEffect, useState } from 'react'
import style from './index.module.scss';
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import defaultTheme from 'prism-react-renderer/themes/vsLight'
import darkTheme from 'prism-react-renderer/themes/vsDark'
import lzString from 'lz-string';
import { scope } from './react-live-scope';
import LazyLoad from 'react-lazyload';
import LiveProvider from '../LiveProvider';
import LivePreview from '../LivePreview';
import { copyToClipboard } from '../../utils/clipboard'
import { useTheme } from '@nextui-org/react'

interface CodeBlockProps {
  children: string,
  className: string,
  live?: boolean,
  height?: number,
  onlyPreview?: boolean,
}

const CodeBlock: React.FC<CodeBlockProps> = (props) => {
  const { children, className, onlyPreview, height } = props;
  const language = className?.replace(/language-/, '') as Language;
  const [code, setCode] = useState(children || '');
  const [codeVisible, setCodeVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme()

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  const HighlightCode = (
    <Highlight {...defaultProps} code={children.trim()} language={language} theme={isDark ? darkTheme : defaultTheme}>
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

  if (onlyPreview) {
    return (
      <>
        <div className={style.codeBlock} style={height ? { height } : {}}>
          <LiveProvider language={language} defaultCode={children} scope={scope} onCodeChange={setCode}>
            {onlyPreview && (
              // 懒加载，窗口滚动到这里后才真正渲染 children
              <LazyLoad className={style.previewWrap} placeholder='I am Placeholder' offset={200} style={isDark ? { background: 'rgb(30, 30, 30)' } : {}}>
                <div className={style.previewHeader} style={isDark ? { background: 'rgb(30, 30, 30)', color: '#ecedee' } : {}}>
                  <div className={style.previewActions}>
                    {/* <span onClick={fullscreen} >分享</span> */}
                    <span onClick={() => setCodeVisible((v) => !v)}>{codeVisible ? "折叠代码" : "查看代码"}</span>
                  </div>
                </div>
                <div className={style.previewBody} style={isDark ? { background: 'rgb(30, 30, 30)', color: '#ecedee' } : {}}>
                  {/* // @ts-ignore */}
                  <LivePreview className={style.preview} language={language} />
                </div>
              </LazyLoad>
            )}
          </LiveProvider>
          <div className={style.editorWrap} style={codeVisible ? {} : { display: "none" }}>
            <div className={style.editorHeader} style={isDark ? { backgroundColor: 'rgb(30, 30, 30)', color: '#ecedee' } : {}}>
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
            <div className={style.editorBody} style={isDark ? { backgroundColor: 'rgb(30, 30, 30)', color: '#ecedee' } : {}}>
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