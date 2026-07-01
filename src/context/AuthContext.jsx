import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole]   = useState(() => localStorage.getItem("isra_role") || "");
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("isra_user") || "null"); } catch { return null; }
  });
  const [authed, setAuthedRaw] = useState(() => localStorage.getItem("isra_authed") === "true");

  const setAuthed = (val) => {
    setAuthedRaw(val);
    localStorage.setItem("isra_authed", val ? "true" : "false");
    if (!val) {
      localStorage.removeItem("isra_role");
      localStorage.removeItem("isra_user");
    }
  };

  const login = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
    setAuthedRaw(true);
    localStorage.setItem("isra_authed", "true");
    localStorage.setItem("isra_role", userRole);
    localStorage.setItem("isra_user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ role, setRole, user, setUser, authed, setAuthed, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

