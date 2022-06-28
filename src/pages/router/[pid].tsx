import { useRouter } from 'next/router'
import Link from 'next/link'
import { ReactElement } from 'react'
import Layout from '../../components/Layout'

const Post = () => {
  const router = useRouter()
  const { pid } = router.query

  return <>
    <p>pid: {pid}/{JSON.stringify(router.query)}</p>
    <Link href='/router'>Go to Router</Link>
  </>
}

Post.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default Post