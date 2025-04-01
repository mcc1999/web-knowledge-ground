import type { NextPage } from "next";
import ListAltIcon from "@mui/icons-material/ListAlt";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { Box } from "@mui/material";
import Link from "next/link";

import styles from "./index.module.scss";

const goodies = [
  {
    name: "Todo List",
    link: "/goodies/todo-list",
    icon: <ListAltIcon />,
    slogan: "Simple, Useful",
    introduce: `一个以日历为展示主体的TodoList工具，记录每天的todo task。每个todo事项有标题、详情、TimeRange、Tags等内容。所有的TodoList记录保存在localStorage中。`,
  },
  {
    name: "Keyboard",
    link: "/goodies/keyboard",
    icon: <KeyboardIcon />,
    slogan: "Authentic, Beautiful",
    introduce: `一个拟态键盘页面，模拟物理键盘外观，按下真实键盘会有相应动画`,
  },
  {
    name: "Clock",
    link: "/goodies/clock",
    icon: <KeyboardIcon />,
    slogan: "Time, Life",
    introduce: `一个计时工具，有普通计时和倒计时两种模式`,
  },
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
              <div className="introduce">{good.introduce}</div>
            </div>
          </Box>
        </Link>
      ))}
    </div>
  );
};

export default Goodies;
