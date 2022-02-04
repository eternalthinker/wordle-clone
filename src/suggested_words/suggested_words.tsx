import React from "react";
import { RootContext } from "../context/root_context";
import styles from "./suggested_words.module.css";

export const SuggestedWords = () => {
  const { state } = React.useContext(RootContext);
  const { suggestedWords } = state;
  const { displayedWords } = suggestedWords;

  return (
    <div className={styles.suggestedWordsContainer}>
      <h2>Suggested Words</h2>
      <ul className={styles.suggestedWordsList}>
        {displayedWords.map((word, index) => (
          <li className={styles.suggestedWord} key={index}>
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};
