import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/PageHeader";
import { fmtDate, fmtTime } from "../../components/helpers";

export default function MyRegistrations() {
  const toast = useToast();
  const [regs, setRegs] = useState([]);

  const load = () => api.get("/registrations/mine").then((res) => setRegs(res.data));

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this registration?")) return;
    try {
      await api.put(`/registrations/${id}/cancel`);
      toast("Registration cancelled.", "✓");
      load();
    } catch (err) {
      toast(err.response?.data?.message || "Could not cancel.", "⚠️");
    }
  };

  return (
    <>
      <PageHeader title="My Registrations" sub={`${regs.length} total registrations`} />
      <div className="card">
        <table className="table">
          <thead><tr><th>Event</th><th>Date</th><th>Code</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {regs.map((r) => (
              <tr key={r._id}>
                <td><b>{r.event?.title || "(deleted event)"}</b></td>
                <td>{r.event ? `${fmtDate(r.event.date)} · ${fmtTime(r.event.time)}` : "—"}</td>
                <td className="mono">{r.code}</td>
                <td><span className={`badge ${r.status}`}>{r.status}</span></td>
                <td>
                  {r.status !== "cancelled" && (
                    <button className="btn btn-danger btn-sm" onClick={() => cancel(r._id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
            {regs.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--ink-faint)", padding: 20 }}>No registrations yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
