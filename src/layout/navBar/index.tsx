import React from "react";
import { AppBar, Typography, Toolbar, Avatar, Box } from "@mui/material";
import ThemeSwitch from "@/components/ThemeSwitch";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useRouter } from "next/router";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import styles from "./index.module.scss";

const pages = ["MDX", "Goodies"];
const mdxCategory = ["React", "Vue", "Typescript", "CSS", "3D", "面试"];

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#ffffff",
    color: "#000000",
    borderRadius: "12px",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#ffffff",
  },
}));

const NavBar: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <AppBar
      position="sticky"
      className={styles["nav-bar"]}
      sx={{ bgcolor: "background.default", color: "inherit" }}
    >
      <Toolbar>
        <Avatar
          src="/images/icon.jpg"
          className={styles["avatar-img"]}
          alt="ICON"
          sx={{ marginRight: "16px", cursor: "pointer" }}
        />
        <Link href="/">
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{
              color: "purple.main",
              padding: "0 16px",
            }}
          >
            <span className={styles["header-title"]}>Web-Playground</span>
            <svg width="0" height="0">
              <filter id="filter">
                <feTurbulence
                  id="turbulence"
                  type="fractalNoise"
                  baseFrequency=".03"
                  numOctaves="20"
                />
                <feDisplacementMap in="SourceGraphic" scale="10" />
              </filter>
            </svg>
          </Typography>
        </Link>
        <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "start" }}>
          {pages.map((page) => {
            return page === "MDX" ? (
              <Link key={page} href={`/${page.toLowerCase()}`}>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 16px",
                    fontWeight: pathname.includes(page.toLowerCase())
                      ? "bold"
                      : "normal",
                    textDecoration: pathname.includes(page.toLowerCase())
                      ? "#ed6c02 wavy underline"
                      : "none",
                    ":hover": { cursor: "pointer" },
                  }}
                >
                  {page}
                  {/* <LightTooltip
                    title={
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "8px 32px",
                        }}
                      >
                        {mdxCategory.map((category) => (
                          <Link key={category} href={`/mdx/${category}`}>
                            <Typography
                              sx={{
                                padding: "8px",
                                ":hover": {
                                  cursor: "pointer",
                                  color: "purple.main",
                                },
                              }}
                            >
                              {category}
                            </Typography>
                          </Link>
                        ))}
                      </Box>
                    }
                    arrow
                    placement="bottom"
                  >
                    <KeyboardArrowDownIcon sx={{ padding: "4px" }} />
                  </LightTooltip> */}
                </Typography>
              </Link>
            ) : (
              <Link key={page} href={`/${page.toLowerCase()}`}>
                <Typography
                  textAlign="center"
                  sx={{
                    padding: "0 16px",
                    fontWeight: pathname.includes(page.toLowerCase())
                      ? "bold"
                      : "normal",
                    textDecoration: pathname.includes(page.toLowerCase())
                      ? "#ed6c02 wavy underline"
                      : "none",
                    ":hover": { cursor: "pointer" },
                  }}
                >
                  {page}
                </Typography>
              </Link>
            );
          })}
        </Box>
        <Link href="https://github.com/mcc1999">
          <IconButton>
            <GitHubIcon />
          </IconButton>
        </Link>
        <ThemeSwitch />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
