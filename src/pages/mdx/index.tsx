import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { GetStaticProps } from 'next';
import useWebPlaygroundStore from '@/store';
import { SiderDataTreeItem, SiderDataType } from '@/store/framework';
import { allFrameworks } from 'contentlayer/generated'
import { buildSiderDataTree } from '@/utils';

const FrameworkIndex = (prop: { siderData: SiderDataType[] }) => {
  const { siderData } = prop
  const updateSiderData = useWebPlaygroundStore(state => state.updateSiderData)
  const [siderTree, setSiderTree] = useState<SiderDataTreeItem[]>([])
  console.log('siderData', siderData)  
  
  useEffect(() => {
    updateSiderData(siderData);
  }, [])

  useEffect(() => {
    setSiderTree(buildSiderDataTree(siderData))
  }, [siderData])

  return <>
    {
      siderTree.map(branch => {
        return <>
          <h1>{branch.folder}</h1>
          {branch.children.map(child => <><Link href={child.linkTo} key={child.id}>{child.title}</Link><br/></>)}
        </>
      })
    }
  </>
}

export default FrameworkIndex

FrameworkIndex.layoutType = 'framework'


export const getStaticProps: GetStaticProps = async () => {
  const siderData = allFrameworks.map(item => ({ id: item._id, title: item.title, linkTo: item.url.slice(3,) }));

  return { props: { siderData } };
}