import React, { MouseEventHandler } from "react";
import styles from "./tile.module.css";
import classNames from "classnames";
import { RootContext } from "../context/root_context";
import { Letter } from "../reducer/root_state";

export const Tile = ({
  letter,
  row,
  col,
}: {
  letter: Letter;
  row: number;
  col: number;
}) => {
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
