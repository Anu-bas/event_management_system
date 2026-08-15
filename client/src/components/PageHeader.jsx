import React from "react";

export default function PageHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <h1 style={{ fontSize: 24 }}>{title}</h1>
      {sub && <p style={{ color: "var(--ink-faint)", fontSize: 13.5, marginTop: 4 }}>{sub}</p>}
    </div>
  );
}
