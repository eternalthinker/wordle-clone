import React from "react";
import { DispatchType, RootContext } from "../context/root_context";
import { Constraints } from "../reducer/root_state";
import { KeyboardKey, KeyboardKeyStatus } from "./key/keyboard_key";
import styles from "./virtual_keyboard.module.css";

const keyboardLayout = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["spacer", "a", "s", "d", "f", "g", "h", "j", "k", "l", "spacer"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
];

const renderKey = (
  keyString: string,
  index: number,
  dispatch: DispatchType,
  constraints: Constraints,
) => {
  if (keyString === "spacer") {
    return <Spacer key={index} />;
  }
  let onClick: () => void = () => null;
  let displayString = keyString;
  let fontSize: "regular" | "small" = "regular";
  let status: KeyboardKeyStatus = "regular";
  if (/^[a-z]$/i.test(keyString)) {
    // Enter letter into next available tile
    onClick = () =>
      dispatch({
        type: "letter_input",
        payload: { letter: keyString },
      });
    if (constraints.excludedLetters.has(keyString)) {
      status = "absent";
    } else if (constraints.correctPositions.includes(keyString)) {
      status = "correct";
    } else if (constraints.includedLetters.has(keyString)) {
      status = "misplaced";
    }
  } else if (keyString === "enter") {
    // Commit current line
    onClick = () =>
      dispatch({
        type: "word_enter",
      });
    fontSize = "small";
  } else if (keyString === "backspace") {
    // Clear last input tile
    onClick = () =>
      dispatch({
        type: "letter_delete",
      });
    displayString = "⌫";
  }
  return (
    <KeyboardKey
      key={index}
      displayString={displayString}
      onClick={onClick}
      fontSize={fontSize}
      status={status}
    />
  );
};

const Spacer = () => {
  return <div className={styles.spacer} />;
};

export const VirtualKeyboard = () => {
  const { state, dispatch } = React.useContext(RootContext);
  const { constraints } = state;

  return (
    <div className={styles.virtualKeyboard}>
      {keyboardLayout.map((row, rowIdx) => (
        <div className={styles.keyboardRow} key={rowIdx}>
          {row.map((keyString, i) => renderKey(keyString, i, dispatch, constraints))}
        </div>
      ))}
    </div>
  );
};
