import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

export default function Notifications() {
  const [notes, setNotes] = useState([]);

  const load = () => api.get("/notifications").then((res) => setNotes(res.data));
  useEffect(() => { load(); }, []);

  const markAll = async () => {
    await api.put("/notifications/read-all");
    load();
  };

  return (
    <>
      <PageHeader title="Notifications" sub="Updates about your registrations" />
      {notes.length > 0 && (
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={markAll}>Mark all as read</button>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notes.map((n) => (
          <div key={n._id} className="card" style={{ padding: 16, opacity: n.read ? 0.6 : 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13.5 }}>{n.text}</span>
            <span style={{ fontSize: 11.5, color: "var(--ink-faint)", whiteSpace: "nowrap" }}>{new Date(n.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="empty-state"><div className="ic">🔔</div><h3>No notifications</h3><p>You're all caught up.</p></div>
        )}
      </div>
    </>
  );
}
