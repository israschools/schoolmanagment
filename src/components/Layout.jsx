import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, CalendarCheck, MapPinned, Building2,
  Wallet, BarChart3, Bell, Search, LogOut, ChevronDown, ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Avatar } from "./ui";
import { notifications, roles } from "../data/dummyData";
import { useState } from "react";

const navByRole = {
  "Teacher": [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/attendance", label: "Attendance", icon: MapPinned },
    { to: "/leave", label: "Leave", icon: CalendarCheck },
    { to: "/payroll", label: "Salary Slips", icon: Wallet },
  ],
  "Principal": [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employees", label: "Staff", icon: Users },
    { to: "/attendance", label: "Attendance", icon: MapPinned },
    { to: "/leave", label: "Leave Approvals", icon: CalendarCheck },
    { to: "/reports", label: "Reports", icon: BarChart3 },
  ],
  "Director Schools": [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employees", label: "Employees", icon: Users },
    { to: "/attendance", label: "Attendance", icon: MapPinned },
    { to: "/leave", label: "Leave Approvals", icon: CalendarCheck },
    { to: "/campuses", label: "Campuses", icon: Building2 },
    { to: "/payroll", label: "Payroll", icon: Wallet },
    { to: "/reports", label: "Reports", icon: BarChart3 },
  ],
  "Super Admin": [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employees", label: "Employees", icon: Users },
    { to: "/attendance", label: "Attendance", icon: MapPinned },
    { to: "/leave", label: "Leave Approvals", icon: CalendarCheck },
    { to: "/campuses", label: "Campuses", icon: Building2 },
    { to: "/payroll", label: "Payroll", icon: Wallet },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/admin", label: "System Settings", icon: ShieldCheck },
  ],
};

export default function Layout() {
  const { role, setRole, user, setAuthed } = useAuth();
  const [roleMenu, setRoleMenu] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const navigate = useNavigate();
  const items = navByRole[role] || navByRole["Teacher"];

  return (
    <div className="flex h-screen bg-sand-50">
      {/* Sidebar */}
      <aside className="w-64 bg-ink-900 text-sand-100 flex flex-col shrink-0">
        <div className="px-6 py-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-display text-lg">I</div>
          <div>
            <p className="font-display text-lg leading-tight">Isra</p>
            <p className="text-[11px] text-sand-100/60 tracking-wide uppercase">School Portal</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-none">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-white/10 text-white font-medium" : "text-sand-100/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10 text-[11px] text-sand-100/50">
          Demo prototype · dummy data
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-sand-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-slate-500 bg-sand-50 rounded-lg px-3 py-2 w-80">
            <Search size={16} />
            <input
              placeholder="Search employees, leave requests…"
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setBellOpen((v) => !v)} className="relative p-2 rounded-lg hover:bg-sand-50">
                <Bell size={18} className="text-slate-700" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-600" />
              </button>
              {bellOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-sand-200 rounded-xl2 shadow-card p-2 z-20">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-3 py-2.5 hover:bg-sand-50 rounded-lg">
                      <p className="text-sm text-ink-900">{n.title}</p>
                      <p className="text-xs text-slate-500">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setRoleMenu((v) => !v)} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-sand-50">
                <Avatar name={user?.name || "User"} color={user?.avatarColor} />
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-ink-900 leading-tight">{user?.name}</p>
                  <p className="text-xs text-slate-500 leading-tight">{role}</p>
                </div>
                <ChevronDown size={15} className="text-slate-400" />
              </button>
              {roleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-sand-200 rounded-xl2 shadow-card p-2 z-20">
                  <p className="text-xs text-slate-400 px-3 py-1.5 uppercase tracking-wide">Switch role (demo)</p>
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => { setRole(r); setRoleMenu(false); navigate("/"); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${r === role ? "bg-emerald-100 text-emerald-700 font-medium" : "hover:bg-sand-50 text-slate-700"}`}
                    >
                      {r}
                    </button>
                  ))}
                  <div className="border-t border-sand-200 my-1" />
                  <button
                    onClick={() => { setAuthed(false); navigate("/login"); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-100 flex items-center gap-2"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
