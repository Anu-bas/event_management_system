import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";
import { fmtDate, fmtTime } from "../../components/helpers";

export default function Dashboard() {
  const { user } = useAuth();
  const [regs, setRegs] = useState([]);

  useEffect(() => {
    api.get("/registrations/mine").then((res) => setRegs(res.data)).catch(() => { });
  }, []);

  const active = regs.filter((r) => r.status !== "cancelled");
  const upcoming = active
    .filter((r) => r.event && new Date(r.event.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(" ")[0]}`} sub="Here's what's coming up for you." />
      <div className="grid grid-3" style={{ marginBottom: 30 }}>
        <div className="stat-card"><div className="lbl">Active registrations</div><div className="num">{active.length}</div></div>
        <div className="stat-card"><div className="lbl">Confirmed tickets</div><div className="num">{active.filter((r) => r.status === "confirmed").length}</div></div>
      </div>

      <div className="section-title">Upcoming events</div>

      <div className="card">
        {upcoming.length === 0 ? (
          <div
            style={{
              padding: 18,
              fontSize: 13,
              color: "var(--ink-faint)",
            }}
          >
            No upcoming registrations.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Code</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {upcoming.map((r) => (
                <tr key={r._id}>
                  <td><b>{r.event.title}</b></td>
                  <td>{fmtDate(r.event.date)} · {fmtTime(r.event.time)}</td>
                  <td className="mono">{r.code}</td>
                  <td>
                    <span className={`badge ${r.status}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div
          style={{
            padding: "15px 18px",
            borderTop: "1px solid var(--border)",
            textAlign: "right",
          }}
        >
          <Link
            to="/events"
            style={{
              color: "var(--blue)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <p style={{ fontWeight: 1000, fontSize: 12, color: "rgb(241,116,116)" }}>Browse More Events →</p>
          </Link>
        </div>
      </div>
    </>
  );
}
