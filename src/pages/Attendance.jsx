import { useState } from "react";
import { MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Card, PageHeader, StatusBadge, Avatar, Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { attendanceToday, campuses } from "../data/dummyData";

export default function Attendance() {
  const { role } = useAuth();
  const [checkedIn, setCheckedIn] = useState(false);
  const isStaffView = role === "Teacher";

  return (
    <div>
      <PageHeader eyebrow="Attendance" title={isStaffView ? "My Attendance" : "Attendance Monitoring"} />

      {isStaffView && (
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6 -mt-1">
            <div className="w-full md:w-64 h-40 rounded-xl bg-sand-100 border border-sand-200 flex flex-col items-center justify-center gap-2 text-slate-500">
              <MapPin size={22} />
              <span className="text-xs">Main Campus geofence · 150m radius</span>
              <span className="text-xs font-mono text-emerald-700">Within range</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500 mb-1">Today, {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
              <h3 className="font-display text-2xl text-ink-900 mb-4">{checkedIn ? "You're checked in" : "Not checked in yet"}</h3>
              <div className="flex items-center gap-3">
                {!checkedIn ? (
                  <Button variant="accent" onClick={() => setCheckedIn(true)}><Clock size={16} /> Check in</Button>
                ) : (
                  <>
                    <span className="flex items-center gap-2 text-emerald-700 text-sm"><CheckCircle2 size={16} /> Checked in at 08:0{Math.floor(Math.random()*9)} · GPS verified</span>
                    <Button variant="ghost" onClick={() => setCheckedIn(false)}>Check out</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card title={isStaffView ? "My recent history" : "Today's attendance — all campuses"}>
        <div className="overflow-x-auto -mt-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                <th className="py-2 pr-4">Employee</th>
                <th className="py-2 pr-4">Campus</th>
                <th className="py-2 pr-4">Check-in</th>
                <th className="py-2 pr-4">Check-out</th>
                <th className="py-2 pr-4">GPS</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceToday.map((a) => (
                <tr key={a.empId} className="border-t border-sand-100">
                  <td className="py-3 pr-4 flex items-center gap-3">
                    <Avatar name={a.name} />
                    <span className="font-medium text-ink-900">{a.name}</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{a.campus}</td>
                  <td className="py-3 pr-4 text-slate-600 font-mono">{a.checkIn}</td>
                  <td className="py-3 pr-4 text-slate-600 font-mono">{a.checkOut}</td>
                  <td className="py-3 pr-4 text-slate-600">{a.geo}</td>
                  <td className="py-3 pr-4"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {!isStaffView && (
        <Card title="Campus geofence configuration" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-1">
            {campuses.filter(c => c.active).map((c) => (
              <div key={c.id} className="border border-sand-200 rounded-xl p-4">
                <p className="font-medium text-ink-900 text-sm">{c.name}</p>
                <p className="text-xs text-slate-500 mt-1">Lat {c.lat.toFixed(4)}, Lng {c.lng.toFixed(4)}</p>
                <p className="text-xs text-slate-500">Radius: {c.radius}m</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
