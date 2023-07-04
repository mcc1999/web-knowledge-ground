
import React, { useEffect } from 'react';
import { SiderDataType } from '@/store/framework';
import useWebPlaygroundStore from '@/store';
import { useMDXComponent } from 'next-contentlayer/hooks';
import CodeBlock from '@/components/mdxComponents/Codeblock';
import CustomSandpack from '@/components/mdxComponents/CustomSandpack';

export interface LayoutProps {
  siderData: SiderDataType[];
  MDXComponentCode: string;
}

const MDXcomponents = {
  // Pass Custom Components here (for use in markdown files)
  code: CodeBlock,
  CustomSandpack
};

const FrameworkLayout = (props: LayoutProps) => {
  const { siderData, MDXComponentCode } = props
  const updateSiderData = useWebPlaygroundStore(state => state.updateSiderData)
  const MDXContent = useMDXComponent(MDXComponentCode)

  useEffect(() => {
    updateSiderData(siderData);
  }, [])

  return <MDXContent components={MDXcomponents} />
}

export default FrameworkLayout;

FrameworkLayout.layoutType = 'framework';