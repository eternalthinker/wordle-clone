import React from "react";
import styles from "./toast.module.css";

export interface ToastProps {
  id: string;
  destroy: () => void;
  content: string;
  duration?: number;
}

export const Toast = (props: ToastProps) => {
  const { destroy, content, duration = 1500 } = props;

  React.useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      destroy();
    }, duration);

    return () => clearTimeout(timer);
  }, [destroy, duration]);

  return (
    <div className={styles.toast}>
      <div className={styles.content}>{content}</div>
    </div>
  );
};
