import React from "react";

export default function About() {
  return (
    <section style={{ maxWidth: 880, margin: "0 auto", padding: "70px 40px 90px" }}>
      <div className="tag" style={{ background: "var(--purple-bg)", color: "var(--purple-deep)", border: "none", marginBottom: 16, display: "inline-block" }}>
        About Eventra
      </div>
      <h1 style={{ fontSize: 38, marginBottom: 18 }}>Built so campus events stop living in group chats.</h1>
      <p style={{ fontSize: 16, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 40 }}>
        Eventra brings event sign-ups out of scattered forms, spreadsheets, and screenshots and into a single system —
        organizers publish events, participants register and hold a real ticket, and admins keep the whole platform healthy.
      </p>
      <div className="grid grid-3" style={{ marginBottom: 50 }}>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>🎯</div>
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>One source of truth</h3>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>Every event, registration, and attendee record lives in one place — no more duplicate spreadsheets.</p>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>⚡</div>
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>Instant registration</h3>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>Participants get a confirmed ticket the moment they register — no manual approval bottlenecks for free events.</p>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 24, marginBottom: 10 }}>🛡️</div>
          <h3 style={{ fontSize: 15, marginBottom: 6 }}>Role-based control</h3>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>Participants, organizers, and admins each see exactly what they need — nothing more.</p>
        </div>
      </div>
    </section>
  );
}
