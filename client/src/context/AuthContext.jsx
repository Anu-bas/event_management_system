import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("eventra_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("eventra_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("eventra_token", res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    if (res.data.token) {
      localStorage.setItem("eventra_token", res.data.token);
      setUser(res.data);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("eventra_token");
    setUser(null);
  };

  const roleHome = () => {
    if (!user) return "/login";
    return { participant: "/dashboard", organizer: "/organizer", admin: "/admin" }[user.role] || "/";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, roleHome }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
