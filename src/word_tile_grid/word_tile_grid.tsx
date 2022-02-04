import React from "react";
import styles from "./word_tile_grid.module.css";
import { DispatchType, RootContext } from "../context/root_context";
import { Tile } from "../tile/tile";
import { WordLine } from "../reducer/root_state";

const WordTileLine = ({
  wordLine,
  lineIndex,
}: {
  wordLine: WordLine;
  lineIndex: number;
}) => {
  return (
    <div className={styles.wordLine}>
      {wordLine.word.map((letter, i) => (
        <Tile letter={letter} row={lineIndex} col={i} key={i} />
      ))}
    </div>
  );
};

export const WordTileGrid = () => {
  const { state, dispatch } = React.useContext(RootContext);
  const { wordle } = state;
  const handleKeyBoard = React.useCallback(getHandleKeyBoard(dispatch), []);
  React.useEffect(() => {
    document.addEventListener("keyup", handleKeyBoard);
    return () => {
      document.removeEventListener("keyup", handleKeyBoard);
    };
  }, [handleKeyBoard]);

  return (
    <div tabIndex={-1} className={styles.wordGrid}>
      {wordle.wordLines.map((wordLine, i) => (
        <WordTileLine wordLine={wordLine} lineIndex={i} key={i} />
      ))}
    </div>
  );
};

const getHandleKeyBoard = (dispatch: DispatchType) => {
  const handleKeyBoard = (e: KeyboardEvent) => {
    const key = e.key;

    if (/^[a-z]$/i.test(key)) {
      // Enter letter into next available tile
      dispatch({
        type: "letter_input",
        payload: { letter: key },
      });
    } else if (key === "Enter") {
      // Commit current line
      dispatch({
        type: "word_enter",
      });
    } else if (key === "Backspace") {
      // Clear last input tile
      dispatch({
        type: "letter_delete",
      });
    }
  };
  return handleKeyBoard;
};
