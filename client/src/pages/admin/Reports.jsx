import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/reports").then((res) => setData(res.data));
  }, []);

  if (!data) return null;
  const maxVal = Math.max(...Object.values(data.byCategory), 1);

  return (
    <>
      <PageHeader title="Reports & Analytics" sub="Platform-wide performance" />
      <div className="grid grid-4" style={{ marginBottom: 28 }}>
        <div className="stat-card"><div className="lbl">Avg. fill rate</div><div className="num">{data.avgFillRate}%</div><div className="delta up">platform-wide</div></div>
        <div className="stat-card"><div className="lbl">Active organizers</div><div className="num">{data.organizerCount}</div><div className="delta">hosting events</div></div>
        <div className="stat-card"><div className="lbl">Cancelled regs</div><div className="num">{data.cancelledCount}</div><div className="delta down">of {data.totalRegistrations} total</div></div>
      </div>
      <div className="section-title">Registrations by category</div>
      <div className="card" style={{ padding: 20 }}>
        {Object.entries(data.byCategory).map(([cat, count]) => {
          const pct = Math.round((count / maxVal) * 100);
          return (
            <div style={{ marginBottom: 14 }} key={cat}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                <b>{cat}</b><span className="mono" style={{ color: "var(--ink-faint)" }}>{count}</span>
              </div>
              <div className="progressbar"><div style={{ width: `${pct}%`, background: "var(--orange)" }}></div></div>
            </div>
          );
        })}
      </div>
    </>
  );
}
