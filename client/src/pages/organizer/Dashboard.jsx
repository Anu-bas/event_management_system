import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/organizer/stats").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(" ")[0]}`} sub="Here's how your events are performing." />
      {stats && (
        <div className="grid grid-4" style={{ marginBottom: 30 }}>
          <div className="stat-card"><div className="lbl">Total events</div><div className="num">{stats.totalEvents}</div></div>
          <div className="stat-card"><div className="lbl">Open for registration</div><div className="num">{stats.openEvents}</div></div>
          <div className="stat-card"><div className="lbl">Total registrations</div><div className="num">{stats.totalRegistrations}</div></div>
          <div className="stat-card"><div className="lbl">Revenue</div><div className="num">₹{stats.totalRevenue}</div></div>
        </div>
      )}
      <Link to="/organizer/events/new" className="btn btn-purple btn-sm" style={{ padding: "9px 18px", display: "inline-flex" }}>+ Create new event</Link>
    </>
  );
}
