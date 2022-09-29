
import React, { useEffect, useState } from 'react';
import { useAsyncEffect } from 'ahooks';
import { getContentBySlug } from '../../utils/framework/framework';
import { SiderDataType } from '../../store/framework';
import useWebPlaygroundStore from '../../store';


export interface LayoutProps {
  slug: string[];
  siderData: SiderDataType[];
}

const FrameworkLayout = (props: LayoutProps) => {
  const { slug, siderData } = props
  const [element, setElement] = useState<React.ReactNode>()
  const updateSiderData = useWebPlaygroundStore(state => state.updateSiderData)

  useEffect(() => {
    updateSiderData(siderData);
  }, [])

  useAsyncEffect(async () => {
    const { default: Component } = await getContentBySlug(slug)
    setElement(<Component />)
  }, [slug])

  return <>{element}</>
}

export default FrameworkLayout;

FrameworkLayout.layoutType = 'framework';