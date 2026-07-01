import { useState } from "react";
import { Card, PageHeader, StatusBadge, Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { leaveTypes, leaveRequests } from "../data/dummyData";

export default function Leave() {
  const { role } = useAuth();
  const isStaffView = role === "Teacher";
  const isApprover = role === "Principal" || role === "Director Schools" || role === "Super Admin";
  const [tab, setTab] = useState(isApprover ? "approvals" : "my");
  const [form, setForm] = useState({ type: "Casual Leave", from: "", to: "", reason: "" });

  return (
    <div>
      <PageHeader eyebrow="Leave Management" title="Leave" />

      <div className="flex gap-2 mb-5">
        {isStaffView && <TabButton active={tab === "my"} onClick={() => setTab("my")}>My Leave</TabButton>}
        {isStaffView && <TabButton active={tab === "apply"} onClick={() => setTab("apply")}>Apply</TabButton>}
        {isApprover && <TabButton active={tab === "approvals"} onClick={() => setTab("approvals")}>Approvals</TabButton>}
        {isApprover && <TabButton active={tab === "analytics"} onClick={() => setTab("analytics")}>Analytics</TabButton>}
      </div>

      {tab === "my" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {leaveTypes.map((lt) => (
            <Card key={lt.type}>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{lt.type}</p>
              <p className="font-display text-2xl text-ink-900">{lt.balance}<span className="text-sm text-slate-400 font-body"> / {lt.total}</span></p>
              <p className="text-xs text-slate-500 mt-1">{lt.used} used this year</p>
            </Card>
          ))}
        </div>
      )}

      {tab === "apply" && (
        <Card title="Apply for leave" className="max-w-lg">
          <form className="space-y-4 -mt-1" onSubmit={(e) => { e.preventDefault(); alert("Leave request submitted to Principal for approval (demo)."); }}>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Leave type</label>
              <select className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm bg-white" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {leaveTypes.map((lt) => <option key={lt.type}>{lt.type}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">From</label>
                <input type="date" className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">To</label>
                <input type="date" className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Reason</label>
              <textarea rows={3} className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm" placeholder="Briefly explain the reason for leave" />
            </div>
            <p className="text-xs text-slate-500">Approval flow: <span className="font-medium text-ink-900">You → Principal → Director Schools</span></p>
            <Button variant="accent" type="submit">Submit request</Button>
          </form>
        </Card>
      )}

      {(tab === "approvals" || (isStaffView && tab === "my")) && (
        <Card title={isApprover ? "Requests awaiting action" : "My request history"}>
          <div className="overflow-x-auto -mt-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
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
                {leaveRequests.map((l) => (
                  <tr key={l.id} className="border-t border-sand-100">
                    <td className="py-3 pr-4 font-medium text-ink-900">{l.employee}</td>
                    <td className="py-3 pr-4 text-slate-600">{l.type}</td>
                    <td className="py-3 pr-4 text-slate-600">{l.from} → {l.to}</td>
                    <td className="py-3 pr-4 text-slate-600">{l.days}</td>
                    <td className="py-3 pr-4 text-slate-600">{l.stage}</td>
                    <td className="py-3 pr-4"><StatusBadge status={l.status} /></td>
                    {isApprover && (
                      <td className="py-3 pr-4">
                        {l.status === "Pending" ? (
                          <div className="flex gap-2">
                            <Button variant="accent" className="px-3 py-1.5 text-xs">Approve</Button>
                            <Button variant="danger" className="px-3 py-1.5 text-xs">Reject</Button>
                          </div>
                        ) : <span className="text-xs text-slate-400">Resolved</span>}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "analytics" && (
        <Card title="Leave analytics">
          <p className="text-sm text-slate-500">Approval rate this quarter: <span className="text-ink-900 font-medium">88%</span> · Average decision time: <span className="text-ink-900 font-medium">1.4 days</span> · Most used type: <span className="text-ink-900 font-medium">Casual Leave</span></p>
        </Card>
      )}
    </div>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm font-medium ${active ? "bg-ink-800 text-white" : "bg-white border border-sand-200 text-slate-600 hover:bg-sand-50"}`}>
      {children}
    </button>
  );
}
