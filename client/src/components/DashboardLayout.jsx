import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ title, sub }) {
  return (
    <div className="appshell">
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1200 }}>
        <Outlet />
      </main>
    </div>
  );
}
