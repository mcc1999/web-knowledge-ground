import React from "react";
import styles from "./index.module.scss";
import { Box } from "@mui/material";

const NotFountPage: React.FC = () => {
  return (
    <div className={styles["not-found"]}>
      <Box className={styles["text-magic"]} data-word="404">
        404
        <div className={styles["white"]}></div>
      </Box>
      <div className={styles["tips"]}>This page could not be found.</div>
    </div>
  );
};

export default NotFountPage;
