
import { useMemo, useState } from "react";
import {
  Menu,
  Search,
  Bell,
  CircleHelp,
  Sun,
  Moon,
  X,
  CheckCheck,
  Trash2,
  ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useApp } from "../../context/AppContext";
import { useNotifications } from "../../context/NotificationContext";

import "./Header.css";

function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  } = useNotifications();

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const users = state.users || [];
  const plans = state.plans || [];
  const subscriptions = state.subscriptions || [];

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    const userResults = users
      .filter((user) =>
        [
          user.name,
          user.email,
          user.company,
          user.id
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          )
      )
      .map((user) => ({
        id: user.id,
        title: user.name,
        subtitle: user.email,
        category: "User",
        path: "/users"
      }));

    const planResults = plans
      .filter((plan) =>
        [
          plan.name,
          plan.description,
          plan.id
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          )
      )
      .map((plan) => ({
        id: plan.id,
        title: plan.name,
        subtitle: `₹${plan.price} · ${plan.billingCycle}`,
        category: "Plan",
        path: "/plans"
      }));

    const subscriptionResults = subscriptions
      .filter((subscription) => {
        const user = users.find(
          (item) => item.id === subscription.userId
        );

        const plan = plans.find(
          (item) => item.id === subscription.planId
        );

        return [
          subscription.id,
          subscription.status,
          subscription.paymentStatus,
          user?.name,
          plan?.name
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );
      })
      .map((subscription) => ({
        id: subscription.id,
        title: subscription.id,
        subtitle: `${subscription.status} · ${subscription.paymentStatus}`,
        category: "Subscription",
        path: "/subscriptions"
      }));

    return [
      ...userResults,
      ...planResults,
      ...subscriptionResults
    ].slice(0, 8);
  }, [search, users, plans, subscriptions]);

  function openResult(result) {
    navigate(result.path);
    setSearch(result.title);
    setSearchOpen(false);
    setNotificationsOpen(false);
  }

  function toggleTheme() {
    const currentTheme =
      state.preferences?.theme || "light";

    dispatch({
      type: "SET_PREFERENCES",
      payload: {
        theme:
          currentTheme === "light" ? "dark" : "light"
      }
    });
  }

  function handleNotificationClick(notification) {
    markAsRead(notification.id);

    if (notification.entity?.path) {
      navigate(notification.entity.path);
      setNotificationsOpen(false);
    }
  }

  function formatNotificationDate(date) {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="header-menu-button"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
        >
          <Menu size={22} />
        </button>

        <div className="header-search-wrapper">
          <Search size={18} />

          <input
            type="search"
            value={search}
            placeholder="Search users, plans, subscriptions..."
            onChange={(event) => {
              setSearch(event.target.value);
              setSearchOpen(true);
              setNotificationsOpen(false);
            }}
            onFocus={() => {
              setSearchOpen(true);
              setNotificationsOpen(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setSearchOpen(false);
              }

              if (event.key === "Enter" && results[0]) {
                openResult(results[0]);
              }
            }}
            aria-label="Search application"
          />

          {search && (
            <button
              type="button"
              className="header-search-clear"
              onClick={() => {
                setSearch("");
                setSearchOpen(false);
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {searchOpen && search.trim() && (
            <div className="global-search-results">
              {results.length > 0 ? (
                results.map((result) => (
                  <button
                    type="button"
                    className="global-search-result"
                    key={`${result.category}-${result.id}`}
                    onClick={() => openResult(result)}
                  >
                    <span className="search-result-content">
                      <strong>{result.title}</strong>
                      <small>{result.subtitle}</small>
                    </span>

                    <span className="search-result-category">
                      {result.category}
                    </span>

                    <ArrowUpRight size={15} />
                  </button>
                ))
              ) : (
                <div className="global-search-empty">
                  <Search size={20} />
                  <strong>No results found</strong>
                  <span>Try another name or keyword.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="header-icon-button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {(state.preferences?.theme || "light") === "light" ? (
            <Moon size={19} />
          ) : (
            <Sun size={19} />
          )}
        </button>

        <button
          type="button"
          className="header-icon-button header-help-button"
          onClick={() =>
            window.alert(
              "Use the sidebar to navigate between dashboard modules. Contact your administrator for application support."
            )
          }
          aria-label="Help"
          title="Help"
        >
          <CircleHelp size={19} />
        </button>

        <div className="header-notification-wrapper">
          <button
            type="button"
            className="header-icon-button notification-trigger"
            onClick={() => {
              setNotificationsOpen((current) => !current);
              setSearchOpen(false);
            }}
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={notificationsOpen}
          >
            <Bell size={19} />

            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="notification-panel">
              <div className="notification-panel-header">
                <div>
                  <h3>Notifications</h3>
                  <p>
                    {unreadCount} unread notification
                    {unreadCount === 1 ? "" : "s"}
                  </p>
                </div>

                <button
                  type="button"
                  className="notification-close"
                  onClick={() => setNotificationsOpen(false)}
                  aria-label="Close notifications"
                >
                  <X size={17} />
                </button>
              </div>

              {notifications.length > 0 && (
                <div className="notification-panel-actions">
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    <CheckCheck size={15} />
                    Mark all read
                  </button>

                  <button
                    type="button"
                    onClick={clearNotifications}
                  >
                    <Trash2 size={15} />
                    Clear all
                  </button>
                </div>
              )}

              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      className={`notification-item ${
                        notification.read ? "" : "unread"
                      }`}
                      onClick={() =>
                        handleNotificationClick(notification)
                      }
                    >
                      <span
                        className={`notification-dot notification-dot-${notification.type}`}
                      />

                      <span className="notification-item-content">
                        <strong>{notification.title}</strong>

                        {notification.message && (
                          <span>{notification.message}</span>
                        )}

                        <small>
                          {formatNotificationDate(
                            notification.createdAt
                          )}
                        </small>
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="notification-empty">
                    <Bell size={25} />
                    <strong>You're all caught up</strong>
                    <span>
                      New notifications will appear here.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="header-profile">
          <div className="profile-avatar">K</div>

          <div className="profile-details">
            <strong>Kavitha</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>

      {(searchOpen || notificationsOpen) && (
        <button
          type="button"
          className="header-dismiss-layer"
          onClick={() => {
            setSearchOpen(false);
            setNotificationsOpen(false);
          }}
          aria-label="Close open header panels"
        />
      )}
    </header>
  );
}

export default Header;
