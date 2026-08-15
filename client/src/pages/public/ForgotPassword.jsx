import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast("Password reset instructions sent (demo).", "📧");
    } catch {
      toast("Something went wrong. Try again.", "⚠️");
    }
  };

  return (
    <section style={{ maxWidth: 420, margin: "50px auto 110px", padding: "0 24px" }}>
      <div className="card" style={{ padding: 34 }}>
        <h1 style={{ fontSize: 24, marginBottom: 6 }}>Reset your password</h1>
        <p style={{ color: "var(--ink-faint)", fontSize: 13.5, marginBottom: 26 }}>
          Enter your email and we'll send you instructions to reset your password.
        </p>
        {sent ? (
          <div className="card" style={{ padding: 18, background: "var(--green-bg)", color: "var(--green-deep)", fontSize: 13.5 }}>
            If an account exists for that email, reset instructions are on the way.
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="formfield">
              <label>Email address</label>
              <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-block" style={{ padding: 12 }}>Send reset link</button>
          </form>
        )}
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 13.5, color: "var(--ink-soft)" }}>
          <Link to="/login" style={{ color: "var(--blue)", fontWeight: 600 }}>Back to log in</Link>
        </p>
      </div>
    </section>
  );
}
