import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Campuses from "./pages/Campuses";
import Payroll from "./pages/Payroll";
import Reports from "./pages/Reports";
import Admin from "./pages/Admin";

function ProtectedApp() {
  const { authed } = useAuth();
  if (!authed) return <Navigate to="/login" replace />;
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/campuses" element={<Campuses />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/schoolmanagment">
        <Routes>
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/*" element={<ProtectedApp />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function LoginWrapper() {
  const { authed } = useAuth();
  if (authed) return <Navigate to="/" replace />;
  return <Login />;
}
