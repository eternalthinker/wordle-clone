import React from "react";
import { RootContext } from "../../context/root_context";
import { Toast } from "./toast";
import styles from "./toast_container.module.css";

export const ToastContainer = () => {
  const { state, dispatch } = React.useContext(RootContext);
  const { toasts } = state;

  const destroy = React.useCallback((id: string) => {
    dispatch({
      type: "toast_destroy",
      payload: {
        id,
      }
    })
  }, [dispatch]);

  return (
    <div className={styles.toastContainer}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          destroy={destroy}
          {...toast}
        />))}
    </div>
  );
};
