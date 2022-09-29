import Link from 'next/link'
import React, { useEffect } from 'react'
import { GetStaticProps } from 'next';
import { getFrameworkSiderData } from '../../utils/framework/sidebarData';
import useWebPlaygroundStore from '../../store';
import { SiderDataType } from '../../store/framework';

const Framework = (prop: { siderData: SiderDataType[] }) => {
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

export default Framework

Framework.layoutType = 'framework'


export const getStaticProps: GetStaticProps = async () => {
  const siderData = await getFrameworkSiderData();
  return {
    props: { siderData }, // will be passed to the page component as props
  }
}