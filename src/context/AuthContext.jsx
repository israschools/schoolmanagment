import { createContext, useContext, useState } from "react";
import { employees } from "../data/dummyData";

const AuthContext = createContext(null);

const roleToUser = {
  "Teacher": employees.find((e) => e.id === "EMP-1001"),
  "Principal": employees.find((e) => e.id === "EMP-1002"),
  "Director Schools": employees.find((e) => e.id === "EMP-1006"),
  "Super Admin": employees.find((e) => e.id === "EMP-1008"),
};

export function AuthProvider({ children }) {
  const [role, setRole] = useState("Director Schools");
  const [authed, setAuthed] = useState(false);
  const user = roleToUser[role];

  return (
    <AuthContext.Provider value={{ role, setRole, user, authed, setAuthed }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
