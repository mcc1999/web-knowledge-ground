import { useRouter } from 'next/router'
import Link from 'next/link'

const Post = () => {
  const router = useRouter()
  const { slug } = router.query

  return <>
    <p>slug: {slug}/{JSON.stringify(router.query)}</p>
    <Link href='/router'>Go to Router</Link>
  </>
}

export default Post