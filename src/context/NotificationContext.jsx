import {
  createContext,
  useCallback,
  useContext,
  useMemo
} from "react";

import { useApp } from "./AppContext";

const NotificationContext = createContext(null);

function createNotificationId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export function NotificationProvider({ children }) {
  const { state, dispatch } = useApp();

  const notifications = state.notifications || [];

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.read
      ).length,
    [notifications]
  );

  const addNotification = useCallback(
    ({
      type = "info",
      title,
      message = "",
      entity = null
    }) => {
      const notification = {
        id: createNotificationId(),
        type,
        title,
        message,
        entity,
        read: false,
        createdAt: new Date().toISOString()
      };

      dispatch({
        type: "ADD_NOTIFICATION",
        payload: notification
      });

      return notification;
    },
    [dispatch]
  );

  const success = useCallback(
    (title, message, entity = null) =>
      addNotification({
        type: "success",
        title,
        message,
        entity
      }),
    [addNotification]
  );

  const error = useCallback(
    (title, message, entity = null) =>
      addNotification({
        type: "error",
        title,
        message,
        entity
      }),
    [addNotification]
  );

  const warning = useCallback(
    (title, message, entity = null) =>
      addNotification({
        type: "warning",
        title,
        message,
        entity
      }),
    [addNotification]
  );

  const info = useCallback(
    (title, message, entity = null) =>
      addNotification({
        type: "info",
        title,
        message,
        entity
      }),
    [addNotification]
  );

  const markAsRead = useCallback(
    (notificationId) => {
      dispatch({
        type: "MARK_NOTIFICATION_READ",
        payload: notificationId
      });
    },
    [dispatch]
  );

  const markAllAsRead = useCallback(() => {
    dispatch({
      type: "MARK_ALL_NOTIFICATIONS_READ"
    });
  }, [dispatch]);

  const removeNotification = useCallback(
    (notificationId) => {
      dispatch({
        type: "REMOVE_NOTIFICATION",
        payload: notificationId
      });
    },
    [dispatch]
  );

  const clearNotifications = useCallback(() => {
    dispatch({
      type: "CLEAR_NOTIFICATIONS"
    });
  }, [dispatch]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      success,
      error,
      warning,
      info,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearNotifications
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      success,
      error,
      warning,
      info,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearNotifications
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}