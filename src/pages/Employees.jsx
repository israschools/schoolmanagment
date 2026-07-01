import { useState, useEffect } from "react";
import { Search, Plus, Filter, Loader2 } from "lucide-react";
import { Card, PageHeader, StatusBadge, Avatar, Button } from "../components/ui";
import { getEmployees, addEmployee } from "../data/api";
import { campuses as campusList, departments } from "../data/dummyData";
import { useAuth } from "../context/AuthContext";

export default function Employees() {
  const { role } = useAuth();
  const canAdd = role === "Super Admin" || role === "Principal";
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [q, setQ]                 = useState("");
  const [dept, setDept]           = useState("All");
  const [selected, setSelected]   = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ name:"", role:"Teacher", dept:"Mathematics", campus:"C-01", phone:"", email:"", basicSalary:"", allowances:"" });
  const [saving, setSaving]       = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { setEmployees(await getEmployees()); } catch(e) { console.error(e); }
    setLoading(false);
  }

  const filtered = employees.filter(e =>
    (dept === "All" || e.dept === dept) &&
    (e.name?.toLowerCase().includes(q.toLowerCase()) || e.id?.toLowerCase().includes(q.toLowerCase()))
  );

  const campusName = (id) => campusList.find(c => c.id === id)?.name || id || "—";

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    await addEmployee(form);
    await load();
    setShowForm(false);
    setSaving(false);
  }

  return (
    <div>
      <PageHeader eyebrow="People" title="Employee Directory"
        action={canAdd ? <Button variant="accent" onClick={() => setShowForm(true)}><Plus size={16}/> Add employee</Button> : null}
      />

      <Card className="mb-5">
        <div className="flex flex-wrap items-center gap-3 -mt-1">
          <div className="flex items-center gap-2 bg-sand-50 rounded-lg px-3 py-2 flex-1 min-w-[220px]">
            <Search size={15} className="text-slate-400"/>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or ID"
              className="bg-transparent outline-none text-sm w-full"/>
          </div>
          <div className="flex items-center gap-2 bg-sand-50 rounded-lg px-3 py-2">
            <Filter size={15} className="text-slate-400"/>
            <select value={dept} onChange={e => setDept(e.target.value)} className="bg-transparent outline-none text-sm">
              <option>All</option>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-emerald-600"/></div>
        ) : (
          <div className="overflow-x-auto -mt-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                  <th className="py-2 pr-4">Employee</th><th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Department</th><th className="py-2 pr-4">Campus</th>
                  <th className="py-2 pr-4">Joined</th><th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} onClick={() => setSelected(e)} className="border-t border-sand-100 cursor-pointer hover:bg-sand-50/70">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={e.name} color={e.avatarColor}/>
                        <div><p className="font-medium text-ink-900">{e.name}</p><p className="text-xs text-slate-500">{e.id}</p></div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{e.role}</td>
                    <td className="py-3 pr-4 text-slate-600">{e.dept}</td>
                    <td className="py-3 pr-4 text-slate-600">{campusName(e.campus)}</td>
                    <td className="py-3 pr-4 text-slate-600">{e.joined}</td>
                    <td className="py-3 pr-4"><StatusBadge status={e.status}/></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="py-10 text-center text-slate-400">No employees found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Employee detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-ink-900/40 flex items-center justify-end z-30" onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md h-full bg-white p-6 overflow-y-auto shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Avatar name={selected.name} color={selected.avatarColor}/>
              <div>
                <h3 className="font-display text-xl text-ink-900">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.id} · {selected.role}</p>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              {[["Department",selected.dept],["Campus",campusName(selected.campus)],
                ["Joined",selected.joined],["Phone",selected.phone],
                ["Email",selected.email],["Status",selected.status]].map(([k,v]) => (
                <div key={k} className="flex justify-between border-b border-sand-100 pb-2">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="text-ink-900 font-medium">{v || "—"}</dd>
                </div>
              ))}
            </dl>
            <Button variant="ghost" className="w-full justify-center mt-6" onClick={() => setSelected(null)}>Close</Button>
          </div>
        </div>
      )}

      {/* Add employee form */}
      {showForm && (
        <div className="fixed inset-0 bg-ink-900/40 flex items-center justify-center z-30" onClick={() => setShowForm(false)}>
          <form onSubmit={handleAdd} onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-xl2 p-6 shadow-xl overflow-y-auto max-h-screen">
            <h3 className="font-display text-xl text-ink-900 mb-5">Add new employee</h3>
            <div className="grid grid-cols-2 gap-3">
              {[["Full name","name","text",true],["Email","email","email",true],["Phone","phone","text",false],["Basic Salary (PKR)","basicSalary","number",false],["Allowances (PKR)","allowances","number",false],["Joining date","joined","date",false]].map(([label,key,type,req]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                  <input type={type} required={req} value={form[key]||""} onChange={e => setForm({...form,[key]:e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-sand-200 text-sm"/>
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({...form,role:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-sand-200 text-sm bg-white">
                  {["Teacher","Principal","Director Schools","Super Admin"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Department</label>
                <select value={form.dept} onChange={e => setForm({...form,dept:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-sand-200 text-sm bg-white">
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Campus</label>
                <select value={form.campus} onChange={e => setForm({...form,campus:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-sand-200 text-sm bg-white">
                  {campusList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="ghost" className="flex-1 justify-center" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="accent" className="flex-1 justify-center" type="submit" disabled={saving}>
                {saving ? <Loader2 size={16} className="animate-spin"/> : "Save employee"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
