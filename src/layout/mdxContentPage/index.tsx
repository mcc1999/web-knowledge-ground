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
import {
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Tooltip,
} from "@mui/material";

import styles from "./index.module.scss";

export interface LayoutProps {
  siderData: SiderDataType[];
  MDXComponentCode: string;
  toc: TOCItem;
}

interface TOCItem {
  text: string;
  level: number;
  children: TOCItem[];
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
  const { siderData, MDXComponentCode, toc } = props;
  const [updateSiderData, mdxTOCFolded, toggleMdxTOCFolded] =
    useWebPlaygroundStore((state) => [
      state.updateSiderData,
      state.mdxTOCFolded,
      state.toggleMdxTOCFolded,
    ]);
  const MDXContent = useMDXComponent(MDXComponentCode);

  useEffect(() => {
    updateSiderData(siderData);
  }, []);

  function buildTOC(toc: TOCItem[]): JSX.Element[] {
    return toc.map((item) => {
      return (
        <>
          <ListItem
            key={item.text}
            disablePadding
            sx={{ pl: 2 * (item.level - 2) }}
          >
            <Tooltip title={item.text} placement="right">
              <ListItemButton
                component="a"
                href={"#" + item.text.toLowerCase().replaceAll(' ', '-')}
                style={{ color: "inherit", padding: 4 }}
              >
                <div
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    fontSize: item.level <= 2 ? 16 : 14,
                    fontWeight: item.level <= 2 ? "bold" : "normal",
                  }}
                >
                  {item.text}
                </div>
              </ListItemButton>
            </Tooltip>
          </ListItem>
          {!!item.children.length && buildTOC(item.children)}
        </>
      );
    });
  }
  return (
    <div className={styles["mdx-content-page"]}>
      <div className="mdx-content">
        <MDXContent components={MDXcomponents} />
      </div>
      {mdxTOCFolded && (
        <div className="mdx-TOC">
            <List
              sx={{
                position: "sticky",
                top: 0,
                borderLeft: "2px solid",
                borderColor: "purple.light",
                maxHeight: "50vh",
                height: "50vh",
                overflowY: "hidden",
                paddingLeft: "16px",
                "&:hover": {
                  borderColor: "purple.main",
                  overflowY: 'scroll'
                },
              }}
              subheader={
                <ListSubheader
                  component="div"
                  sx={{
                    position: "relative",
                    width: "100%",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    background: "none",
                    fontSize: "16px",
                    color: "purple.main",
                    paddingLeft: "4px",
                  }}
                >
                  目录
                </ListSubheader>
              }
            >
              {buildTOC(toc.children)}
            </List>
        </div>
      )}
    </div>
  );
};

export default MDXCurrentPage;

MDXCurrentPage.layoutType = "mdx";
