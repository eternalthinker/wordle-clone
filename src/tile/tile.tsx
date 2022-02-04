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
  const { dispatch } = React.useContext(RootContext);

  const onStatusChanged = React.useCallback(() => {
    if (letter.status === "input") {
      return;
    }
    dispatch({
      type: "letter_status_change",
      payload: {
        lineIndex: row,
        letterIndex: col,
      },
    });
  }, [letter.status, row, col, dispatch]);

  const onClick: MouseEventHandler<HTMLDivElement> = React.useCallback(
    (e) => {
      e.preventDefault();
      onStatusChanged();
    },
    [onStatusChanged]
  );

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
        onClick={onClick}
      >
        {letter.letter}
      </div>
    </div>
  );
};
