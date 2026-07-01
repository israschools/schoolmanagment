import { useEffect, useState } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
         XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth } from "../context/AuthContext";
import { Card, KpiCard, PageHeader, StatusBadge, Avatar } from "../components/ui";
import { getAttendanceTrend, getLeaveTrend, getDeptSplit,
         getLeaveRequests, getTodayAttendance, getCampuses } from "../data/api";
import { kpisFor } from "../data/dummyData";
import { Loader2 } from "lucide-react";

const PIE_COLORS = ["#1C8C6B","#C99A3B","#11203A","#C04A4A","#6B7280","#3A4150"];

export default function Dashboard() {
  const { role, user } = useAuth();
  const kpis = kpisFor(role);

  const [attTrend,  setAttTrend]  = useState([]);
  const [lvTrend,   setLvTrend]   = useState([]);
  const [deptSplit, setDeptSplit] = useState([]);
  const [pending,   setPending]   = useState([]);
  const [checkins,  setCheckins]  = useState([]);
  const [campuses,  setCampuses]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      getAttendanceTrend(),
      getLeaveTrend(),
      getDeptSplit(),
      getLeaveRequests({ status: "Pending" }),
      getTodayAttendance(),
      getCampuses(),
    ]).then(([at, lt, ds, pend, ci, camp]) => {
      setAttTrend(at  || []);
      setLvTrend(lt   || []);
      setDeptSplit(ds || []);
      setPending(pend || []);
      setCheckins(ci  || []);
      setCampuses(camp|| []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-emerald-600" />
    </div>
  );

  return (
    <div>
      <PageHeader eyebrow={role} title={`Welcome back, ${user?.name?.split(" ")[0] || "User"}`} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <Card title="Attendance this week" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={attTrend}>
              <defs>
                <linearGradient id="gPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1C8C6B" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#1C8C6B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#E6DFCF" />
              <XAxis dataKey="day" tick={{ fontSize:12, fill:"#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:12, fill:"#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:10, border:"1px solid #E6DFCF", fontSize:13 }} />
              <Area type="monotone" dataKey="present" stroke="#1C8C6B" fill="url(#gPresent)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Staff by department">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={deptSplit} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {deptSplit.map((_,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius:10, border:"1px solid #E6DFCF", fontSize:13 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <Card title="Leave applications monthly">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={lvTrend}>
              <CartesianGrid vertical={false} stroke="#E6DFCF" />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:"#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:10, border:"1px solid #E6DFCF", fontSize:13 }} />
              <Bar dataKey="leaves" fill="#C99A3B" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Pending leave requests">
          {pending.length === 0
            ? <p className="text-sm text-slate-400">No pending requests</p>
            : <div className="space-y-3">
                {pending.slice(0,5).map(l => (
                  <div key={l.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-ink-900 font-medium">{l.employee}</p>
                      <p className="text-xs text-slate-500">{l.type} · {l.days}d · {l.stage}</p>
                    </div>
                    <StatusBadge status={l.status} />
                  </div>
                ))}
              </div>
          }
        </Card>

        <Card title="Today's check-ins">
          {checkins.length === 0
            ? <p className="text-sm text-slate-400">No check-ins yet today</p>
            : <div className="space-y-3">
                {checkins.slice(0,4).map(a => (
                  <div key={a.empId} className="flex items-center gap-3">
                    <Avatar name={a.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink-900 font-medium truncate">{a.name}</p>
                      <p className="text-xs text-slate-500 truncate">{a.campus} · {a.checkIn}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
          }
        </Card>
      </div>

      {(role === "Director Schools" || role === "Super Admin") && campuses.length > 0 && (
        <Card title="Campus overview">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                  <th className="py-2 pr-4">Campus</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Staff</th>
                  <th className="py-2 pr-4">Today</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {campuses.map(c => (
                  <tr key={c.id} className="border-t border-sand-100">
                    <td className="py-3 pr-4 font-medium text-ink-900">{c.name}</td>
                    <td className="py-3 pr-4 text-slate-600">{c.type}</td>
                    <td className="py-3 pr-4 text-slate-600">{c.staff}</td>
                    <td className="py-3 pr-4 text-slate-600">{c.active ? `${c.attendanceToday}%` : "—"}</td>
                    <td className="py-3 pr-4"><StatusBadge status={c.active ? "Active" : "Inactive"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
