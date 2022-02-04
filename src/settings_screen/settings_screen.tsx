import React from "react";
import { Toggle } from "../base/toggle/toggle";
import { RootContext } from "../context/root_context";
import { Theme } from "../reducer/root_state";
import styles from "./settings_screen.module.css";

export const SettingsScreen = ({
  onCloseClick,
}: {
  onCloseClick: () => void;
}) => {
  const { state, dispatch } = React.useContext(RootContext);
  const { theme } = state;
  const onToggleDarkMode = React.useCallback((enableDarkMode: boolean) => {
    const theme: Theme = enableDarkMode ? "dark" : "light";
    dispatch({ type: "theme_change", payload: { theme } });
  }, [dispatch]);

  return (
    <div className={styles.settingsScreen}>
      <div className={styles.heading}>
        <h3>Settings</h3>
        <button onClick={onCloseClick} className={styles.closeButton}>
          x
        </button>
      </div>
      <div className={styles.settings}>
        <div className={styles.setting}>
          <h4>Dark theme</h4>
          <Toggle onToggle={onToggleDarkMode} toggled={theme === "dark"} />
        </div>
      </div>
    </div>
  );
};
