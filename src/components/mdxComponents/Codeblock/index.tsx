/* eslint react/jsx-key: 0 */

import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import defaultTheme from "prism-react-renderer/themes/vsLight";
import darkTheme from "prism-react-renderer/themes/vsDark";
import { useTheme } from "@mui/material/styles";
import SimpleBar from "simplebar-react";
import { copyToClipboard } from "src/utils/clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/material";

interface CodeBlockProps {
  children: string;
  className: string;
}

const CodeBlock: React.FC<CodeBlockProps> = (props) => {
  const { children, className } = props;
  const language = className?.replace(/language-/, "") as Language;
  const [copied, setCopied] = useState(false);
  const [codeFolded, setCodeFolded] = useState({
    needFold: false,
    isFold: true,
  });
  const codeRef = useRef(null);
  const {
    palette: { mode },
  } = useTheme();

  useEffect(() => {
    if (
      codeRef.current &&
      Number(getComputedStyle(codeRef.current).height.slice(0, -2)) === 360
    ) {
      setCodeFolded({ ...codeFolded, needFold: true });
    }
  }, []);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  if (!language) return <code>{children}</code>;

  const HighlightCode = (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={language}
      theme={mode === "dark" ? darkTheme : defaultTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: "20px" }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );

  return (
    <div className={styles.codeBlock}>
      <div className="codeHeader">
        <div className="headerIcon">
          <div className="redIcon iconItem" />
          <div className="yellowIcon iconItem" />
          <div className="greenIcon iconItem" />
        </div>
        <div
          className="copyBtn"
          onClick={() => {
            copyToClipboard(children);
            setCopied(true);
          }}
        >
          {!copied ? (
            <ContentCopyIcon sx={{ color: "#1e1e1e" }} fontSize="small" />
          ) : (
            "✅"
          )}
        </div>
      </div>
      <div className="codeBody" ref={codeRef}>
        <SimpleBar
          style={
            codeFolded.isFold
              ? {
                  maxHeight: 360,
                  background: mode === "dark" ? "rgb(30, 30, 30)" : "#fff",
                }
              : {
                  background: mode === "dark" ? "rgb(30, 30, 30)" : "#fff",
                }
          }
          autoHide
        >
          {HighlightCode}
        </SimpleBar>
      </div>
      <div className="foldCode">
        {codeFolded.needFold && (
          <div
            style={{ color: mode === "dark" ? "#000" : "inherit" }}
            className="foldCodeBtn"
            onClick={() =>
              setCodeFolded({ ...codeFolded, isFold: !codeFolded.isFold })
            }
          >
            {codeFolded.isFold ? (
              <>
                <KeyboardArrowDownIcon />
                <span>Show more</span>
              </>
            ) : (
              <>
                <KeyboardArrowUpIcon />
                <span>Show less</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default CodeBlock;
