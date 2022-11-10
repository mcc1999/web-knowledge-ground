import React from 'react'
import { Sandpack } from "@codesandbox/sandpack-react";
import { useTheme } from '@mui/material/styles';
import { cobalt2, githubLight } from "@codesandbox/sandpack-themes";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProviderProps
} from "@codesandbox/sandpack-react";
import styles from './index.module.scss'

interface CustomSandpackProps extends SandpackProviderProps {
  onlyCode: boolean
}
const CustomSandpack: React.FC<CustomSandpackProps> = (props) => {
  const { onlyCode } = props
  const { palette: { mode } } = useTheme();
  return (
    <SandpackProvider className={styles.CustomSandpackStyle} template="react" theme={mode === 'dark' ? cobalt2 : githubLight} {...props}>
      <SandpackLayout style={onlyCode ? { width: '50%' } : {}}>
        <SandpackCodeEditor />
        {!onlyCode && <SandpackPreview />}
      </SandpackLayout>
    </SandpackProvider>
  )
}

export default CustomSandpack