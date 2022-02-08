import styles from "./app.module.css";
import "../base/theme/base.css";
import { Header } from "../header/header";
import { WordleGame } from "../wordle_game/wordle_game";
import { RootContext, RootProvider } from "../context/root_context";
import React from "react";
import { ToastContainer } from "../base/toast/toast_container";
import { getWordLength } from "../reducer/root_state";

export const Root = () => {
  return (
    <RootProvider>
      <App />
    </RootProvider>
  );
};

export const App = () => {
  const { state, dispatch } = React.useContext(RootContext);
  const { theme, isRevealing, gameMode } = state;

  React.useEffect(() => {
    if (isRevealing) {
      const wordLength = getWordLength(gameMode);
      setTimeout(() => dispatch({ type: "reveal_end" }), (wordLength+1) * 0.25 * 1000);
    }
  }, [isRevealing, dispatch, gameMode]);

  return (
    <div className={styles.appContainer} data-theme={theme}>
      <div className={styles.app}>
        <Header />
        <ToastContainer />
        <WordleGame />
      </div>
    </div>
  );
};
