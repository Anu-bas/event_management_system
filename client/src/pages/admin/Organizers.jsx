import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/PageHeader";
import { fmtDate } from "../../components/helpers";

export default function Organizers() {
  const toast = useToast();
  const [pending, setPending] = useState([]);
  const [organizers, setOrganizers] = useState([]);

  const load = () => {
    api.get("/admin/organizers/pending").then((res) => setPending(res.data));
    api.get("/admin/organizers").then((res) => setOrganizers(res.data));
  };
  useEffect(() => { load(); }, []);

  const approve = async (id, name) => {
    try {
      await api.put(`/admin/organizers/${id}/approve`);
      toast(`${name} approved as organizer.`, "✓");
      load();
    } catch (err) {
      toast(err.response?.data?.message || "Could not approve.", "⚠️");
    }
  };
  const reject = async (id, name) => {
    await api.put(`/admin/organizers/${id}/reject`);
    toast(`${name}'s application was rejected.`, "✕");
    load();
  };

  return (
    <>
      <PageHeader title="Organizer Management" sub="Approve applications and manage organizer accounts" />
      <div className="section-title">Pending applications</div>
      {pending.length ? (
        <div className="card" style={{ marginBottom: 26 }}>
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Organization</th><th>Applied</th><th>Actions</th></tr></thead>
            <tbody>
              {pending.map((o) => (
                <tr key={o._id}>
                  <td><b>{o.name}</b></td><td>{o.email}</td><td>{o.org}</td><td>{fmtDate(o.createdAt.slice(0,10))}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-outline-green btn-sm" onClick={() => approve(o._id, o.name)}>Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={() => reject(o._id, o.name)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ padding: 18, marginBottom: 26, fontSize: 13, color: "var(--ink-faint)" }}>No pending applications.</div>
      )}

      <div className="section-title">Active organizers</div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Events created</th><th>Joined</th></tr></thead>
          <tbody>
            {organizers.map((o) => (
              <tr key={o._id}>
                <td><b>{o.name}</b></td><td>{o.email}</td><td>{o.eventCount}</td><td>{fmtDate(o.createdAt.slice(0,10))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
