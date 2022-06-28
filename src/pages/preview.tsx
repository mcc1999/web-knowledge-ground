import React, { useEffect, useState } from 'react'
import LiveProvider from '../components/LiveProvider'
import LivePreview from '../components/LivePreview'
import { useRouter } from 'next/router'
import { Language } from 'prism-react-renderer'
import { scope } from '../components/Codeblock/react-live-scope'
import lzString from 'lz-string'

const Preview: NextPageWithLayout = () => {
  const router = useRouter()
  const { code = '', language } = router.query
  const [codeValue, setCodeValue] = useState('')

  useEffect(() => {
    setCodeValue(lzString.decompressFromEncodedURIComponent(code as string) || '')
  }, [code])

  return (
    <div style={{ width: '100vw', height: '100vh', padding: 10 }}>
      <LiveProvider
        language={language as Language}
        code={codeValue}
        // TODO: 跳转后怎么传入 scope？下边这么做会失去动态传入 scope 的能力
        scope={scope}
      >
        <LivePreview language={language as string} />
      </LiveProvider>
    </div>
  )
}

// https://nextjs.org/docs/basic-features/layouts
Preview.getLayout = function getLayout(page: React.ReactElement) {
  return page
}

export default Preview
