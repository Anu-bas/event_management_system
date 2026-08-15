import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import { fmtDate } from "../../components/helpers";

export default function Registrations() {
  const [regs, setRegs] = useState([]);

  useEffect(() => {
    api.get("/admin/registrations").then((res) => setRegs(res.data));
  }, []);

  return (
    <>
      <PageHeader title="Registration Management" sub={`${regs.length} registrations platform-wide`} />
      <div className="card">
        <table className="table">
          <thead><tr><th>Participant</th><th>Event</th><th>Code</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {regs.map((r) => (
              <tr key={r._id}>
                <td><b>{r.user?.name}</b></td>
                <td>{r.event?.title || "(deleted)"}</td>
                <td className="mono">{r.code}</td>
                <td><span className={`badge ${r.status}`}>{r.status}</span></td>
                <td>{fmtDate(r.createdAt.slice(0,10))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
