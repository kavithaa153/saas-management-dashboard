
import {
  Activity,
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  Repeat2,
  Settings,
  UserRound,
  Users,
  X
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard"
  },
  {
    title: "Users",
    icon: Users,
    path: "/users"
  },
  {
    title: "Plans",
    icon: CreditCard,
    path: "/plans"
  },
  {
    title: "Subscriptions",
    icon: Repeat2,
    path: "/subscriptions"
  },
  {
    title: "Usage Analytics",
    icon: Activity,
    path: "/usage-analytics"
  },
  {
    title: "Revenue Analytics",
    icon: BarChart3,
    path: "/revenue-analytics"
  },
  {
    title: "Customers",
    icon: UserRound,
    path: "/customers"
  },
  {
    title: "Reports",
    icon: FileText,
    path: "/reports"
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings"
  }
];

function Sidebar({
  mobileOpen = false,
  onNavigate = () => {}
}) {
  return (
    <aside
      className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}
    >
      <div className="sidebar-brand">
        <div className="brand-mark">SF</div>

        <div>
          <strong>SaaSFlow</strong>
          <span>Management</span>
        </div>

        <button
          type="button"
          className="mobile-sidebar-close"
          onClick={onNavigate}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <div className="sidebar-section-title">
        MAIN MENU
      </div>

      <nav className="sidebar-navigation">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
            >
              <Icon size={18} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-upgrade">
        <div className="upgrade-icon">SF</div>
        <strong>Upgrade to Pro</strong>

        <p>
          Unlock advanced analytics and premium
          workspace features.
        </p>

        <button
          type="button"
          onClick={() => onNavigate()}
        >
          Upgrade Now
        </button>
      </div>

      <div className="sidebar-footer">
        <span>SaaSFlow v1.0</span>
      </div>
    </aside>
  );
}

export default Sidebar;
