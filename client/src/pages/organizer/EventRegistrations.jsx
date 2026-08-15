import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/PageHeader";

export default function EventRegistrations() {
  const { id } = useParams();
  const toast = useToast();
  const [regs, setRegs] = useState([]);
  const [event, setEvent] = useState(null);

  const load = () => {
    api.get(`/registrations/event/${id}`).then((res) => setRegs(res.data));
    api.get(`/events/${id}`).then((res) => setEvent(res.data));
  };
  useEffect(() => { load(); }, [id]);

  const checkin = async (regId) => {
    await api.put(`/registrations/${regId}/checkin`);
    load();
  };

  return (
    <>
      <PageHeader title={event ? `Registrations — ${event.title}` : "Registrations"} sub={`${regs.length} total registrations`} />
      <div className="card">
        <table className="table">
          <thead><tr><th>Participant</th><th>Email</th><th>Code</th><th>Status</th><th>Checked in</th></tr></thead>
          <tbody>
            {regs.map((r) => (
              <tr key={r._id}>
                <td><b>{r.user?.name}</b></td>
                <td>{r.user?.email}</td>
                <td className="mono">{r.code}</td>
                <td><span className={`badge ${r.status}`}>{r.status}</span></td>
                <td>
                  <button className={`btn btn-sm ${r.checkedIn ? "btn-outline-green" : "btn-ghost"}`} onClick={() => checkin(r._id)}>
                    {r.checkedIn ? "✓ Checked in" : "Check in"}
                  </button>
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
