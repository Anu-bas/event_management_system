import React, { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/PageHeader";

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/auth/me", { name, password: password || undefined });
      setUser({ ...user, name: res.data.name });
      setPassword("");
      toast("Profile updated.", "✓");
    } catch (err) {
      toast(err.response?.data?.message || "Could not update profile.", "⚠️");
    }
  };

  return (
    <>
      <PageHeader title="Profile" sub="Manage your account details" />
      <div className="card" style={{ padding: 24, maxWidth: 480 }}>
        <form onSubmit={submit}>
          <div className="formfield">
            <label>Full name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="formfield">
            <label>Email address</label>
            <input className="input" value={user.email} disabled />
          </div>
          <div className="formfield">
            <label>New password (optional)</label>
            <input className="input" type="password" placeholder="Leave blank to keep current password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-blue btn-sm" style={{ padding: "9px 18px" }}>Save changes</button>
        </form>
      </div>
    </>
  );
}
