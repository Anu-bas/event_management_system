import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function Login() {
  const { login, roleHome } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast(`Welcome back, ${user.name.split(" ")[0]}!`, "👋");
      navigate({ participant: "/dashboard", organizer: "/organizer", admin: "/admin" }[user.role] || "/");
    } catch (err) {
      toast(err.response?.data?.message || "Incorrect email or password.", "⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ maxWidth: 420, margin: "50px auto 110px", padding: "0 24px" }}>
      <div className="card" style={{ padding: 34 }}>
        <h1 style={{ fontSize: 24, marginBottom: 6 }}>Welcome back</h1>
        <p style={{ color: "var(--ink-faint)", fontSize: 13.5, marginBottom: 26 }}>Log in to manage your registrations.</p>
        <form onSubmit={submit}>
          <div className="formfield">
            <label>Email address</label>
            <input className="input" type="email" placeholder="you@campus.edu" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="formfield">
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <div style={{ textAlign: "right" }}>
              <Link to="/forgot" style={{ fontSize: 12.5, color: "var(--blue)", fontWeight: 600 }}>Forgot password?</Link>
            </div>
          </div>
          <button className="btn btn-primary btn-block" style={{ padding: 12, marginTop: 6 }} disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--line)", fontSize: 12.5, color: "var(--ink-faint)", lineHeight: 1.7 }}>
          <b>Demo accounts</b> (password: <span className="mono">demo123</span> / admin: <span className="mono">admin123</span>)<br />
          👤 asha@campus.edu — Participant<br />
          🗂️ priya.organizer@campus.edu — Organizer<br />
          🛡️ admin@eventra.com — Admin
        </div>
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 13.5, color: "var(--ink-soft)" }}>
          No account? <Link to="/register" style={{ color: "var(--blue)", fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </section>
  );
}
