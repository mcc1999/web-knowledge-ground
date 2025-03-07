import React, { useCallback } from "react";
import {
  Box,
  Card,
  Typography,
  Autocomplete,
  Toolbar,
  Avatar,
  TextField,
  Paper,
  Popper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Switch,
  IconButton,
} from "@mui/material";
import useWebPlaygroundStore from "@/store";
import Link from "next/link";
import SimpleBar from "simplebar-react";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import ThemeSwitch from "@/components/ThemeSwitch";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "./index.module.scss";

const SearchAutocomplete = styled(Autocomplete)(({ theme }) => ({
  position: "relative",
  width: "100%",
  padding: "16px",
  marginBottom: 16,
  borderBottom: `1px solid ${theme.palette.purple.main}`,
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch !important",
    },
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: theme.palette.purple.main,
      borderWidth: "2px",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.purple.main,
    },
  },
}));

const MDXLayout = (props: any) => {
  const router = useRouter();
  const theme = useTheme();
  const [
    siderData,
    updateSelectPostId,
    siderFolded,
    toggleSiderFolded,
    mdxTOCFolded,
    toggleMdxTOCFolded,
  ] = useWebPlaygroundStore((state) => [
    state.siderData,
    state.updateSelectPostId,
    state.siderFolded,
    state.toggleSiderFolded,
    state.mdxTOCFolded,
    state.toggleMdxTOCFolded,
  ]);

  const handelAutocompleteChange = (event: any, value: any) => {
    router.push(value.value);
  };

  const formatSiderDate = useCallback(() => {
    if (!siderData.length) return {};
    const siderDataMap: Record<string, any[]> = {};
    siderData.forEach((data) => {
      const category: string = data.id.split("/")[0];
      if (siderDataMap[category]) {
        siderDataMap[category].push(data);
      } else {
        siderDataMap[category] = [data];
      }
    });
    return siderDataMap;
  }, [siderData]);

  return (
    <Box className={styles["mdx-layout"]}>
      <Paper
        className={styles["content"]}
        elevation={3}
        sx={{
          width: siderFolded ? 0 : 275,
          height: "100%",
          borderRadius: 0,
          display: "inline-block",
          verticalAlign: "top",
          transition: "width .5s",
        }}
      >
        {/* 搜索框 */}
        <div className={styles["search-input"]}>
          <SearchAutocomplete
            options={siderData.map((item) => ({
              label: item.title,
              value: item.linkTo,
            }))}
            disableClearable
            forcePopupIcon={false}
            isOptionEqualToValue={(option: any, value: any) => {
              return option.value === value.value;
            }}
            ListboxProps={{
              // @ts-ignore
              sx: {
                ".MuiAutocomplete-option": {
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              },
            }}
            PopperComponent={(params) => (
              <Popper {...params} placement="bottom-start" />
            )}
            PaperComponent={(params) => (
              <Paper
                {...params}
                sx={{
                  width: "300px",
                  maxHeight: "300px",
                  overflow: "hidden !important",
                }}
              />
            )}
            onChange={handelAutocompleteChange}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                size="small"
                id="input-with-icon-textfield"
                placeholder="Search..."
              />
            )}
          />
        </div>
        {/* MDX 目录树 */}
        <div className={styles["sider-data"]}>
          {!!siderData.length &&
            Object.keys(formatSiderDate()).map((key) => (
              <Accordion
                key={key}
                disableGutters
                sx={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  backgroundColor: "transparent",
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />
                  }
                >
                  {key}
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                  {formatSiderDate()[key].map((item, i) => (
                    <Typography
                      key={item.title + i}
                      noWrap
                      onClick={() => updateSelectPostId(item.id)}
                      sx={{
                        "&:hover": {
                          color: "purple.main",
                          backgroundColor: alpha(
                            theme.palette.purple.light,
                            0.15
                          ),
                        },
                        color:
                          decodeURIComponent(router.asPath) === item.linkTo
                            ? "purple.main"
                            : "inherit",
                        backgroundColor:
                          decodeURIComponent(router.asPath) === item.linkTo
                            ? alpha(theme.palette.purple.light, 0.15)
                            : "",
                        marginBottom: "4px",
                        padding: "4px  0 4px 16px",
                      }}
                    >
                      <Link href={item.linkTo}>
                        <span
                          title={item.title}
                          className={styles["content-item"]}
                        >
                          {`${i + 1}. ${item.title}`}
                        </span>
                      </Link>
                    </Typography>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
        </div>
        {/* 底部设置按钮 */}
        <div
          className={styles["setting-actions"]}
          style={{ left: siderFolded ? 0 : 275 }}
        >
          <Tooltip
            arrow
            leaveDelay={500}
            title={
              <div>
                页面目录
                <Switch checked={mdxTOCFolded} onChange={toggleMdxTOCFolded} />
              </div>
            }
          >
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </div>
        {/* 右侧折叠 Icon */}
        <div
          className={styles["fold-icon"]}
          style={{ left: siderFolded ? 0 : 275 }}
          onClick={() => toggleSiderFolded()}
        >
          {siderFolded ? <AiOutlineCaretRight /> : <AiOutlineCaretLeft />}
        </div>
      </Paper>
      <Card
        sx={{
          width: `calc(100% - ${siderFolded ? 0 : 275}px)`,
          height: "100%",
          padding: "32px 10%",
          display: "inline-block",
          overflowY: "scroll",
          borderRadius: 0,
          verticalAlign: "top",
          transition: "width .5s",
        }}
      >
        <div className="markdown-body">{props.children}</div>
      </Card>
    </Box>
  );
};

export default MDXLayout;
