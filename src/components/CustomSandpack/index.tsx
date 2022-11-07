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

interface CustomSandpackProps extends SandpackProviderProps {
  onlyCode: boolean
}
const CustomSandpack: React.FC<CustomSandpackProps> = (props) => {
  const { onlyCode } = props
  const { palette: { mode } } = useTheme();
  return (
    <SandpackProvider template="react" theme={mode === 'dark' ? cobalt2 : githubLight} {...props}>
      <SandpackLayout>
        <SandpackCodeEditor />
        {!onlyCode && <SandpackPreview />}
      </SandpackLayout>
    </SandpackProvider>
  )
}

export default CustomSandpack