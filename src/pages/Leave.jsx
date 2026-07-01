import { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Card, PageHeader, StatusBadge, Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { getLeaveRequests, submitLeave, approveLeave, rejectLeave, getLeaveBalance } from "../data/api";
import { leaveTypes as dummyLT } from "../data/dummyData";

function Tab({ active, children, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-ink-800 text-white" : "bg-white border border-sand-200 text-slate-600 hover:bg-sand-50"}`}>
      {children}
    </button>
  );
}

export default function Leave() {
  const { role, user } = useAuth();
  const isStaff    = role === "Teacher";
  const isApprover = !isStaff;
  const [tab, setTab]           = useState(isApprover ? "approvals" : "balance");
  const [requests, setRequests] = useState([]);
  const [balance, setBalance]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [actionId, setActionId] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectComment, setRejectComment] = useState("");
  const [form, setForm] = useState({ type:"Casual Leave", from:"", to:"", days:"1", reason:"" });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [reqs, bal] = await Promise.all([
        getLeaveRequests(isStaff ? { empId: user?.id } : {}),
        getLeaveBalance(user?.id),
      ]);
      setRequests(reqs || []);
      setBalance(bal.length ? bal : dummyLT);
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  async function handleApprove(leaveId) {
    setActionId(leaveId);
    await approveLeave(leaveId, role, "");
    await load();
    setActionId(null);
  }

  async function handleReject() {
    setActionId(rejectModal);
    await rejectLeave(rejectModal, role, rejectComment);
    setRejectModal(null);
    setRejectComment("");
    await load();
    setActionId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await submitLeave({ ...form, empId: user?.id, employee: user?.name, campus: user?.campus });
    setSuccessMsg("Leave request submitted! Principal will be notified via email.");
    setForm({ type:"Casual Leave", from:"", to:"", days:"1", reason:"" });
    await load();
    setSubmitting(false);
    setTimeout(() => setSuccessMsg(""), 5000);
  }

  const pending = requests.filter(r => r.status === "Pending");

  return (
    <div>
      <PageHeader eyebrow="Leave Management" title="Leave"
        action={isApprover && pending.length > 0 &&
          <span className="bg-rose-100 text-rose-600 text-xs font-medium px-3 py-1.5 rounded-full">{pending.length} pending</span>}
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {isStaff && <Tab active={tab==="balance"} onClick={() => setTab("balance")}>Leave Balance</Tab>}
        {isStaff && <Tab active={tab==="apply"} onClick={() => setTab("apply")}>Apply Leave</Tab>}
        {isStaff && <Tab active={tab==="history"} onClick={() => setTab("history")}>My History</Tab>}
        {isApprover && <Tab active={tab==="approvals"} onClick={() => setTab("approvals")}>Pending Approvals</Tab>}
        {isApprover && <Tab active={tab==="all"} onClick={() => setTab("all")}>All Requests</Tab>}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-emerald-600"/></div>
      ) : (
        <>
          {/* ── Leave Balance ── */}
          {tab === "balance" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {balance.map(lt => (
                <Card key={lt.type}>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{lt.type}</p>
                  <p className="font-display text-2xl text-ink-900">
                    {lt.balance}<span className="text-sm text-slate-400 font-body"> / {lt.total}</span>
                  </p>
                  <div className="mt-2 h-1.5 bg-sand-100 rounded-full overflow-hidden">
                    {typeof lt.total === "number" && lt.total > 0 &&
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width:`${((lt.balance/lt.total)*100)}%`}}/>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">{lt.used} used this year</p>
                </Card>
              ))}
            </div>
          )}

          {/* ── Apply ── */}
          {tab === "apply" && (
            <div className="max-w-lg">
              {successMsg && (
                <div className="mb-4 flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-3 rounded-lg text-sm">
                  <CheckCircle size={16}/> {successMsg}
                </div>
              )}
              <Card title="Apply for leave">
                <form onSubmit={handleSubmit} className="space-y-4 -mt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Leave type</label>
                    <select className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm bg-white"
                      value={form.type} onChange={e => setForm({...form,type:e.target.value})}>
                      {balance.map(lt => <option key={lt.type}>{lt.type}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">From</label>
                      <input type="date" required className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm"
                        value={form.from} onChange={e => setForm({...form,from:e.target.value})}/>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">To</label>
                      <input type="date" required className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm"
                        value={form.to} onChange={e => setForm({...form,to:e.target.value})}/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Reason</label>
                    <textarea rows={3} required className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm resize-none"
                      placeholder="Briefly explain the reason" value={form.reason}
                      onChange={e => setForm({...form,reason:e.target.value})}/>
                  </div>
                  <div className="bg-sand-50 rounded-lg px-4 py-3 text-sm text-slate-600">
                    Workflow: <span className="font-medium text-ink-900">You → Principal → Director Schools</span>
                    <br/><span className="text-xs text-slate-400 mt-1 block">Email notification automatically sent to Principal on submission</span>
                  </div>
                  <Button variant="accent" type="submit" disabled={submitting} className="w-full justify-center">
                    {submitting ? <><Loader2 size={16} className="animate-spin"/> Submitting...</> : "Submit request"}
                  </Button>
                </form>
              </Card>
            </div>
          )}

          {/* ── History / All / Approvals ── */}
          {(tab === "history" || tab === "approvals" || tab === "all") && (
            <Card title={tab === "approvals" ? "Requests awaiting your action" : tab === "history" ? "My leave history" : "All leave requests"}>
              <div className="overflow-x-auto -mt-1">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Employee</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Dates</th>
                      <th className="py-2 pr-4">Days</th>
                      <th className="py-2 pr-4">Stage</th>
                      <th className="py-2 pr-4">Status</th>
                      {isApprover && <th className="py-2 pr-4">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {(tab === "approvals" ? pending : requests).map(l => (
                      <tr key={l.id} className="border-t border-sand-100">
                        <td className="py-3 pr-4 font-mono text-xs text-slate-500">{l.id}</td>
                        <td className="py-3 pr-4 font-medium text-ink-900">{l.employee}</td>
                        <td className="py-3 pr-4 text-slate-600">{l.type}</td>
                        <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">{l.from} → {l.to}</td>
                        <td className="py-3 pr-4 text-slate-600">{l.days}</td>
                        <td className="py-3 pr-4 text-slate-600">{l.stage}</td>
                        <td className="py-3 pr-4"><StatusBadge status={l.status}/></td>
                        {isApprover && (
                          <td className="py-3 pr-4">
                            {l.status === "Pending" ? (
                              <div className="flex gap-2">
                                <button onClick={() => handleApprove(l.id)} disabled={actionId===l.id}
                                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 disabled:opacity-50">
                                  {actionId===l.id ? <Loader2 size={12} className="animate-spin"/> : <CheckCircle size={12}/>} Approve
                                </button>
                                <button onClick={() => setRejectModal(l.id)}
                                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200">
                                  <XCircle size={12}/> Reject
                                </button>
                              </div>
                            ) : <span className="text-xs text-slate-400">Resolved</span>}
                          </td>
                        )}
                      </tr>
                    ))}
                    {(tab === "approvals" ? pending : requests).length === 0 && (
                      <tr><td colSpan={8} className="py-10 text-center text-slate-400">No records found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-ink-900/40 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl2 p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-display text-lg text-ink-900 mb-3">Reject leave request</h3>
            <p className="text-sm text-slate-500 mb-3">Provide a reason (will be emailed to employee):</p>
            <textarea rows={3} className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm resize-none mb-4"
              value={rejectComment} onChange={e => setRejectComment(e.target.value)} placeholder="Reason for rejection"/>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 justify-center" onClick={() => setRejectModal(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1 justify-center" onClick={handleReject}>Confirm reject</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
