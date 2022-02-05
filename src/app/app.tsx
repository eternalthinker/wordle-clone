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
  const { state } = React.useContext(RootContext);
  const { theme } = state;

  return (
    <div className={styles.appContainer} data-theme={theme}>
      <div className={styles.app}>
        <Header />
        <ToastContainer/>
        <WordleGame />
      </div>
    </div>
  );
};
