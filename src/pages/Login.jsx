import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { campuses, roles } from "../data/dummyData";
import { Button } from "../components/ui";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  const { setAuthed, role, setRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("director@isra.edu.pk");
  const [password, setPassword] = useState("••••••••");

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthed(true);
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-ink-900 flex">
      {/* Left: brand + campus pulse signature */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "22px 22px" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center font-display text-xl text-white">I</div>
            <span className="font-display text-xl text-white">Isra School Portal</span>
          </div>
          <h1 className="font-display text-4xl text-white leading-tight max-w-md">
            Every campus,<br /> one heartbeat.
          </h1>
          <p className="text-sand-100/60 mt-4 max-w-sm text-sm leading-relaxed">
            Live attendance, leave, and payroll across every campus — verified by geo-fenced check-ins, reviewed in one place.
          </p>
        </div>

        {/* Campus Pulse strip — signature element */}
        <div className="relative space-y-3">
          {campuses.filter(c => c.active).map((c) => (
            <div key={c.id} className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
              <div className="relative w-10 h-10 shrink-0">
                <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15" fill="none" stroke="#1C8C6B" strokeWidth="3"
                    strokeDasharray={`${(c.attendanceToday / 100) * 94.2} 94.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-mono">{c.attendanceToday}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{c.name}</p>
                <p className="text-xs text-sand-100/50">{c.city} · {c.staff} staff</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center bg-sand-50 p-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white rounded-xl2 shadow-card border border-sand-200 p-8">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <ShieldCheck size={16} />
            <span className="text-xs font-medium uppercase tracking-wide">Secure sign-in</span>
          </div>
          <h2 className="font-display text-2xl text-ink-900 mb-6">Welcome back</h2>

          <label className="block text-xs font-medium text-slate-500 mb-1.5">Work email</label>
          <input
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-3 py-2.5 rounded-lg border border-sand-200 text-sm outline-none focus:border-emerald-600"
          />

          <label className="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-3 py-2.5 rounded-lg border border-sand-200 text-sm outline-none focus:border-emerald-600"
          />

          <label className="block text-xs font-medium text-slate-500 mb-1.5">Sign in as (demo role)</label>
          <select
            value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full mb-6 px-3 py-2.5 rounded-lg border border-sand-200 text-sm outline-none focus:border-emerald-600 bg-white"
          >
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          <Button variant="accent" className="w-full justify-center" type="submit">Sign in</Button>
          <p className="text-xs text-slate-400 mt-4 text-center">Prototype — authentication is simulated, no real credentials required.</p>
        </form>
      </div>
    </div>
  );
}
