import styles from "./tile.module.css";
import classNames from "classnames";
import { Letter } from "../reducer/root_state";

export const Tile = ({ letter, letterIndex, revealing }: { letter: Letter, letterIndex: number, revealing?: boolean }) => {
  return (
    <div className={styles.tileContainer}>
      <div
        className={classNames(styles.tile, {
          [styles.input]: letter.status === "input",
          [styles.filled]: letter.letter != null,
          [styles.absent]: letter.status === "absent",
          [styles.misplaced]: letter.status === "misplaced",
          [styles.correct]: letter.status === "correct",
          [styles.reveal]: revealing,
        })}
        style={{
          animationDelay: `${0.25 * letterIndex}s`,
        }}
      >
        {letter.letter}
      </div>
    </div>
  );
};
