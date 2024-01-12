import type { NextPage } from "next";
import ListAltIcon from "@mui/icons-material/ListAlt";

import styles from "./index.module.scss";
import { Box } from "@mui/material";
import Link from "next/link";

const goodies = [
  {
    name: "Todo List",
    link: "/todo-list",
    icon: <ListAltIcon />,
    slogan: "Simple, Useful",
    introduce: `一个以日历为展示主体的TodoList工具，记录每天的todo & done。每个todo事项有标题、详情、Deadline、Tags等内容，并可创建子事项。所有的TodoList记录保存在localStorage中。`,
  },
  // {
  //   name: "Todo List",
  //   icon: <ListAltIcon />,
  //   introduce: `If you've ever tried to come up with a beautiful gradient from scratch, you've likely found that it's pretty tricky! Colors get dull and washed-out in the middle.`,
  // },
];

const Goodies: NextPage = () => {
  return (
    <div className={styles["goodies"]}>
      <h1>Bonus Goodies</h1>
      {goodies.map((good) => (
        <Link key={good.name} href={good.link}>
          <Box className={styles["good-item"]} sx={{ bgcolor: "cardBg.main" }}>
            <div className="left">
              <div>{Array.from({ length: 4 }).map((i) => good.icon)}</div>
              <Box sx={{ color: "orange.main" }}>
                <h2>{good.name}</h2>
              </Box>
              <h6>{good.slogan}</h6>
            </div>
            <div className="right">
              <Box sx={{ color: "purple.main" }}>
                <h2>{good.name}</h2>
              </Box>{" "}
              <div>{good.introduce}</div>
            </div>
          </Box>
        </Link>
      ))}
    </div>
  );
};

export default Goodies;
