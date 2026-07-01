import { Card, PageHeader, Button, StatusBadge } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { employees, roles } from "../data/dummyData";
import { ShieldAlert } from "lucide-react";

export default function Admin() {
  const { role } = useAuth();

  if (role !== "Super Admin") {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <ShieldAlert size={40} className="text-slate-300" />
        <h2 className="font-display text-2xl text-slate-400">Access restricted</h2>
        <p className="text-slate-400 text-sm">This section is only accessible to Super Admin.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Super Admin" title="System Settings" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="User & role management">
          <div className="space-y-3 -mt-1">
            {employees.map((e) => (
              <div key={e.id} className="flex items-center justify-between border-b border-sand-100 pb-2.5">
                <div>
                  <p className="text-sm font-medium text-ink-900">{e.name}</p>
                  <p className="text-xs text-slate-500">{e.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={e.status} />
                  <select defaultValue={e.role} className="text-xs border border-sand-200 rounded-lg px-2 py-1 bg-white text-slate-700">
                    {roles.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card title="Salary configuration">
            <div className="space-y-3 -mt-1 text-sm">
              {[
                ["Late deduction per day", "PKR 300"],
                ["Unpaid leave per day", "Basic / 26 days"],
                ["Tax slab (default)", "FBR 2025-26"],
                ["Overtime rate", "1.5× hourly"],
                ["Pay cycle", "Monthly (1st)"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-sand-100 pb-2">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-medium text-ink-900">{v}</span>
                </div>
              ))}
              <Button variant="ghost" className="text-xs mt-1">Edit configuration</Button>
            </div>
          </Card>

          <Card title="System health">
            <div className="space-y-3 -mt-1 text-sm">
              {[
                ["Google Sheets sync", "Connected", true],
                ["Apps Script automation", "Running", true],
                ["Email notifications", "Active", true],
                ["GPS geofencing service", "Active", true],
                ["Last payroll run", "01 Jun 2026", false],
              ].map(([k, v, ok]) => (
                <div key={k} className="flex justify-between border-b border-sand-100 pb-2">
                  <span className="text-slate-500">{k}</span>
                  <span className={ok === true ? "text-emerald-700 font-medium" : ok === false ? "text-slate-600" : "text-slate-600"}>{v}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Notification settings">
            <div className="space-y-3 -mt-1 text-sm">
              {[
                "Email on leave application",
                "Email on leave approval",
                "Daily attendance reminder",
                "Payroll generation alert",
                "Late check-in alert to Principal",
              ].map((n) => (
                <label key={n} className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700">{n}</span>
                  <input type="checkbox" defaultChecked className="accent-emerald-600" />
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
