import { useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import ToastContainer from "../common/ToastContainer";

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="app-shell">
      <Sidebar
        mobileOpen={sidebarOpen}
        onNavigate={closeSidebar}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="mobile-sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close navigation menu"
        />
      )}

      <div className="app-main">
        <Header
          onMenuClick={() =>
            setSidebarOpen((current) => !current)
          }
        />

        <main className="page-content" key={location.pathname}>
          {children}
        </main>

        <Footer />
      </div>

      <ToastContainer />
    </div>
  );
}

export default AppLayout;