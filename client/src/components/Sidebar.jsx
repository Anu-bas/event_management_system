import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { initials } from "./helpers";

const NAVS = {
  participant: {
    color: "blue",
    label: "Participant",
    links: [
      { to: "/dashboard", label: "Dashboard", icon: "🏠" },
      { to: "/registrations", label: "My Registrations", icon: "🎟️" },
      { to: "/notifications", label: "Notifications", icon: "🔔" },
      { to: "/profile", label: "Profile", icon: "👤" },
    ],
  },
  organizer: {
    color: "purple",
    label: "Organizer",
    links: [
      { to: "/organizer", label: "Dashboard", icon: "🏠", end: true },
      { to: "/organizer/events", label: "My Events", icon: "📅" },
      { to: "/organizer/events/new", label: "Create Event", icon: "➕" },
      { to: "/organizer/profile", label: "Profile", icon: "👤" },
    ],
  },
  admin: {
    color: "orange",
    label: "Admin",
    links: [
      { to: "/admin", label: "Dashboard", icon: "🏠", end: true },
      { to: "/admin/organizers", label: "Organizers", icon: "🗂️" },
      { to: "/admin/events", label: "Events", icon: "📅" },
      { to: "/admin/registrations", label: "Registrations", icon: "🎟️" },
      { to: "/admin/reports", label: "Reports", icon: "📊" },
      { to: "/admin/settings", label: "Settings", icon: "⚙️" },
      { to: "/admin/logs", label: "Activity Logs", icon: "🧾" },
    ],
  },
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const conf = NAVS[user.role];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="brand" onClick={() => navigate("/")}>
        <span className="mark">E</span> Eventra
      </div>
      <span className={`role-chip ${conf.color}`}>{conf.label}</span>
      <nav className="side-nav">
        {conf.links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `side-link${isActive ? ` active ${conf.color}` : ""}`}
          >
            <span className="ic">{l.icon}</span> {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="avatar" style={{ background: `var(--${conf.color})` }}>
          {initials(user.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.name}
          </div>
          <button
            onClick={handleLogout}
            style={{ fontSize: 12, color: "var(--ink-faint)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
