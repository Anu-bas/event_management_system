import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import TicketCard from "../../components/TicketCard";

export default function EventsListing() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/events").then((res) => setEvents(res.data)).catch(() => {});
  }, []);

  const categories = useMemo(() => [...new Set(events.map((e) => e.category))], [events]);
  const list = filter === "all" ? events : events.filter((e) => e.category === filter);

  return (
    <section style={{ maxWidth: 1180, margin: "0 auto", padding: "50px 40px 90px" }}>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>Browse events</h1>
      <p style={{ color: "var(--ink-faint)", fontSize: 14.5, marginBottom: 28 }}>
        {events.filter((e) => e.status === "open").length} open for registration · {events.length} total
      </p>
      <div style={{ display: "flex", gap: 10, marginBottom: 30, flexWrap: "wrap" }}>
        <button
          className="btn btn-ghost btn-sm"
          style={filter === "all" ? { background: "var(--ink)", color: "white", border: "none" } : {}}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className="btn btn-ghost btn-sm"
            style={filter === c ? { background: "var(--ink)", color: "white", border: "none" } : {}}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-3">
        {list.length ? (
          list.map((e) => <TicketCard key={e.id} event={e} />)
        ) : (
          <div className="empty-state" style={{ gridColumn: "1/-1" }}>
            <div className="ic">🔍</div>
            <h3>No events in this category</h3>
            <p>Try a different filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}
