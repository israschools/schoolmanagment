import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Card, PageHeader, Button } from "../components/ui";
import { attendanceTrend, leaveTrend, payrollSummary, campuses } from "../data/dummyData";
import { Download } from "lucide-react";

const payrollTrend = [
  { month: "Jan", payroll: 37.2 }, { month: "Feb", payroll: 37.8 }, { month: "Mar", payroll: 38.1 },
  { month: "Apr", payroll: 39.0 }, { month: "May", payroll: 39.6 }, { month: "Jun", payroll: 40.2 },
];

const campusAttendance = campuses.filter(c => c.active).map(c => ({
  name: c.name.replace(" Campus", "").replace(" Branch", "").replace(" Regional", ""),
  attendance: c.attendanceToday,
}));

export default function Reports() {
  return (
    <div>
      <PageHeader
        eyebrow="Analytics & Reports"
        title="Reports"
        action={<Button variant="ghost"><Download size={16} /> Export all</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Card title="Weekly attendance vs absence">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={attendanceTrend}>
              <CartesianGrid vertical={false} stroke="#E6DFCF" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E6DFCF", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="present" fill="#1C8C6B" radius={[4,4,0,0]} name="Present" />
              <Bar dataKey="late" fill="#C99A3B" radius={[4,4,0,0]} name="Late" />
              <Bar dataKey="absent" fill="#C04A4A" radius={[4,4,0,0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Monthly payroll trend (PKR Million)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={payrollTrend}>
              <CartesianGrid vertical={false} stroke="#E6DFCF" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} domain={[35, 42]} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E6DFCF", fontSize: 12 }} />
              <Line type="monotone" dataKey="payroll" stroke="#11203A" strokeWidth={2.5} dot={{ r: 4, fill: "#11203A" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Leave applications per month">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={leaveTrend}>
              <CartesianGrid vertical={false} stroke="#E6DFCF" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E6DFCF", fontSize: 12 }} />
              <Bar dataKey="leaves" fill="#C99A3B" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Today's attendance by campus (%)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={campusAttendance} layout="vertical">
              <CartesianGrid horizontal={false} stroke="#E6DFCF" />
              <XAxis type="number" domain={[70, 100]} tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E6DFCF", fontSize: 12 }} />
              <Bar dataKey="attendance" fill="#1C8C6B" radius={[0,6,6,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Quick report exports">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 -mt-1">
          {[
            "Attendance Report", "Leave Summary", "Payroll Register", "Employee Census",
            "Late Arrivals Log", "Campus Performance", "Holiday Usage", "Payroll Audit"
          ].map((r) => (
            <button key={r} className="text-left px-4 py-3 rounded-xl border border-sand-200 hover:border-emerald-600 hover:bg-emerald-100/30 transition-colors group">
              <p className="text-sm font-medium text-ink-900 group-hover:text-emerald-700">{r}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><Download size={11} /> Export CSV / PDF</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
