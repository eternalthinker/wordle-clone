import classNames from "classnames";
import styles from "./keyboard_key.module.css";

export type KeyboardKeyStatus = "regular" | "absent" | "misplaced" | "correct";

export const KeyboardKey = ({
  displayString,
  onClick,
  fontSize = "regular",
  status = "regular",
}: {
  displayString: string;
  onClick: () => void;
  fontSize?: "regular" | "small";
  status?: KeyboardKeyStatus,
}) => {
  return (
    <button
      className={classNames(styles.keyboardKey, {
        [styles.fontSmall]: fontSize === "small",
        [styles.absent]: status === "absent",
        [styles.misplaced]: status === "misplaced",
        [styles.correct]: status === "correct",
      })}
      onClick={onClick}
    >
      {displayString}
    </button>
  );
};
