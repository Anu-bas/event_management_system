import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer-public">
      <div>© 2026 Eventra — Event Registration & Management System</div>
      <div style={{ display: "flex", gap: 22 }}>
        <Link to="/about" style={{ color: "inherit" }}>About</Link>
        <Link to="/contact" style={{ color: "inherit" }}>Contact</Link>
        <Link to="/events" style={{ color: "inherit" }}>Browse Events</Link>
      </div>
    </footer>
  );
}
