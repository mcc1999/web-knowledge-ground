import Link from 'next/link'
import React, { useEffect } from 'react'
import { GetStaticProps } from 'next';
import useWebPlaygroundStore from '../../store';
import { SiderDataType } from '../../store/framework';
import { allFrameworks } from 'contentlayer/generated'

const FrameworkIndex = (prop: { siderData: SiderDataType[] }) => {
  const { siderData } = prop
  const updateSiderData = useWebPlaygroundStore(state => state.updateSiderData)

  useEffect(() => {
    updateSiderData(siderData);
  }, [])

  return <>
    <h1>Framework</h1>
    <Link href={'/framework/React/react-hooks'}>react-hooks</Link>
    <br />
    <Link href={'/framework/Vue/vue'}>vue</Link>
  </>
}

export default FrameworkIndex

FrameworkIndex.layoutType = 'framework'


export const getStaticProps: GetStaticProps = async () => {
  const siderData = allFrameworks.sort((a, b) => Date.parse(a.date!) - Date.parse(b.date!)).map(item => ({ id: item._id, title: item.title, linkTo: item.url.slice(3,) }));

  return { props: { siderData } };
}