export function KpiCard({ label, value, trend }) {
  return (
    <div className="bg-white rounded-xl2 shadow-card border border-sand-200 p-5 flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
      <span className="font-display text-3xl text-ink-900">{value}</span>
      <span className="text-xs text-emerald-700">{trend}</span>
    </div>
  );
}

const statusStyles = {
  Present: "bg-emerald-100 text-emerald-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Active: "bg-emerald-100 text-emerald-700",
  Late: "bg-amber-100 text-amber-700",
  Pending: "bg-amber-100 text-amber-700",
  "On Leave": "bg-amber-100 text-amber-700",
  Absent: "bg-rose-100 text-rose-600",
  Rejected: "bg-rose-100 text-rose-600",
  Inactive: "bg-slate-300/50 text-slate-700",
};

export function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-slate-300/50 text-slate-700"}`}>
      {status}
    </span>
  );
}

export function Card({ title, action, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl2 shadow-card border border-sand-200 ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 pt-5">
          <h3 className="font-display text-lg text-ink-900">{title}</h3>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {eyebrow && <p className="text-xs uppercase tracking-wide text-emerald-700 font-medium mb-1">{eyebrow}</p>}
        <h1 className="font-display text-2xl md:text-3xl text-ink-900">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function Avatar({ name, color }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
      style={{ backgroundColor: color || "#11203A" }}
    >
      {initials}
    </div>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2";
  const styles = {
    primary: "bg-ink-800 text-white hover:bg-ink-700",
    accent: "bg-emerald-600 text-white hover:bg-emerald-700",
    ghost: "bg-transparent text-slate-700 hover:bg-sand-100 border border-sand-200",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
