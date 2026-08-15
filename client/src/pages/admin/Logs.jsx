import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import PageHeader from "../../components/PageHeader";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/admin/logs").then((res) => setLogs(res.data));
  }, []);

  return (
    <>
      <PageHeader title="Activity Logs" sub="Full audit trail of platform actions" />
      <div className="card">
        <table className="table">
          <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th></tr></thead>
          <tbody>
            {logs.map((a) => (
              <tr key={a._id}>
                <td className="mono" style={{ fontSize: 12 }}>{new Date(a.createdAt).toLocaleString()}</td>
                <td><b>{a.actor}</b></td><td>{a.action}</td><td>{a.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
