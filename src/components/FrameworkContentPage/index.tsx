
import React, { useState } from 'react';
import { useAsyncEffect } from 'ahooks';
import { getContentBySlug } from '../../utils/framework/framework';


export interface LayoutProps {
  slug: string[];
  frontmatter: Record<string, any>;
}

const FrameworkLayout = (props: LayoutProps) => {
  const { slug, frontmatter } = props
  const [element, setElement] = useState<React.ReactNode>()

  useAsyncEffect(async () => {
    const { default: Component } = await getContentBySlug(slug)
    setElement(<Component />)
  }, [slug])

  return <>{element}</>
}

export default FrameworkLayout;

FrameworkLayout.layoutType = 'framework';