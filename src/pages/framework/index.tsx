import Link from 'next/link'
import React, { useEffect } from 'react'
import { GetStaticProps } from 'next';
import { getFrameworkSiderData } from '../../utils/framework/sidebarData';
import useWebPlaygroundStore from '../../store';
import matter from 'gray-matter';
import { SiderDataType } from '../../store/framework';


function formatSiderData(siderData: { filename: string; fileContent: string }[]) {
  const formattedSiderData = siderData.map((item) => {
    const { data: frontmatter } = matter(item.fileContent);
    if (frontmatter.title) {
      return {
        id: Math.random(),
        title: frontmatter.title,
        linkTo: item.filename
      }
    }
  })
  return formattedSiderData;
}
const Framework = (prop: { siderData: { filename: string; fileContent: string }[] }) => {
  const { siderData } = prop
  const updateSiderData = useWebPlaygroundStore(state => state.updateSiderData)

  useEffect(() => {
    (function () {
      const formattedSiderData: SiderDataType[] = formatSiderData(siderData).filter(i => i !== undefined) as SiderDataType[];
      console.log('siderData', siderData, formattedSiderData);
      updateSiderData(formattedSiderData);
    })();
  }, [])

  return <>
    <h1>Framework</h1>
    <Link href={'/framework/React/react-hooks'}>react-hooks</Link>
    <br />
    <Link href={'/framework/Vue/vue'}>vue</Link>
  </>
}

export default Framework

Framework.layoutType = 'framework'


export const getStaticProps: GetStaticProps = async () => {
  const siderData = await getFrameworkSiderData();
  return {
    props: { siderData }, // will be passed to the page component as props
  }
}