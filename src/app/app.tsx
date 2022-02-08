import styles from "./app.module.css";
import "../base/theme/base.css";
import { Header } from "../header/header";
import { WordleGame } from "../wordle_helper/wordle_game";
import { RootContext, RootProvider } from "../context/root_context";
import React from "react";
import { ToastContainer } from "../base/toast/toast_container";

export const Root = () => {
  return (
    <RootProvider>
      <App />
    </RootProvider>
  );
};

export const App = () => {
  const { state, dispatch } = React.useContext(RootContext);
  const { theme, wordle } = state;

  React.useEffect(() => {
    if (wordle.gameState !== "inprogress") {
      setTimeout(() => dispatch({ type: "game_finish" }), 6 * 0.25 * 1000);
    }
  }, [wordle.gameState, dispatch]);

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
