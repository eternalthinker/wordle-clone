import styles from "./tile.module.css";
import classNames from "classnames";
import { Letter } from "../reducer/root_state";

export const Tile = ({ letter }: { letter: Letter }) => {
  return (
    <div className={styles.tileContainer}>
      <div
        className={classNames(styles.tile, {
          [styles.input]: letter.status === "input",
          [styles.filled]: letter.letter != null,
          [styles.absent]: letter.status === "absent",
          [styles.misplaced]: letter.status === "misplaced",
          [styles.correct]: letter.status === "correct",
        })}
      >
        {letter.letter}
      </div>
    </div>
  );
};
