import { useRouter } from 'next/router'

const Post = () => {
  const router = useRouter()

  return <>
    <p>Router/route</p>
    <h1>Do i have color?</h1>
  </>
}

export default Post