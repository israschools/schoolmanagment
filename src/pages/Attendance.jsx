import { useState, useEffect } from "react";
import { MapPin, Clock, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { Card, PageHeader, StatusBadge, Avatar, Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { getTodayAttendance, checkIn, checkOut, getCampuses } from "../data/api";

export default function Attendance() {
  const { role, user } = useAuth();
  const isStaff = role === "Teacher";
  const [records, setRecords]     = useState([]);
  const [campuses, setCampuses]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [myRecord, setMyRecord]   = useState(null);
  const [geoStatus, setGeoStatus] = useState("idle"); // idle | locating | verified | failed | outside
  const [actionLoading, setActionLoading] = useState(false);
  const [geoCoords, setGeoCoords] = useState(null);
  const [msg, setMsg]             = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [recs, camps] = await Promise.all([getTodayAttendance(), getCampuses()]);
      setRecords(recs || []);
      setCampuses(camps || []);
      if (user?.id) setMyRecord((recs||[]).find(r => r.empId === user.id) || null);
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  function getLocation() {
    return new Promise((res, rej) => {
      if (!navigator.geolocation) rej(new Error("GPS not supported"));
      setGeoStatus("locating");
      navigator.geolocation.getCurrentPosition(
        pos => { setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoStatus("verified"); res(pos.coords); },
        () => { setGeoStatus("failed"); rej(new Error("Location denied")); },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  async function handleCheckIn() {
    setActionLoading(true);
    try {
      const coords = await getLocation();
      const res = await checkIn(user.id, user.campus, coords.latitude, coords.longitude);
      if (res.success) {
        setMsg(res.geoStatus === "Verified"
          ? `✅ Checked in at ${res.time} — GPS verified`
          : `⚠️ Checked in at ${res.time} — outside geofence`);
        await load();
      }
    } catch(e) { setMsg("❌ " + e.message); }
    setActionLoading(false);
  }

  async function handleCheckOut() {
    setActionLoading(true);
    try {
      const coords = await getLocation();
      const res = await checkOut(user.id, user.campus, coords.latitude, coords.longitude);
      if (res.success) { setMsg(`✅ Checked out at ${res.time}`); await load(); }
    } catch(e) { setMsg("❌ " + e.message); }
    setActionLoading(false);
  }

  const todayStr = new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" });

  return (
    <div>
      <PageHeader eyebrow="Attendance" title={isStaff ? "My Attendance" : "Attendance Monitor"}/>

      {isStaff && (
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6 -mt-1">
            {/* GPS status panel */}
            <div className={`w-full md:w-56 h-44 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-colors
              ${geoStatus === "verified" ? "border-emerald-400 bg-emerald-50" : geoStatus === "failed" ? "border-rose-300 bg-rose-50" : "border-sand-200 bg-sand-50"}`}>
              <MapPin size={24} className={geoStatus==="verified" ? "text-emerald-600" : geoStatus==="failed" ? "text-rose-500" : "text-slate-400"}/>
              <span className="text-xs font-medium text-center px-3">
                {geoStatus === "idle"     && "GPS location will be verified on check-in"}
                {geoStatus === "locating" && "Getting your location…"}
                {geoStatus === "verified" && `GPS verified\n${geoCoords?.lat?.toFixed(5)}, ${geoCoords?.lng?.toFixed(5)}`}
                {geoStatus === "failed"   && "Location access denied\nPlease allow GPS in browser"}
              </span>
            </div>

            <div className="flex-1">
              <p className="text-sm text-slate-500 mb-1">{todayStr}</p>
              <h3 className="font-display text-2xl text-ink-900 mb-2">
                {myRecord ? (myRecord.checkOut ? "Day complete" : "Checked in") : "Not checked in yet"}
              </h3>

              {msg && (
                <div className="mb-3 text-sm bg-sand-50 border border-sand-200 rounded-lg px-3 py-2 text-slate-700">{msg}</div>
              )}

              {myRecord && (
                <div className="flex gap-4 mb-4 text-sm">
                  <div className="bg-emerald-50 rounded-lg px-4 py-2">
                    <p className="text-xs text-slate-500">Check-in</p>
                    <p className="font-mono font-semibold text-emerald-700">{myRecord.checkIn}</p>
                  </div>
                  {myRecord.checkOut && (
                    <div className="bg-sand-100 rounded-lg px-4 py-2">
                      <p className="text-xs text-slate-500">Check-out</p>
                      <p className="font-mono font-semibold text-ink-900">{myRecord.checkOut}</p>
                    </div>
                  )}
                  <div className="bg-sand-50 rounded-lg px-4 py-2">
                    <p className="text-xs text-slate-500">Status</p>
                    <StatusBadge status={myRecord.status}/>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {!myRecord && (
                  <Button variant="accent" onClick={handleCheckIn} disabled={actionLoading}>
                    {actionLoading ? <Loader2 size={16} className="animate-spin"/> : <Clock size={16}/>} Check in
                  </Button>
                )}
                {myRecord && !myRecord.checkOut && (
                  <Button variant="ghost" onClick={handleCheckOut} disabled={actionLoading}>
                    {actionLoading ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle2 size={16}/>} Check out
                  </Button>
                )}
              </div>

              {geoStatus === "failed" && (
                <p className="mt-3 text-xs text-rose-600 flex items-center gap-1">
                  <AlertTriangle size={13}/> Allow location access in your browser settings for GPS check-in
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card title={isStaff ? "Today's attendance record" : "Today's attendance — all campuses"}>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-emerald-600"/></div>
        ) : (
          <div className="overflow-x-auto -mt-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                  <th className="py-2 pr-4">Employee</th><th className="py-2 pr-4">Campus</th>
                  <th className="py-2 pr-4">Check-in</th><th className="py-2 pr-4">Check-out</th>
                  <th className="py-2 pr-4">GPS</th><th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map(a => (
                  <tr key={a.empId} className="border-t border-sand-100">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={a.name}/>
                        <span className="font-medium text-ink-900">{a.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{a.campus}</td>
                    <td className="py-3 pr-4 font-mono text-slate-700">{a.checkIn || "—"}</td>
                    <td className="py-3 pr-4 font-mono text-slate-700">{a.checkOut || "—"}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-medium ${a.geo === "Verified" || a.geoStatus === "Verified" ? "text-emerald-700" : "text-slate-400"}`}>
                        {a.geo || a.geoStatus || "—"}
                      </span>
                    </td>
                    <td className="py-3 pr-4"><StatusBadge status={a.status}/></td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan={6} className="py-10 text-center text-slate-400">No attendance records for today yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {!isStaff && campuses.length > 0 && (
        <Card title="Geofence configuration" className="mt-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-1">
            {campuses.filter(c => c.active).map(c => (
              <div key={c.id} className="border border-sand-200 rounded-xl p-4 hover:border-emerald-400 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-ink-900 text-sm">{c.name}</p>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"/>
                </div>
                <p className="text-xs text-slate-500 font-mono">{Number(c.lat).toFixed(4)}, {Number(c.lng).toFixed(4)}</p>
                <p className="text-xs text-slate-500 mt-1">Radius: <span className="font-medium text-ink-800">{c.radius}m</span></p>
                <p className="text-xs text-slate-500">{c.staff} staff</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
