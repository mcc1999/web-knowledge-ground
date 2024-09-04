import KeyboardKey from "@/components/KeyboardKey";
import styles from "./index.module.scss";
import { MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

const keyboardLine1: {
  keyNames: string[];
  keyValue: string;
  className: string;
}[] = [
  {
    keyNames: ["~", "`"],
    keyValue: "Backquote",
    className: "key-base",
  },
  {
    keyNames: ["!", "1"],
    keyValue: "Digit1",
    className: "key-base",
  },
  {
    keyNames: ["@", "2"],
    keyValue: "Digit2",
    className: "key-base",
  },
  {
    keyNames: ["#", "3"],
    keyValue: "Digit3",
    className: "key-base",
  },
  {
    keyNames: ["$", "4"],
    keyValue: "Digit4",
    className: "key-base",
  },
  {
    keyNames: ["%", "5"],
    keyValue: "Digit5",
    className: "key-base",
  },
  {
    keyNames: ["^", "6"],
    keyValue: "Digit6",
    className: "key-base",
  },
  {
    keyNames: ["&", "7"],
    keyValue: "Digit7",
    className: "key-base",
  },
  {
    keyNames: ["*", "8"],
    keyValue: "Digit8",
    className: "key-base",
  },
  {
    keyNames: ["(", "9"],
    keyValue: "Digit9",
    className: "key-base",
  },
  {
    keyNames: [")", "0"],
    keyValue: "Digit0",
    className: "key-base",
  },
  {
    keyNames: ["_", "-"],
    keyValue: "Minus",
    className: "key-base",
  },
  {
    keyNames: ["+", "="],
    keyValue: "Equal",
    className: "key-base",
  },
  { keyNames: ["Delete"], keyValue: "Backspace", className: "key-caps" },
];
const keyboardLine2: {
  keyNames: string[];
  keyValue: string;
  className: string;
}[] = [
  {
    keyNames: ["Tab"],
    keyValue: "Tab",
    className: "key-tab",
  },
  {
    keyNames: ["Q"],
    keyValue: "KeyQ",
    className: "key-base",
  },
  {
    keyNames: ["W"],
    keyValue: "KeyW",
    className: "key-base",
  },
  {
    keyNames: ["E"],
    keyValue: "KeyE",
    className: "key-base",
  },
  {
    keyNames: ["R"],
    keyValue: "KeyR",
    className: "key-base",
  },
  {
    keyNames: ["T"],
    keyValue: "KeyT",
    className: "key-base",
  },
  {
    keyNames: ["Y"],
    keyValue: "KeyY",
    className: "key-base",
  },
  {
    keyNames: ["U"],
    keyValue: "KeyU",
    className: "key-base",
  },
  {
    keyNames: ["I"],
    keyValue: "KeyI",
    className: "key-base",
  },
  {
    keyNames: ["O"],
    keyValue: "KeyO",
    className: "key-base",
  },
  {
    keyNames: ["P"],
    keyValue: "KeyP",
    className: "key-base",
  },
  {
    keyNames: ["[", "【", "{", "「"],
    keyValue: "BracketLeft",
    className: "key-base",
  },
  {
    keyNames: ["]", "】", "}", "」"],
    keyValue: "BracketRight",
    className: "key-base",
  },
  {
    keyNames: ["", "、", "|", "\\"],
    keyValue: "Backslash",
    className: "key-tab",
  },
];
const keyboardLine3: {
  keyNames: string[];
  keyValue: string;
  className: string;
}[] = [
  {
    keyNames: ["A"],
    keyValue: "KeyA",
    className: "key-base",
  },
  {
    keyNames: ["S"],
    keyValue: "KeyS",
    className: "key-base",
  },
  {
    keyNames: ["D"],
    keyValue: "KeyD",
    className: "key-base",
  },
  {
    keyNames: ["F"],
    keyValue: "KeyF",
    className: "key-base",
  },
  {
    keyNames: ["G"],
    keyValue: "KeyG",
    className: "key-base",
  },
  {
    keyNames: ["H"],
    keyValue: "KeyH",
    className: "key-base",
  },
  {
    keyNames: ["J"],
    keyValue: "KeyJ",
    className: "key-base",
  },
  {
    keyNames: ["K"],
    keyValue: "KeyK",
    className: "key-base",
  },
  {
    keyNames: ["L"],
    keyValue: "KeyL",
    className: "key-base",
  },
  {
    keyNames: [":", ";"],
    keyValue: "Semicolon",
    className: "key-base",
  },
  {
    keyNames: ['"', "'"],
    keyValue: "Quote",
    className: "key-base",
  },
  {
    keyNames: ["Enter"],
    keyValue: "Enter",
    className: "key-caps",
  },
];
const keyboardLine4: {
  keyNames: string[];
  keyValue: string;
  className: string;
}[] = [
  {
    keyNames: ["Shift"],
    keyValue: "ShiftLeft",
    className: "key-shift",
  },
  {
    keyNames: ["Z"],
    keyValue: "KeyZ",
    className: "key-base",
  },
  {
    keyNames: ["X"],
    keyValue: "KeyX",
    className: "key-base",
  },
  {
    keyNames: ["C"],
    keyValue: "KeyC",
    className: "key-base",
  },
  {
    keyNames: ["V"],
    keyValue: "KeyV",
    className: "key-base",
  },
  {
    keyNames: ["B"],
    keyValue: "KeyB",
    className: "key-base",
  },
  {
    keyNames: ["N"],
    keyValue: "KeyN",
    className: "key-base",
  },
  {
    keyNames: ["M"],
    keyValue: "KeyM",
    className: "key-base",
  },
  {
    keyNames: ["《", "，", "<"],
    keyValue: "Comma",
    className: "key-base",
  },
  {
    keyNames: ["》", "。", ">", "."],
    keyValue: "Period",
    className: "key-base",
  },
  {
    keyNames: ["?", "/"],
    keyValue: "Slash",
    className: "key-base",
  },
  {
    keyNames: ["Shift"],
    keyValue: "ShiftRight",
    className: "key-shift",
  },
];
const macKeyboardLine5: {
  keyNames: string[];
  keyValue: string;
  className: string;
}[] = [
  {
    keyNames: ["fn"],
    keyValue: "fn",
    className: "key-base",
  },
  {
    keyNames: ["", "control", "⌃"],
    keyValue: "ControlLeft",
    className: "key-base",
  },
  {
    keyNames: ["", "option", "⌥"],
    keyValue: "AltLeft",
    className: "key-base",
  },
  {
    keyNames: ["", "command", "⌘"],
    keyValue: "MetaLeft",
    className: "key-command",
  },
  {
    keyNames: ["Space"],
    keyValue: "Space",
    className: "key-space",
  },
  {
    keyNames: ["", "command", "⌘"],
    keyValue: "MetaRight",
    className: "key-command",
  },
  {
    keyNames: ["", "option", "⌥"],
    keyValue: "AltRight",
    className: "key-base",
  },
  {
    keyNames: ["←"],
    keyValue: "ArrowLeft",
    className: "key-arrow",
  },
  {
    keyNames: ["↑"],
    keyValue: "ArrowUp",
    className: "key-arrow",
  },
  {
    keyNames: ["→"],
    keyValue: "ArrowRight",
    className: "key-arrow",
  },
  {
    keyNames: ["↓"],
    keyValue: "ArrowDown",
    className: "key-arrow",
  },
];
const winKeyboardLine5: {
  keyNames: string[];
  keyValue: string;
  className: string;
}[] = [
  {
    keyNames: ["Ctrl"],
    keyValue: "ControlLeft",
    className: "key-ctrl",
  },
  {
    keyNames: ["Win"],
    keyValue: "MetaLeft",
    className: "key-ctrl",
  },
  {
    keyNames: ["Alt"],
    keyValue: "AltLeft",
    className: "key-ctrl",
  },
  {
    keyNames: ["Space"],
    keyValue: "Space",
    className: "key-space-win",
  },
  {
    keyNames: ["Alt"],
    keyValue: "AltRight",
    className: "key-ctrl",
  },
  {
    keyNames: ["Win"],
    keyValue: "MetaRight",
    className: "key-ctrl",
  },
  {
    keyNames: ["Fn"],
    keyValue: "Fn",
    className: "key-ctrl",
  },
  {
    keyNames: ["Ctrl"],
    keyValue: "ControlRight",
    className: "key-ctrl",
  },
];

const macKeyboard = [
  ...keyboardLine1,
  ...keyboardLine2,
  {
    keyNames: ["中/英"],
    keyValue: "CapsLock",
    className: "key-caps",
  },
  ...keyboardLine3,
  ...keyboardLine4,
  ...macKeyboardLine5,
];
const winKeyboard = [
  ...keyboardLine1,
  ...keyboardLine2,
  {
    keyNames: ["Caps"],
    keyValue: "CapsLock",
    className: "key-caps",
  },
  ...keyboardLine3,
  ...keyboardLine4,
  ...winKeyboardLine5,
];

const Keyboard: React.FC = () => {
  const [keyboardType, setKeyboardType] = useState<"win" | "mac">("mac");
  const [activeKey, setActiveKey] = useState<string>("");

  useEffect(() => {
    const keydownListener = (e: KeyboardEvent) => {
      console.log("keydown", e.code);
      const keysNeedPreventDefault = ["Tab"];
      if (keysNeedPreventDefault.includes(e.code)) {
        e.preventDefault();
      }
      setActiveKey(e.code);
    };
    const keyupListener = () => {
      setActiveKey("");
    };
    document.addEventListener("keydown", keydownListener);
    document.addEventListener("keyup", keyupListener);
    return () => {
      document.removeEventListener("keydown", keydownListener);
      document.removeEventListener("keyup", keydownListener);
    };
  }, []);

  return (
    <div className={styles.keyboardPage}>
      <div className="keyboard-control">
        <Select
          value={keyboardType}
          onChange={(e) => setKeyboardType(e.target.value as any)}
        >
          <MenuItem value="win">Win</MenuItem>
          <MenuItem value="mac">Mac</MenuItem>
        </Select>
      </div>
      <div className="keyboard">
        {keyboardType === "mac"
          ? macKeyboard.map(({ keyNames, keyValue, className }) => (
              <KeyboardKey
                key={keyValue}
                active={keyValue === activeKey}
                keyNames={keyNames}
                className={className}
              />
            ))
          : winKeyboard.map(({ keyNames, keyValue, className }) => (
              <KeyboardKey
                key={keyValue}
                active={keyValue === activeKey}
                keyNames={keyNames}
                className={className}
              />
            ))}
      </div>
    </div>
  );
};

export default Keyboard;
