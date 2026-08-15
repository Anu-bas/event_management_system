import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/PageHeader";
import { fmtDate } from "../../components/helpers";

export default function Events() {
  const toast = useToast();
  const [events, setEvents] = useState([]);

  const load = () => api.get("/admin/events").then((res) => setEvents(res.data));
  useEffect(() => { load(); }, []);

  const remove = async (id, title) => {
    if (!window.confirm(`Remove "${title}" from the platform?`)) return;
    await api.delete(`/events/${id}`);
    toast("Event removed.", "🗑️");
    load();
  };

  return (
    <>
      <PageHeader title="Event Management" sub={`${events.length} events across the platform`} />
      <div className="card">
        <table className="table">
          <thead><tr><th>Event</th><th>Organizer</th><th>Date</th><th>Status</th><th>Registered</th><th></th></tr></thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td><b>{e.title}</b><div style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{e.category}</div></td>
                <td>{e.organizer?.name}</td>
                <td>{fmtDate(e.date)}</td>
                <td><span className={`badge ${e.status}`}>{e.status}</span></td>
                <td>{e.registeredCount}/{e.capacity}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => remove(e.id, e.title)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
