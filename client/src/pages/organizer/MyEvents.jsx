import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/PageHeader";
import { fmtDate } from "../../components/helpers";

export default function MyEvents() {
  const toast = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const load = () => api.get("/organizer/events").then((res) => setEvents(res.data));
  useEffect(() => { load(); }, []);

  const remove = async (id, title) => {
    if (!window.confirm(`Remove "${title}"?`)) return;
    try {
      await api.delete(`/events/${id}`);
      toast("Event removed.", "🗑️");
      load();
    } catch (err) {
      toast(err.response?.data?.message || "Could not remove event.", "⚠️");
    }
  };

  return (
    <>
      <PageHeader title="My Events" sub={`${events.length} events created`} />
      <div style={{ marginBottom: 18 }}>
        <Link to="/organizer/events/new" className="btn btn-purple btn-sm" style={{ padding: "9px 18px", display: "inline-flex" }}>+ Create new event</Link>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Event</th><th>Date</th><th>Status</th><th>Registered</th><th></th></tr></thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td><b>{e.title}</b><div style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{e.category}</div></td>
                <td>{fmtDate(e.date)}</td>
                <td><span className={`badge ${e.status}`}>{e.status}</span></td>
                <td>{e.registeredCount}/{e.capacity}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/organizer/events/${e.id}/registrations`)}>Registrations</button>
                  <button className="btn btn-outline-purple btn-sm" onClick={() => navigate(`/organizer/events/${e.id}/edit`)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(e.id, e.title)}>Delete</button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--ink-faint)", padding: 20 }}>No events yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
