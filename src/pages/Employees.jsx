import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Card, PageHeader, StatusBadge, Avatar, Button } from "../components/ui";
import { employees, campuses, departments } from "../data/dummyData";

export default function Employees() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = employees.filter((e) =>
    (dept === "All" || e.dept === dept) &&
    (e.name.toLowerCase().includes(q.toLowerCase()) || e.id.toLowerCase().includes(q.toLowerCase()))
  );

  const campusName = (id) => campuses.find((c) => c.id === id)?.name || "—";

  return (
    <div>
      <PageHeader eyebrow="People" title="Employee Directory" action={<Button variant="accent"><Plus size={16} /> Add employee</Button>} />

      <Card className="mb-5">
        <div className="flex flex-wrap items-center gap-3 -mt-1">
          <div className="flex items-center gap-2 bg-sand-50 rounded-lg px-3 py-2 flex-1 min-w-[220px]">
            <Search size={15} className="text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or employee ID"
              className="bg-transparent outline-none text-sm w-full" />
          </div>
          <div className="flex items-center gap-2 bg-sand-50 rounded-lg px-3 py-2">
            <Filter size={15} className="text-slate-400" />
            <select value={dept} onChange={(e) => setDept(e.target.value)} className="bg-transparent outline-none text-sm">
              <option>All</option>
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto -mt-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                <th className="py-2 pr-4">Employee</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Campus</th>
                <th className="py-2 pr-4">Joined</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} onClick={() => setSelected(e)} className="border-t border-sand-100 cursor-pointer hover:bg-sand-50/70">
                  <td className="py-3 pr-4 flex items-center gap-3">
                    <Avatar name={e.name} color={e.avatarColor} />
                    <div>
                      <p className="font-medium text-ink-900">{e.name}</p>
                      <p className="text-xs text-slate-500">{e.id}</p>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{e.role}</td>
                  <td className="py-3 pr-4 text-slate-600">{e.dept}</td>
                  <td className="py-3 pr-4 text-slate-600">{campusName(e.campus)}</td>
                  <td className="py-3 pr-4 text-slate-600">{e.joined}</td>
                  <td className="py-3 pr-4"><StatusBadge status={e.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400 text-sm">No employees match this search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div className="fixed inset-0 bg-ink-900/40 flex items-center justify-end z-30" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md h-full bg-white p-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <Avatar name={selected.name} color={selected.avatarColor} />
              <div>
                <h3 className="font-display text-xl text-ink-900">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.id} · {selected.role}</p>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              {[
                ["Department", selected.dept],
                ["Campus", campusName(selected.campus)],
                ["Joined", selected.joined],
                ["Phone", selected.phone],
                ["Email", selected.email],
                ["Status", selected.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-sand-100 pb-2">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="text-ink-900 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <Button variant="ghost" className="w-full justify-center mt-6" onClick={() => setSelected(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
