import type { NextPage } from "next";
import { Box } from "@mui/material";

import styles from "./index.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className="main">
        <Box
          className="geometry1"
          sx={(theme) => ({
            top: `${(Math.random() * 0.1 + 0.05) * 100}vh`,
            left: `${Math.random() * 0.25 * 100}vw`,
            background: `linear-gradient(to bottom left, ${theme.palette.purple.main}, rgb(255 255 255 / 0))`,
          })}
        />
        <Box
          className="geometry2"
          sx={{
            top: `${(Math.random() * 0.1 + 0.05) * 100}vh`,
            right: `${Math.random() * 0.25 * 100}vw`,
          }}
        >
          <Box
            sx={(theme) => ({
              width: "100%",
              height: "100%",
              background: `linear-gradient(to bottom left, ${theme.palette.purple.light}, rgb(255 255 255 / 0))`,
              transform: "scale(0.71) rotate(45deg)",
              transformOrigin: "bottom left",
            })}
          />
        </Box>
        <Box
          className="geometry3"
          sx={{
            bottom: `${(Math.random() * 0.1 + 0.05) * 100}vh`,
            left: `${Math.random() * 0.25 * 100}vw`,
          }}
        >
          <Box
            sx={(theme) => ({
              width: "100%",
              height: "100%",
              background: `linear-gradient(to bottom left, ${theme.palette.purple.light}, rgb(255 255 255 / 0))`,
              transform: "scale(0.71) rotate(45deg)",
              transformOrigin: "bottom left",
            })}
          />
        </Box>
        <Box
          className="geometry4"
          sx={(theme) => ({
            bottom: `${(Math.random() * 0.1 + 0.04) * 100}vh`,
            right: `${Math.random() * 0.2 * 100}vw`,
            background: `linear-gradient(to bottom left, ${theme.palette.purple.main}, rgb(255 255 255 / 0))`,
          })}
        />
        <Box
          className={styles.name}
          sx={(theme) => ({
            textShadow: `0 0 10px ${theme.palette.purple.main}, 0 0 20px ${theme.palette.purple.main}, 0 0 50px ${theme.palette.purple.main}, 0 0 100px ${theme.palette.purple.main}, 0 0 200px ${theme.palette.purple.main}`,
          })}
        >
          Ma Chengcong
        </Box>
        <div className="quote">
          <q>No pain, no gain</q>
        </div>
      </main>
    </div>
  );
};

export default Home;
