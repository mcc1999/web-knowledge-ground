import React from 'react'
import transform from './transform'
import evalCode from './eval-code'

export const generateElement = ({ code = '', scope = {} }) => {
  // NOTE: Remove trailing semicolon to get an actual expression.
  const codeTrimmed = code.trim().replace(/;$/, '')
  // NOTE: Workaround for classes and arrow functions.
  // Transforms JSX syntax to React.createElement
  // e.g. <div a={b} /> becomes React.createElement('div', {a: b})
  const transformed = transform(`return (${codeTrimmed})`).trim()

  // TODO: errorBoundary
  return evalCode(transformed, { React, ...scope })
}
