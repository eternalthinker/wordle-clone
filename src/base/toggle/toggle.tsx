import React from "react";
import styles from "./toggle.module.css";

export const Toggle = ({
  onToggle,
  toggled = false,
}: {
  onToggle: (status: boolean) => void;
  toggled?: boolean;
}) => {
  const handleChange = React.useCallback(
    (e) => {
      onToggle(e.target.checked);
    },
    [onToggle]
  );

  return (
    <label className={styles.toggle}>
      <input type="checkbox" defaultChecked={toggled} onChange={handleChange} />
      <span className={styles.slider}></span>
    </label>
  );
};
