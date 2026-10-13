
import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Lock,
  Palette,
  Save,
  Shield,
  User
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";

import "./Settings.css";

function Settings() {
  const { state, dispatch } = useApp();
  const { success, error } = useToast();

  const [profile, setProfile] = useState({
    name: "SaaSFlow Admin",
    email: "admin@saasflow.com",
    company: "SaaSFlow"
  });

  const [notifications, setNotifications] = useState({
    email: true,
    subscription: true,
    payment: true,
    product: false
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true
  });

  const [activeTab, setActiveTab] = useState("profile");

  const [theme, setTheme] = useState(
    state.preferences?.theme || "light"
  );

  useEffect(() => {
    const savedTheme = state.preferences?.theme || "light";

    document.documentElement.setAttribute(
      "data-theme",
      savedTheme
    );

    document.body.setAttribute("data-theme", savedTheme);

    setTheme(savedTheme);
  }, [state.preferences?.theme]);

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value
    }));
  }

  function saveProfile(event) {
    event.preventDefault();

    success(
      "Profile updated",
      "Your profile information has been saved."
    );
  }

  function handleThemeChange(value) {
    if (value !== "light" && value !== "dark") {
      return;
    }

    document.documentElement.setAttribute(
      "data-theme",
      value
    );

    document.body.setAttribute("data-theme", value);

    setTheme(value);

    dispatch({
      type: "SET_PREFERENCES",
      payload: {
        ...state.preferences,
        theme: value
      }
    });

    success(
      "Appearance updated",
      `Theme changed to ${value}.`
    );
  }

  function toggleNotification(name) {
    setNotifications((current) => ({
      ...current,
      [name]: !current[name]
    }));
  }

  function toggleSecurity(name) {
    setSecurity((current) => ({
      ...current,
      [name]: !current[name]
    }));
  }

  return (
    <section className="settings-page">
      <div className="settings-hero">
        <div>
          <span className="settings-eyebrow">
            WORKSPACE CONFIGURATION
          </span>

          <h1>Settings</h1>

          <p>
            Manage your profile, notifications, appearance
            and security preferences.
          </p>
        </div>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <button
            type="button"
            className={
              activeTab === "profile"
                ? "settings-nav active"
                : "settings-nav"
            }
            onClick={() => setActiveTab("profile")}
          >
            <User size={17} />
            <span>Profile</span>
          </button>

          <button
            type="button"
            className={
              activeTab === "notifications"
                ? "settings-nav active"
                : "settings-nav"
            }
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={17} />
            <span>Notifications</span>
          </button>

          <button
            type="button"
            className={
              activeTab === "appearance"
                ? "settings-nav active"
                : "settings-nav"
            }
            onClick={() => setActiveTab("appearance")}
          >
            <Palette size={17} />
            <span>Appearance</span>
          </button>

          <button
            type="button"
            className={
              activeTab === "security"
                ? "settings-nav active"
                : "settings-nav"
            }
            onClick={() => setActiveTab("security")}
          >
            <Shield size={17} />
            <span>Security</span>
          </button>
        </aside>

        <div className="settings-content">
          {activeTab === "profile" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <div>
                  <span>ACCOUNT</span>
                  <h2>Profile Information</h2>
                  <p>Update your account details.</p>
                </div>

                <User size={20} />
              </div>

              <form
                className="settings-form"
                onSubmit={saveProfile}
              >
                <div className="settings-avatar">SA</div>

                <div className="settings-form-grid">
                  <div className="settings-field">
                    <label htmlFor="profile-name">
                      Full Name
                    </label>

                    <input
                      id="profile-name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="profile-email">
                      Email Address
                    </label>

                    <input
                      id="profile-email"
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="profile-company">
                      Company
                    </label>

                    <input
                      id="profile-company"
                      name="company"
                      value={profile.company}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>

                <div className="settings-form-actions">
                  <button
                    type="submit"
                    className="settings-primary-button"
                  >
                    <Save size={15} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <div>
                  <span>NOTIFICATIONS</span>
                  <h2>Notification Preferences</h2>
                  <p>
                    Choose which events you want to receive.
                  </p>
                </div>

                <Bell size={20} />
              </div>

              <div className="settings-options">
                {[
                  {
                    key: "email",
                    title: "Email Notifications",
                    description:
                      "Receive important workspace updates by email."
                  },
                  {
                    key: "subscription",
                    title: "Subscription Alerts",
                    description:
                      "Get notified about subscription changes."
                  },
                  {
                    key: "payment",
                    title: "Payment Alerts",
                    description:
                      "Receive payment and revenue notifications."
                  },
                  {
                    key: "product",
                    title: "Product Updates",
                    description:
                      "Receive news about new SaaSFlow features."
                  }
                ].map((item) => (
                  <div className="settings-option" key={item.key}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>

                    <button
                      type="button"
                      aria-label={`Toggle ${item.title}`}
                      aria-pressed={notifications[item.key]}
                      className={
                        notifications[item.key]
                          ? "settings-toggle active"
                          : "settings-toggle"
                      }
                      onClick={() =>
                        toggleNotification(item.key)
                      }
                    >
                      <span />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <div>
                  <span>APPEARANCE</span>
                  <h2>Workspace Appearance</h2>
                  <p>
                    Choose your preferred application theme.
                  </p>
                </div>

                <Palette size={20} />
              </div>

              <div className="theme-options">
                <button
                  type="button"
                  aria-pressed={theme === "light"}
                  className={
                    theme === "light"
                      ? "theme-card active"
                      : "theme-card"
                  }
                  onClick={() => handleThemeChange("light")}
                >
                  <div className="theme-preview light-preview">
                    <div />
                    <div />
                    <div />
                  </div>

                  <strong>Light</strong>

                  <span>
                    Clean and bright workspace
                  </span>

                  {theme === "light" && (
                    <Check size={16} />
                  )}
                </button>

                <button
                  type="button"
                  aria-pressed={theme === "dark"}
                  className={
                    theme === "dark"
                      ? "theme-card active"
                      : "theme-card"
                  }
                  onClick={() => handleThemeChange("dark")}
                >
                  <div className="theme-preview dark-preview">
                    <div />
                    <div />
                    <div />
                  </div>

                  <strong>Dark</strong>

                  <span>
                    Dark workspace appearance
                  </span>

                  {theme === "dark" && (
                    <Check size={16} />
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <div>
                  <span>SECURITY</span>
                  <h2>Security Settings</h2>
                  <p>
                    Protect your SaaSFlow workspace.
                  </p>
                </div>

                <Lock size={20} />
              </div>

              <div className="settings-options">
                <div className="settings-option">
                  <div>
                    <strong>
                      Two-Factor Authentication
                    </strong>

                    <span>
                      Add an additional verification step
                      to your account.
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle two-factor authentication"
                    aria-pressed={security.twoFactor}
                    className={
                      security.twoFactor
                        ? "settings-toggle active"
                        : "settings-toggle"
                    }
                    onClick={() =>
                      toggleSecurity("twoFactor")
                    }
                  >
                    <span />
                  </button>
                </div>

                <div className="settings-option">
                  <div>
                    <strong>Login Alerts</strong>

                    <span>
                      Receive alerts when a new login is detected.
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle login alerts"
                    aria-pressed={security.loginAlerts}
                    className={
                      security.loginAlerts
                        ? "settings-toggle active"
                        : "settings-toggle"
                    }
                    onClick={() =>
                      toggleSecurity("loginAlerts")
                    }
                  >
                    <span />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Settings;
