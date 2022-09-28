import Link from 'next/link'
import React from 'react'

const Framework = () => {
  return <>
    <h1>Framework</h1>
    <Link href={'/framework/React/react-hooks'}>react-hooks</Link>
    <br />
    <Link href={'/framework/Vue/vue'}>vue</Link>
  </>
}

export default Framework

Framework.layoutType = 'framework'