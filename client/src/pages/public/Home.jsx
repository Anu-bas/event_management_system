import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import TicketCard from "../../components/TicketCard";

export default function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/events").then((res) => setEvents(res.data)).catch(() => {});
  }, []);

  const featured = events.filter((e) => e.status === "open").slice(0, 3);
  const openCount = events.filter((e) => e.status === "open").length;

  return (
    <>
      <section style={{ padding: "84px 40px 70px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 60, alignItems: "center" }}>
          <div>
            <div className="tag" style={{ background: "var(--blue-bg)", color: "var(--blue-deep)", border: "none", marginBottom: 18, display: "inline-block" }}>
              🎟️ {openCount} events open for registration
            </div>
            <h1 style={{ fontSize: 50, lineHeight: 1.05, marginBottom: 18 }}>
              Find your next event.<br />Register in a click.
            </h1>
            <p style={{ fontSize: 16.5, color: "var(--ink-soft)", lineHeight: 1.6, maxWidth: 480, marginBottom: 28 }}>
              Eventra brings campus workshops, hackathons, panels, and meetups into one place — browse, register, and get your ticket instantly.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-primary" style={{ padding: "13px 24px" }} onClick={() => navigate("/events")}>
                Browse Events →
              </button>
              <button className="btn btn-ghost" style={{ padding: "13px 24px" }} onClick={() => navigate("/register")}>
                Create account
              </button>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 42 }}>
              <div><div className="display" style={{ fontSize: 24, fontWeight: 700 }}>{events.length}+</div><div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>Events hosted</div></div>
              <div><div className="display" style={{ fontSize: 24, fontWeight: 700 }}>{events.reduce((s, e) => s + (e.registeredCount || 0), 0)}</div><div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>Registrations</div></div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            {events[0] && <TicketCard event={events[0]} big />}
          </div>
        </div>
      </section>

      <section style={{ padding: "50px 40px 80px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h2 style={{ fontSize: 24 }}>Open for registration</h2>
          <Link to="/events" style={{ fontSize: 14, fontWeight: 600, color: "var(--blue)" }}>View all events →</Link>
        </div>
        <div className="grid grid-3">
          {featured.map((e) => (
            <TicketCard key={e.id} event={e} />
          ))}
        </div>
      </section>

      <section style={{ background: "var(--ink)", padding: "64px 40px", color: "white" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 40 }}>
          <div>
            <h2 style={{ fontSize: 26, marginBottom: 8, color: "white" }}>Organizing an event?</h2>
            <p style={{ color: "#94A3B8", fontSize: 14.5, maxWidth: 420 }}>
              Apply for an organizer account to create events, manage participants, and track attendance — all from one dashboard.
            </p>
          </div>
          <button className="btn" style={{ background: "white", color: "var(--ink)", padding: "13px 24px", flexShrink: 0 }} onClick={() => navigate("/register")}>
            Apply as Organizer
          </button>
        </div>
      </section>
    </>
  );
}
