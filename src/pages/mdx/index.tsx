import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { GetStaticProps } from 'next';
import useWebPlaygroundStore from '@/store';
import { SiderDataTreeItem, SiderDataType } from '@/store/mdx';
import { allFrameworks } from 'contentlayer/generated'
import { buildSiderDataTree } from '@/utils';

const MDXIndex = (prop: { siderData: SiderDataType[] }) => {
  const { siderData } = prop
  const updateSiderData = useWebPlaygroundStore(state => state.updateSiderData)
  const [siderTree, setSiderTree] = useState<SiderDataTreeItem[]>([])
  
  useEffect(() => {
    updateSiderData(siderData);
  }, [])

  useEffect(() => {
    setSiderTree(buildSiderDataTree(siderData))
  }, [siderData])

  return <>
    {
      siderTree.map(branch => {
        return <div key={branch.folder}>
          <h1>{branch.folder}</h1>
          {branch.children.map(child => <div key={child.id}><Link href={child.linkTo}>{child.title}</Link><br/></div>)}
        </div>
      })
    }
  </>
}

export default MDXIndex

MDXIndex.layoutType = 'mdx'


export const getStaticProps: GetStaticProps = async () => {
  const siderData = allFrameworks.map(item => ({ id: item._id, title: item.title, linkTo: item.url.slice(3,) }));

  return { props: { siderData } };
}