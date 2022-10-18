import React from 'react'
import { Sandpack } from "@codesandbox/sandpack-react";
import { useTheme } from '@mui/material/styles';
import { cobalt2, githubLight } from "@codesandbox/sandpack-themes";

const CustomSandpack: React.FC = (props) => {
  const { palette: { mode } } = useTheme();
  return <Sandpack template="react" theme={mode === 'dark' ? cobalt2 : githubLight} {...props} />
}

export default CustomSandpack