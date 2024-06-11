import React from "react";
import { Box } from "@mui/material";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "./index.module.scss";

interface MDXGridProps {
  category: string;
  mdxs: any[];
}

const MDXGrid: React.FC<MDXGridProps> = ({ category, mdxs }) => {
  return (
    <div className={styles["mdx-grid"]}>
      <div className="header">
        <h1 className="category">{category}</h1>
        <div className="mdn-count">{mdxs.length} MDXs</div>
      </div>
      <div className="content">
        {mdxs.map((mdx, idx) => (
          <Box key={idx} className="mdx-item" sx={{ bgcolor: "cardBg.main" }}>
            <Link href={mdx.linkTo}>
              <article>
                <h3>{mdx.title}</h3>
                <p>{mdx.overview}</p>
                <div className="read-more">
                  <span>Read More</span>
                  <ArrowForwardIcon
                    className="read-more__icon"
                    fontSize="small"
                  />
                </div>
              </article>
            </Link>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default MDXGrid;
