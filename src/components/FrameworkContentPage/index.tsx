
import React, { useState } from 'react';
import { useAsyncEffect } from 'ahooks';
import { getContentBySlug } from '../../utils/framework';


export interface LayoutProps {
  slug: string[];
}

const FrameworkLayout = (props: LayoutProps) => {
  const { slug } = props
  const [element, setElement] = useState<React.ReactNode>()

  useAsyncEffect(async () => {
    const { default: Component } = await getContentBySlug(slug)
    setElement(<Component />)
  }, [slug])

  return <>{element}</>
}

export default FrameworkLayout;

FrameworkLayout.layoutType = 'framework';