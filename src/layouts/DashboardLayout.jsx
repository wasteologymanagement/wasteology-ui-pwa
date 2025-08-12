import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/Sidebar";
import DashboardTopbar from "../components/Topbar";
import DashboardFooter from "../components/Footer";

const DashboardLayout = ({ role = "ADMIN" }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        role={role}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50 flex flex-col">
        <DashboardTopbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <Outlet /> {/* 👈 This is what renders child route elements */}
        </main>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
