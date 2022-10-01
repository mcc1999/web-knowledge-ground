import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from './index.module.scss'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Web playground</title>
        <meta name="description" content="Web playground" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a>Web Knowledge</a> Playground
        </h1>

        <div className={styles.grid}>
          <Link href="/router">
            <a className={styles.card}>
              <h2>Route Learning &rarr;</h2>
              <p>file-folder route、Dynamic Route ( index routes, catch all routes ).</p>
            </a>
          </Link>

          <Link href="/highlighting">
            <a className={styles.card}>
              <h2>Code Highlight  &rarr;</h2>
              <p>Highlight code in the mdx Docs with nightOwlLight themes</p>
            </a>
          </Link>

          <Link href="/code-preview">
            <a className={styles.card}>
              <h2>MDX Code Preview &rarr;</h2>
              <p>Preview code in the MDX docs</p>
            </a>
          </Link>

          <Link href="/framework" >
            <a className={styles.card}>
              <h2>框架 &rarr;</h2>
              <p>React、Vue...</p>
            </a>
          </Link>

          <Link href="/404" >
            <a className={styles.card}>
              <h2>404 Page &rarr;</h2>
              <p>Page Not Found......</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
