import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import useWebPlaygroundStore from "@/store";
import { SiderDataTreeItem, SiderDataType } from "@/store/mdx";
import { allFrameworks } from "contentlayer/generated";
import { buildSiderDataTree } from "@/utils";
import MDXGrid from "@/components/MDXGrid";

const MDXIndex = (prop: { siderData: SiderDataType[] }) => {
  const { siderData } = prop;
  const updateSiderData = useWebPlaygroundStore(
    (state) => state.updateSiderData
  );
  const [siderTree, setSiderTree] = useState<SiderDataTreeItem[]>([]);

  useEffect(() => {
    updateSiderData(siderData);
  }, []);

  useEffect(() => {
    setSiderTree(buildSiderDataTree(siderData));
  }, [siderData]);

  return (
    <>
      {siderTree.map((branch) => (
        <MDXGrid
          key={branch.folder}
          category={branch.folder}
          mdxs={branch.children}
        />
      ))}
    </>
  );
};

export default MDXIndex;

MDXIndex.layoutType = "mdx";

export const getStaticProps: GetStaticProps = async () => {
  const siderData = allFrameworks
    .map((item) => ({
      id: item._id,
      title: item.title,
      linkTo: item.url.slice(3),
      overview: item.body.raw
        .replace(/\#/g, "")
        .replace(/^import.*$/gm, "")
        .slice(0, 100),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return { props: { siderData } };
};
