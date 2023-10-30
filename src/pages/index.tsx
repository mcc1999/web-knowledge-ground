import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import ThemeSwitch from 'src/components/ThemeSwitch'
import styles from './index.module.scss'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Web playground</title>
        <meta name="description" content="Web playground" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{position: 'absolute', top: 13, right: 24}}>
        <ThemeSwitch />
      </div>
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

          <Link href="/mdx" >
            <a className={styles.card}>
              <h2>框架 &rarr;</h2>
              <p>React、Vue...</p>
            </a>
          </Link>

          <Link href="/todo-list" >
            <a className={styles.card}>
              <h2>TODO LIST &rarr;</h2>
              <p>一个 TODO LIST 工具应用</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home
