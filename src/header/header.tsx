import React from "react";
import { HelpScreen } from "../help_screen/help_screen";
import { SettingsScreen } from "../settings_screen/settings_screen";
import styles from "./header.module.css";

export const Header = () => {
  const [showHelp, setShowHelp] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <>
      <header className={styles.header}>
        <button onClick={() => setShowHelp(true)} className={styles.helpButton}>
          ?
        </button>
        <h1>Wordle Clone</h1>
        <button
          onClick={() => setShowSettings(true)}
          className={styles.settingsButton}
        >
          ⚙
        </button>
      </header>
      {showHelp && <HelpScreen onCloseClick={() => setShowHelp(false)} />}
      {showSettings && (
        <SettingsScreen onCloseClick={() => setShowSettings(false)} />
      )}
    </>
  );
};
