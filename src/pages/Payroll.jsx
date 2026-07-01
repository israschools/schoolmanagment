import { useState } from "react";
import { Download, ChevronRight } from "lucide-react";
import { Card, PageHeader, Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { payrollSummary, paySlip, holidays } from "../data/dummyData";

export default function Payroll() {
  const { role } = useAuth();
  const isStaff = role === "Teacher";
  const [tab, setTab] = useState(isStaff ? "slip" : "summary");

  return (
    <div>
      <PageHeader eyebrow="Payroll" title={isStaff ? "My Salary" : "Payroll Management"} />

      <div className="flex gap-2 mb-5">
        {isStaff && <TabButton active={tab === "slip"} onClick={() => setTab("slip")}>My Pay Slip</TabButton>}
        {!isStaff && <TabButton active={tab === "summary"} onClick={() => setTab("summary")}>Summary</TabButton>}
        {!isStaff && <TabButton active={tab === "process"} onClick={() => setTab("process")}>Run Payroll</TabButton>}
        <TabButton active={tab === "holidays"} onClick={() => setTab("holidays")}>Holidays</TabButton>
      </div>

      {tab === "slip" && (
        <div className="max-w-xl">
          <Card title="Salary Slip — May 2026" action={<Button variant="ghost" className="text-xs px-3 py-1.5"><Download size={14} /> PDF</Button>}>
            <dl className="space-y-3 text-sm -mt-1">
              <div className="grid grid-cols-3 gap-2 bg-sand-50 rounded-lg p-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                <span>Component</span><span className="text-right">Amount (PKR)</span><span className="text-right">Note</span>
              </div>
              {[
                ["Basic Salary", paySlip.basic.toLocaleString(), ""],
                ["Allowances", paySlip.allowances.toLocaleString(), "House + Transport"],
                ["Overtime", paySlip.overtime.toLocaleString(), "2 hrs"],
                ["Late deduction", `− ${paySlip.deductionsLate.toLocaleString()}`, "3 late days"],
                ["Income tax", `− ${paySlip.tax.toLocaleString()}`, "Auto-calculated"],
              ].map(([k, v, note]) => (
                <div key={k} className="grid grid-cols-3 gap-2 border-b border-sand-100 pb-2">
                  <dt className="text-slate-600">{k}</dt>
                  <dd className="text-right font-mono text-ink-900">{v}</dd>
                  <dd className="text-right text-xs text-slate-400">{note}</dd>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2 bg-ink-900 text-white rounded-lg p-3 mt-2">
                <span className="font-semibold">Net Pay</span>
                <span className="text-right font-mono font-semibold col-span-2">PKR {paySlip.net.toLocaleString()}</span>
              </div>
            </dl>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              {[["Working days", paySlip.workingDays], ["Present", paySlip.presentDays], ["Leave", paySlip.leaveDays]].map(([k, v]) => (
                <div key={k} className="bg-sand-50 rounded-lg p-3">
                  <p className="text-slate-500">{k}</p>
                  <p className="font-display text-xl text-ink-900 mt-1">{v}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "summary" && (
        <Card title="Payroll summary — June 2026">
          <div className="overflow-x-auto -mt-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                  <th className="py-2 pr-4">Campus</th>
                  <th className="py-2 pr-4">Employees</th>
                  <th className="py-2 pr-4 text-right">Gross (PKR)</th>
                  <th className="py-2 pr-4 text-right">Deductions</th>
                  <th className="py-2 pr-4 text-right">Net Pay</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {payrollSummary.map((p) => (
                  <tr key={p.campus} className="border-t border-sand-100">
                    <td className="py-3 pr-4 font-medium text-ink-900">{p.campus}</td>
                    <td className="py-3 pr-4 text-slate-600">{p.employees}</td>
                    <td className="py-3 pr-4 text-right font-mono text-slate-700">{(p.gross / 1e6).toFixed(2)}M</td>
                    <td className="py-3 pr-4 text-right font-mono text-rose-600">−{(p.deductions / 1e6).toFixed(2)}M</td>
                    <td className="py-3 pr-4 text-right font-mono font-semibold text-ink-900">{(p.net / 1e6).toFixed(2)}M</td>
                    <td className="py-3 pr-4">
                      <Button variant="ghost" className="px-3 py-1.5 text-xs"><Download size={13} /> Export</Button>
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-sand-200">
                  <td className="py-3 pr-4 font-semibold text-ink-900">Total</td>
                  <td className="py-3 pr-4 font-semibold text-ink-900">{payrollSummary.reduce((s, p) => s + p.employees, 0)}</td>
                  <td className="py-3 pr-4 text-right font-mono font-semibold">{(payrollSummary.reduce((s, p) => s + p.gross, 0) / 1e6).toFixed(2)}M</td>
                  <td className="py-3 pr-4 text-right font-mono text-rose-600">−{(payrollSummary.reduce((s, p) => s + p.deductions, 0) / 1e6).toFixed(2)}M</td>
                  <td className="py-3 pr-4 text-right font-mono font-bold text-ink-900">{(payrollSummary.reduce((s, p) => s + p.net, 0) / 1e6).toFixed(2)}M</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "process" && (
        <div className="max-w-lg">
          <Card title="Run Payroll">
            <div className="space-y-4 -mt-1">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Select month</label>
                <input type="month" defaultValue="2026-07" className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Campus</label>
                <select className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm bg-white">
                  <option>All campuses</option>
                  <option>Main Campus</option>
                  <option>North Branch</option>
                  <option>Gulshan Branch</option>
                  <option>Hyderabad Regional</option>
                </select>
              </div>
              <div className="bg-amber-100 text-amber-700 rounded-lg px-4 py-3 text-sm">
                Salary calculation uses attendance records, approved leaves, holiday calendar, and late-arrival deductions. Sundays are auto-excluded as weekly offs.
              </div>
              <Button variant="accent" className="w-full justify-center" onClick={() => alert("Payroll processing initiated (demo). Salary slips will be auto-generated and emailed.")}>
                Process payroll
              </Button>
            </div>
          </Card>
        </div>
      )}

      {tab === "holidays" && (
        <Card title="Holiday calendar">
          <div className="space-y-3 -mt-1">
            <div className="bg-sand-50 rounded-lg px-4 py-2.5 text-xs text-slate-500 font-medium uppercase tracking-wide grid grid-cols-3 gap-4">
              <span>Date</span><span>Holiday</span><span>Type</span>
            </div>
            {holidays.map((h) => (
              <div key={h.date} className="grid grid-cols-3 gap-4 text-sm border-b border-sand-100 pb-3">
                <span className="font-mono text-slate-600">{h.date}</span>
                <span className="text-ink-900 font-medium">{h.name}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full w-fit ${h.type === "Public" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{h.type}</span>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="mt-4 text-xs"><ChevronRight size={14} /> Manage holidays</Button>
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
