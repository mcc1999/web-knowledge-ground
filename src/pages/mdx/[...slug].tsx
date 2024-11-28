import glob from "fast-glob";
import MDXContentPage from "@/layout/mdxContentPage";
import { GetStaticPaths, GetStaticProps } from "next";
import { allFrameworks, Framework } from "contentlayer/generated";

export default MDXContentPage;

export const getStaticPaths: GetStaticPaths<{ slug: string[] }> = async () => {
  const mdx = await glob("src/mdx/**/*.mdx");

  return {
    paths: mdx.map((path) => ({
      params: {
        slug: path.replace(/^src\/mdx\/|(\/index)?\.mdx$/g, "").split("/"),
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<any, { slug: string[] }> = async (
  context
) => {
  const { slug } = context.params!;
  // @ts-ignore
  const MDXComponentCode =
    allFrameworks.find(
      (item: Framework) => item._raw.flattenedPath === slug.join("/")
    )?.body.code;
  const toc = allFrameworks.find(
    (item: Framework) => item._raw.flattenedPath === slug.join("/")
  )?.toc;
  const siderData = allFrameworks
    .sort((a, b) => Date.parse(a.date!) - Date.parse(b.date!))
    .map((item) => ({
      id: item._id,
      title: item.title,
      linkTo: item.url.slice(3),
    }));

  return { props: { MDXComponentCode, siderData, toc } };
};
