import React, { useEffect } from "react";
import { SiderDataType } from "@/store/mdx";
import useWebPlaygroundStore from "@/store";
import { useMDXComponent } from "next-contentlayer/hooks";
import CodeBlock from "@/components/mdxComponents/Codeblock";
import CustomSandpack from "@/components/mdxComponents/CustomSandpack";
import Counter from "@/components/mdxComponents/Counter";
import ScssTheme from "@/components/mdxComponents/SandPacks/4_css-19";
import StaticSandpack from "@/components/mdxComponents/StaticSandpack";
import ChildrenAvoidRerender from "@/components/mdxComponents/SandPacks/5_audition-5";

export interface LayoutProps {
  siderData: SiderDataType[];
  MDXComponentCode: string;
}

const MDXcomponents = {
  // Pass Custom Components here (for use in markdown files)
  code: CodeBlock,
  CustomSandpack,
  Counter,
  ScssTheme,
  StaticSandpack,
  ChildrenAvoidRerender,
};

const MDXCurrentPage = (props: LayoutProps) => {
  const { siderData, MDXComponentCode } = props;
  const updateSiderData = useWebPlaygroundStore(
    (state) => state.updateSiderData
  );
  const MDXContent = useMDXComponent(MDXComponentCode);

  useEffect(() => {
    updateSiderData(siderData);
  }, []);

  return <MDXContent components={MDXcomponents} />;
};

export default MDXCurrentPage;

MDXCurrentPage.layoutType = "mdx";
