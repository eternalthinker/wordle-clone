import styles from "./help_screen.module.css";

export const HelpScreen = ({ onCloseClick }: { onCloseClick: () => void }) => {
  return (
    <div className={styles.helpScreen}>
      <div className={styles.heading}>
        <h3>About this game</h3>
        <button onClick={onCloseClick} className={styles.closeButton}>
          x
        </button>
      </div>
      <p>
        This is a clone of the popular{" "}
        <a href="https://www.powerlanguage.co.uk/wordle/">Wordle game.</a>
      </p>
      <p>
        This version also gives you the option to play with 6-letter words.
      </p>
      <p>
        The 5-letter mode uses the same daily solutions as the original Wordle game.
      </p>
      <h3>Links</h3>
      Made by <a href="https://github.com/eternalthinker">
        eternalthinker
      </a>{" "}
      <br />
      Wordle solver:{" "}
      <a href="https://github.com/eternalthinker/wordle-helper">Solver</a>
    </div>
  );
};
