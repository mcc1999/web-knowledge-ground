/* eslint react/jsx-key: 0 */

import React, { useEffect, useState } from 'react'
import styles from './index.module.scss';
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import defaultTheme from 'prism-react-renderer/themes/vsLight'
import darkTheme from 'prism-react-renderer/themes/vsDark'
import { useTheme } from '@mui/material/styles';
import SimpleBar from 'simplebar-react';

interface CodeBlockProps {
  children: string,
  className: string,
}

const CodeBlock: React.FC<CodeBlockProps> = (props) => {
  const { children, className } = props;
  const language = className?.replace(/language-/, '') as Language;
  const [copied, setCopied] = useState(false);
  const { palette: { mode } } = useTheme()
  console.log('props', props, mode)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  const HighlightCode = (
    <Highlight {...defaultProps} code={children.trim()} language={language} theme={mode === 'dark' ? darkTheme : defaultTheme}>
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

  if (!language) return <code>{children}</code>;

  return (
    <div className={styles.codeBlock}>
      <div className='codeHeader'>
        <div className='headerIcon'>
          <div className='redIcon iconItem' />
          <div className='yellowIcon iconItem' />
          <div className='greenIcon iconItem' />
        </div>
        <div>复制代码</div>
      </div>
      <div className='codeBody'>
        <SimpleBar style={{maxHeight: 360}} autoHide>
          {HighlightCode}
        </SimpleBar>
      </div>
    </div>
  )
}
export default CodeBlock;