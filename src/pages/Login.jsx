import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../data/api";
import { campuses } from "../data/dummyData";
import { ShieldCheck, Loader2 } from "lucide-react";
import CONFIG from "../config";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res.success) {
        login(res.user, res.role);
        navigate("/");
      } else {
        setError(res.error || "Invalid email or password");
      }
    } catch (err) {
      setError("Connection error. Check your network.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-ink-900 flex">
      {/* Left panel */}
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
            Live attendance, leave, and payroll across every campus — geo-fenced check-ins, reviewed in one place.
          </p>
          {CONFIG.USE_DUMMY_DATA && (
            <div className="mt-6 bg-amber-500/20 border border-amber-500/30 rounded-lg px-4 py-3">
              <p className="text-amber-300 text-xs font-medium">⚠️ Demo mode — Google Sheets URL not connected yet</p>
            </div>
          )}
        </div>
        <div className="relative space-y-3">
          {campuses.filter(c => c.active).map((c) => (
            <div key={c.id} className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
              <div className="relative w-10 h-10 shrink-0">
                <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#1C8C6B" strokeWidth="3"
                    strokeDasharray={`${(c.attendanceToday / 100) * 94.2} 94.2`} strokeLinecap="round" />
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

          {error && (
            <div className="mb-4 px-3 py-2.5 bg-rose-100 text-rose-600 rounded-lg text-sm">{error}</div>
          )}

          <label className="block text-xs font-medium text-slate-500 mb-1.5">Work email</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            placeholder="you@isra.edu.pk"
            className="w-full mb-4 px-3 py-2.5 rounded-lg border border-sand-200 text-sm outline-none focus:border-emerald-600"
          />

          <label className="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            placeholder="••••••••"
            className="w-full mb-6 px-3 py-2.5 rounded-lg border border-sand-200 text-sm outline-none focus:border-emerald-600"
          />

          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : "Sign in"}
          </button>

          {CONFIG.USE_DUMMY_DATA && (
            <div className="mt-4 p-3 bg-sand-50 rounded-lg text-xs text-slate-500">
              <p className="font-medium text-slate-700 mb-1">Demo credentials:</p>
              <p>admin@isra.edu.pk / admin123</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
