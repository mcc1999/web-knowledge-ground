import React, { useEffect } from 'react'
import { Sandpack } from "@codesandbox/sandpack-react";
import { aquaBlue } from "@codesandbox/sandpack-themes";
import files from './CodeFiles/4_css-19'

const ScssTheme = () => {  
  return (
    <Sandpack
      template="react"
      theme={aquaBlue}
      customSetup={{
        entry: '/index.js',
        environment: 'create-react-app',
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          'react-scripts': '^5.0.1',
          'node-sass': '4.14.1',
          'sass': '1.27.0',
          'scss': '0.2.4',
          'sass-loader': '10.0.3',
        }
      }}
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

export default ScssTheme