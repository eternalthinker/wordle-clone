import { VirtualKeyboard } from "../virtual_keyboard/virtual_keyboard";
import { WordTileGrid } from "../word_tile_grid/word_tile_grid";
import styles from "./wordle_game.module.css";

export const WordleGame = () => {
  return (
    <div className={styles.wordleGame}>
      <div className={styles.mainContainer}>
        <WordTileGrid />
      </div>
      <VirtualKeyboard />
    </div>
  );
};
