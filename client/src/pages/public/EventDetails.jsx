import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { fmtDate, fmtTime, initials } from "../../components/helpers";
import NotFound from "./NotFound";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [myReg, setMyReg] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    api
      .get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(() => setNotFound(true));
    if (user && user.role === "participant") {
      api.get("/registrations/mine").then((res) => {
        const active = res.data.find((r) => (r.event?._id || r.event?.id) === id && r.status !== "cancelled");
        setMyReg(active || null);
      });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  if (notFound) return <NotFound />;
  if (!event) return <div style={{ padding: 60, textAlign: "center", color: "var(--ink-faint)" }}>Loading…</div>;

  const reg = event.registeredCount || 0;
  const pct = Math.min(100, Math.round((reg / event.capacity) * 100));

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      toast("Log in to register for this event.", "🔒");
      return;
    }
    if (user.role !== "participant") {
      toast("Only participant accounts can register for events.", "⚠️");
      return;
    }
    setLoading(true);
    try {
      await api.post("/registrations", { eventId: event.id });
      toast(`Registered for ${event.title}!`, "🎟️");
      navigate("/registrations");
    } catch (err) {
      toast(err.response?.data?.message || "Registration failed.", "⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ maxWidth: 980, margin: "0 auto", padding: "40px 40px 90px" }}>
      <div className="breadcrumb">
        <Link to="/events">Events</Link> <span>/</span> <span>{event.title}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <span className={`badge ${event.status}`}>{event.status}</span>
            <span className="tag">{event.category}</span>
          </div>
          <h1 style={{ fontSize: 30, lineHeight: 1.2, marginBottom: 18 }}>{event.title}</h1>
          <p style={{ color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>{event.desc}</p>
          <div className="tag-row" style={{ marginBottom: 30 }}>
            {(event.tags || []).map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
          <div className="card" style={{ padding: 20, marginBottom: 24 }}>
            <div className="section-title" style={{ marginBottom: 14 }}>Hosted by</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="avatar" style={{ background: "var(--purple)" }}>{initials(event.organizer?.name)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{event.organizer?.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>Event Organizer</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 22, position: "sticky", top: 90 }}>
          <div className="ticket-date-band" style={{ background: `var(--${event.color})`, borderRadius: 6, height: 8, marginBottom: 16 }}></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span>📅</span>
              <div><div style={{ fontWeight: 600, fontSize: 13.5 }}>{fmtDate(event.date)}</div><div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>{fmtTime(event.time)}</div></div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span>📍</span><div style={{ fontSize: 13.5, fontWeight: 600 }}>{event.venue}</div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span>💳</span><div style={{ fontSize: 13.5, fontWeight: 600 }}>{event.price === 0 ? "Free entry" : `₹${event.price} per ticket`}</div>
            </div>
          </div>
          <div className="progressbar" style={{ marginBottom: 6 }}>
            <div style={{ width: `${pct}%`, background: `var(--${event.color})` }}></div>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 18 }}>{reg} of {event.capacity} spots filled</div>

          {myReg ? (
            <button className="btn btn-block" style={{ background: "var(--green-bg)", color: "var(--green-deep)" }} disabled>
              ✓ You're registered
            </button>
          ) : event.status !== "open" ? (
            <button className="btn btn-block btn-ghost" disabled>
              Registration {event.status === "draft" ? "not yet open" : "closed"}
            </button>
          ) : (
            <button className="btn btn-primary btn-block" style={{ padding: 13 }} onClick={handleRegister} disabled={loading}>
              {loading ? "Registering…" : "Register now →"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
