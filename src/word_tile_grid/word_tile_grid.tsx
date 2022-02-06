import React from "react";
import styles from "./word_tile_grid.module.css";
import { DispatchType, RootContext } from "../context/root_context";
import { Tile } from "../tile/tile";
import { WordLine } from "../reducer/root_state";

const WordTileLine = ({ wordLine }: { wordLine: WordLine }) => {
  return (
    <div className={styles.wordLine}>
      {wordLine.word.map((letter, i) => (
        <Tile letter={letter} key={i} />
      ))}
    </div>
  );
};

export const WordTileGrid = () => {
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  React.useEffect(() => {
    const handleResize = () => {
      console.log("resizing");
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { state, dispatch } = React.useContext(RootContext);

  const handleKeyBoard = React.useCallback(getHandleKeyBoard(dispatch), []);

  React.useEffect(() => {
    document.addEventListener("keyup", handleKeyBoard);
    return () => {
      document.removeEventListener("keyup", handleKeyBoard);
    };
  }, [handleKeyBoard]);

  const { wordle, gameMode } = state;

  // TODO: Use element measurement?
  const height =
    dimensions.height -
    (200 + 8 + 5) - // keyboard
    61 - // header
    10; // wordle element gap
  const width =
    ((height - 5 * 8) / // tile gap
      6) * // 1 tile size
    (gameMode === "5letters" ? 5 : 6); // number of horizontal tiles

  return (
    <div
      tabIndex={-1}
      className={styles.wordGrid}
      style={{
        width,
        height,
      }}
    >
      {wordle.wordLines.map((wordLine, i) => (
        <WordTileLine wordLine={wordLine} key={i} />
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
