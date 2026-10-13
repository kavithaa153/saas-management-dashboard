import {
  createContext,
  useCallback,
  useContext,
  useState
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    ({
      type = "success",
      title,
      message,
      duration = 3500
    }) => {
      const id = `${Date.now()}-${Math.random()}`;

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          type,
          title,
          message
        }
      ]);

      window.setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const success = useCallback(
    (title, message) => {
      showToast({
        type: "success",
        title,
        message
      });
    },
    [showToast]
  );

  const error = useCallback(
    (title, message) => {
      showToast({
        type: "error",
        title,
        message
      });
    },
    [showToast]
  );

  const warning = useCallback(
    (title, message) => {
      showToast({
        type: "warning",
        title,
        message
      });
    },
    [showToast]
  );

  const info = useCallback(
    (title, message) => {
      showToast({
        type: "info",
        title,
        message
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        success,
        error,
        warning,
        info,
        removeToast
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}