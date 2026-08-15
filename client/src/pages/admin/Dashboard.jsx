import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(" ")[0]}`} sub="Platform-wide overview" />
      {stats && (
        <div className="grid grid-4">
          <div className="stat-card"><div className="lbl">Total users</div><div className="num">{stats.userCount}</div></div>
          <div className="stat-card"><div className="lbl">Total events</div><div className="num">{stats.eventCount}</div></div>
          <div className="stat-card"><div className="lbl">Registrations</div><div className="num">{stats.registrationCount}</div></div>
          <div className="stat-card"><div className="lbl">Pending organizers</div><div className="num">{stats.pendingOrganizers}</div></div>
        </div>
      )}
    </>
  );
}
