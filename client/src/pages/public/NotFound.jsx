import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty-state" style={{ padding: "100px 40px" }}>
      <div className="ic">🧭</div>
      <h3>Page not found</h3>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary btn-sm" style={{ marginTop: 14, display: "inline-flex" }}>Back home</Link>
    </div>
  );
}
