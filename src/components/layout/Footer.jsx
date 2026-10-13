import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Headset,
  ArrowUpRight
} from "lucide-react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/dashboard" className="footer-logo">
            <span className="footer-logo-icon">
              <LayoutDashboard size={22} />
            </span>
            <span>SaaS<span className="footer-logo-accent">Flow</span></span>
          </Link>

          <p className="footer-description">
            Manage users, subscriptions, plans and business analytics
            from one simple workspace.
          </p>

          <span className="footer-status">
            <span className="footer-status-dot" />
            Dashboard workspace
          </span>
        </div>

        <div className="footer-column">
          <h3>Product</h3>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/users">User Management</Link>
          <Link to="/plans">Pricing Plans</Link>
          <Link to="/subscriptions">Subscriptions</Link>
        </div>

        <div className="footer-column">
          <h3>Analytics</h3>
          <Link to="/usage-analytics">Usage Analytics</Link>
          <Link to="/revenue-analytics">Revenue Analytics</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/reports">Reports</Link>
        </div>

        <div className="footer-column">
          <h3>Workspace</h3>
          <Link to="/settings">Settings</Link>
          <a href="mailto:support@example.com">
            <Headset size={16} />
            Contact Support
            <ArrowUpRight size={14} />
          </a>
          <Link to="/dashboard">Overview</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} SaaSFlow. All rights reserved.</p>

        <div className="footer-bottom-links">
          <span>Built for better business management</span>
          <span className="footer-version">Dashboard v1.0</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;