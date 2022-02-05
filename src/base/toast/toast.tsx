import React from "react";
import styles from "./toast.module.css";

export type ToastOptions = {
  id: string,
  content: string,
  duration?: number,
};

type ToastProps = ToastOptions & {
  destroy: (id: string) => void,
};

export const Toast = (props: ToastProps) => {
  const { id, destroy, content, duration = 1500 } = props;

  React.useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      destroy(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [destroy, duration, id]);

  return (
    <div className={styles.toast}>
      <div className={styles.content}>{content}</div>
    </div>
  );
};
