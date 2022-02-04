import styles from "./help_screen.module.css";

export const HelpScreen = ({ onCloseClick }: { onCloseClick: () => void }) => {
  return (
    <div className={styles.helpScreen}>
      <div className={styles.heading}>
        <h3>How to use?</h3>
        <button onClick={onCloseClick} className={styles.closeButton}>
          x
        </button>
      </div>
      <p>
        This is a tool to help you with hints for your{" "}
        <a href="https://www.powerlanguage.co.uk/wordle/">Wordle puzzle.</a>
      </p>
      <p>
        Type in the word of choice and press Enter (just like in Wordle!).{" "}
        <br />
        Now you can click on the letters to set the correct colour.{" "}
      </p>
      <p>
        Suggested words will be displayed at the bottom (with the most preferred
        words first).
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
