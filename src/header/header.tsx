import React from "react";
import { RootContext } from "../context/root_context";
import { HelpScreen } from "../help_screen/help_screen";
import { SettingsScreen } from "../settings_screen/settings_screen";
import { ShareScreen } from "../share_screen/share_screen";
import styles from "./header.module.css";

export const Header = () => {
  const [showHelp, setShowHelp] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  const { state, dispatch } = React.useContext(RootContext);
  const { wordle, showShare } = state;
  const { gameState } = wordle;

  return (
    <>
      <header className={styles.header}>
        <button onClick={() => setShowHelp(true)} className={styles.helpButton}>
          ?
        </button>
        <h1>Wordle Clone</h1>
        <div className={styles.endButtonsContainer}>
          {gameState !== "inprogress" && (
            <button
              onClick={() =>
                dispatch({ type: "show_share", payload: { status: true } })
              }
              className={styles.shareButton}
            >
              ↗
            </button>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className={styles.settingsButton}
          >
            ⚙
          </button>
        </div>
      </header>
      {showHelp && <HelpScreen onCloseClick={() => setShowHelp(false)} />}
      {showSettings && (
        <SettingsScreen onCloseClick={() => setShowSettings(false)} />
      )}
      {showShare && (
        <ShareScreen
          onCloseClick={() =>
            dispatch({ type: "show_share", payload: { status: false } })
          }
        />
      )}
    </>
  );
};
