import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, roleHome } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const link = (href, label) => (
    <Link to={href} className={location.pathname === href ? "current" : ""}>
      {label}
    </Link>
  );

  return (
    <nav className="pubnav">
      <div className="brand" onClick={() => navigate("/")}>
        <span className="mark">E</span> Eventra
      </div>
      <div className="pubnav-links">
        {link("/", "Home")}
        {link("/events", "Events")}
        {link("/about", "About")}
        {link("/contact", "Contact")}
      </div>
      <div className="pubnav-cta">
        {user ? (
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(roleHome())}>
            Go to Dashboard
          </button>
        ) : (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/login")}>
              Log in
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/register")}>
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
