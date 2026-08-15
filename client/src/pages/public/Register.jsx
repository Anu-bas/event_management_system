import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState("participant");
  const [form, setForm] = useState({ name: "", email: "", password: "", organization: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register({ ...form, role });
      if (res.applied) {
        toast("Account created. Organizer access is pending admin approval.", "⏳");
        navigate("/login");
      } else {
        toast(`Welcome to Eventra, ${form.name.split(" ")[0]}!`, "🎉");
        navigate("/dashboard");
      }
    } catch (err) {
      toast(err.response?.data?.message || "Could not create account.", "⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ maxWidth: 460, margin: "50px auto 110px", padding: "0 24px" }}>
      <div className="card" style={{ padding: 34 }}>
        <h1 style={{ fontSize: 24, marginBottom: 6 }}>Create your account</h1>
        <p style={{ color: "var(--ink-faint)", fontSize: 13.5, marginBottom: 22 }}>Join Eventra as a participant or apply as an organizer.</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          <button type="button" className={`btn btn-sm ${role === "participant" ? "btn-primary" : "btn-ghost"}`} onClick={() => setRole("participant")} style={{ flex: 1 }}>
            Participant
          </button>
          <button type="button" className={`btn btn-sm ${role === "organizer" ? "btn-primary" : "btn-ghost"}`} onClick={() => setRole("organizer")} style={{ flex: 1 }}>
            Organizer
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="formfield">
            <label>Full name</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="formfield">
            <label>Email address</label>
            <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {role === "organizer" && (
            <div className="formfield">
              <label>Organization / club</label>
              <input className="input" placeholder="e.g. Robotics Club" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
            </div>
          )}
          <div className="formfield">
            <label>Password</label>
            <input className="input" type="password" minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn btn-primary btn-block" style={{ padding: 12, marginTop: 6 }} disabled={loading}>
            {loading ? "Creating account…" : role === "organizer" ? "Submit application" : "Create account"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 13.5, color: "var(--ink-soft)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--blue)", fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </section>
  );
}
