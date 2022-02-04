import styles from "./app.module.css";
import "../base/theme/base.css";
import { Header } from "../header/header";
import { WordleHelper } from "../wordle_helper/wordle_helper";
import { RootContext, RootProvider } from "../context/root_context";
import React from "react";

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
        <WordleHelper />
      </div>
    </div>
  );
};
