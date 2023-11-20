import React from 'react'
import { Sandpack } from "@codesandbox/sandpack-react";
import { aquaBlue } from "@codesandbox/sandpack-themes";

export interface IStaticSandpack {
  files: string;
}
const StaticSandpack:React.FC<IStaticSandpack> = ({ files }) => {
  return (
    <Sandpack
      template="static"
      theme={aquaBlue}
      options={{
        showLineNumbers: true, // default - true
        showInlineErrors: true, // default - false
        wrapContent: true, // default - false
        editorHeight: 480, // default - 300
        editorWidthPercentage: 60, // default - 50
      }}
      files={files}
    />
  )
}

export default StaticSandpack