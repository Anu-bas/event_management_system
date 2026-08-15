import React from "react";
import { useNavigate } from "react-router-dom";
import { fmtTime, monthAbbr, dayNum } from "./helpers";

export default function TicketCard({ event, big = false }) {
  const navigate = useNavigate();
  const reg = event.registeredCount || 0;
  const pct = Math.min(100, Math.round((reg / event.capacity) * 100));

  return (
    <div
      className="ticket"
      style={{ cursor: "pointer", ...(big ? { maxWidth: 380 } : {}) }}
      onClick={() => navigate(`/event/${event.id || event._id}`)}
    >
      <div className="ticket-main">
        <div className="ticket-date-band" style={{ background: `var(--${event.color})` }}></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 12 }}>
          <span className={`badge ${event.status}`}>{event.status}</span>
          <span className="tag">{event.category}</span>
        </div>
        <h3 style={{ fontSize: 16.5, margin: "12px 0 6px", lineHeight: 1.3 }}>{event.title}</h3>
        <div style={{ fontSize: 13, color: "var(--ink-faint)", display: "flex", flexDirection: "column", gap: 3 }}>
          <span>📍 {event.venue}</span>
          <span>
            🕐 {fmtTime(event.time)} · {event.price === 0 ? "Free" : "₹" + event.price}
          </span>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="progressbar">
            <div style={{ width: `${pct}%`, background: `var(--${event.color})` }}></div>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: 5 }}>
            {reg}/{event.capacity} registered
          </div>
        </div>
      </div>
      <div className="ticket-stub">
        <div className="month" style={{ color: `var(--${event.color})` }}>{monthAbbr(event.date)}</div>
        <div className="day">{dayNum(event.date)}</div>
      </div>
    </div>
  );
}
