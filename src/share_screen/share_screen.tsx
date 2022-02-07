import React from "react";
import { RootContext } from "../context/root_context";
import styles from "./share_screen.module.css";

export const ShareScreen = ({
  onCloseClick,
}: {
  onCloseClick: () => void;
}) => {
  const { dispatch } = React.useContext(RootContext);

  return (
    <div className={styles.shareScreen}>
      <div className={styles.heading}>
        <h3> </h3>
        <button onClick={onCloseClick} className={styles.closeButton}>
          x
        </button>
      </div>
      <div className={styles.share}>
        <button
          className={styles.shareButton}
          onClick={() => dispatch({ type: "share_result" })}
        >
          Share
        </button>
      </div>
    </div>
  );
};
