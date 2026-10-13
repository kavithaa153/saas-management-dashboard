import {
  Bell,
  Check,
  CheckCheck,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Trash2,
  X
} from "lucide-react";

import { useNotifications } from "../../context/NotificationContext";

const notificationIcons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
};

function formatNotificationTime(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const difference = now.getTime() - date.getTime();

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString();
}

function NotificationPanel({ onClose }) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications
  } = useNotifications();

  return (
    <div className="notification-panel">
      <div className="notification-panel-header">
        <div>
          <div className="notification-title-row">
            <Bell size={17} />

            <h3>Notifications</h3>

            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount}
              </span>
            )}
          </div>

          <p>
            Stay updated with your account activity.
          </p>
        </div>

        <button
          className="notification-close"
          onClick={onClose}
          aria-label="Close notifications"
        >
          <X size={17} />
        </button>
      </div>

      {notifications.length > 0 && (
        <div className="notification-actions">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="notification-action"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          )}

          <button
            onClick={clearNotifications}
            className="notification-action danger"
          >
            <Trash2 size={14} />
            Clear all
          </button>
        </div>
      )}

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="notification-empty">
            <div className="notification-empty-icon">
              <Bell size={23} />
            </div>

            <h4>No notifications</h4>

            <p>
              You're all caught up. New activity will
              appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon =
              notificationIcons[notification.type] ||
              Info;

            return (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.read
                    ? "is-read"
                    : "is-unread"
                }`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                }}
              >
                <div
                  className={`notification-item-icon notification-${notification.type}`}
                >
                  <Icon size={17} />
                </div>

                <div className="notification-item-content">
                  <div className="notification-item-top">
                    <strong>
                      {notification.title}
                    </strong>

                    {!notification.read && (
                      <span className="notification-unread-dot" />
                    )}
                  </div>

                  {notification.message && (
                    <p>{notification.message}</p>
                  )}

                  <span className="notification-time">
                    {formatNotificationTime(
                      notification.createdAt
                    )}
                  </span>
                </div>

                <div className="notification-item-actions">
                  {!notification.read && (
                    <button
                      className="notification-mark-read"
                      onClick={(event) => {
                        event.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      aria-label="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}

                  <button
                    className="notification-delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeNotification(
                        notification.id
                      );
                    }}
                    aria-label="Delete notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;