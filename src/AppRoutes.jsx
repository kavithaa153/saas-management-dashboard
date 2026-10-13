import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/Users/Users";
import Plans from "./pages/Plans/Plans";
import Subscriptions from "./pages/subscriptions/Subscriptions";
import UsageAnalytics from "./pages/UsageAnalytics/UsageAnalytics";
import RevenueAnalytics from "./pages/RevenueAnalytics/RevenueAnalytics";
import Customers from "./pages/Customers/Customers";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/users"
        element={<Users />}
      />

      <Route
        path="/plans"
        element={<Plans />}
      />

      <Route
        path="/subscriptions"
        element={<Subscriptions />}
      />

      <Route
        path="/usage-analytics"
        element={<UsageAnalytics />}
      />

      <Route
        path="/revenue-analytics"
        element={<RevenueAnalytics />}
      />

      <Route
        path="/customers"
        element={<Customers />}
      />

      <Route
        path="/reports"
        element={<Reports />}
      />

      <Route
        path="/settings"
        element={<Settings />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRoutes;