import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { Card, PageHeader, StatusBadge, Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { campuses } from "../data/dummyData";

export default function Campuses() {
  const { role } = useAuth();
  const canManage = role === "Super Admin";
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <PageHeader
        eyebrow="Campus Management"
        title="Campuses"
        action={canManage ? <Button variant="accent" onClick={() => setShowForm(true)}><Plus size={16} /> Add campus</Button> : null}
      />

      {!canManage && (
        <div className="mb-5 text-xs bg-amber-100 text-amber-700 px-4 py-2.5 rounded-lg inline-block">
          Read-only view. Only Super Admin can create or edit campuses.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {campuses.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between -mt-1">
              <div>
                <p className="font-display text-lg text-ink-900">{c.name}</p>
                <p className="text-xs text-slate-500">{c.type} · {c.city}</p>
              </div>
              <StatusBadge status={c.active ? "Active" : "Inactive"} />
            </div>
            <div className="mt-4 space-y-1.5 text-sm text-slate-600">
              <p className="flex items-center gap-2"><MapPin size={14} className="text-emerald-700" /> {c.lat.toFixed(4)}, {c.lng.toFixed(4)}</p>
              <p>Geofence radius: <span className="font-medium text-ink-900">{c.radius}m</span></p>
              <p>Staff assigned: <span className="font-medium text-ink-900">{c.staff}</span></p>
            </div>
            {canManage && (
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" className="px-3 py-1.5 text-xs flex-1 justify-center">Edit</Button>
                <Button variant={c.active ? "danger" : "accent"} className="px-3 py-1.5 text-xs flex-1 justify-center">
                  {c.active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-ink-900/40 flex items-center justify-center z-30" onClick={() => setShowForm(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-xl2 p-6">
            <h3 className="font-display text-xl text-ink-900 mb-4">New campus</h3>
            <div className="space-y-3">
              <input placeholder="Campus name" className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm" />
              <select className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm bg-white">
                <option>Main</option><option>Branch</option><option>Regional</option>
              </select>
              <input placeholder="City" className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm" />
              <div className="flex gap-3">
                <input placeholder="Latitude" className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm" />
                <input placeholder="Longitude" className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm" />
              </div>
              <input placeholder="Geofence radius (m)" className="w-full px-3 py-2.5 rounded-lg border border-sand-200 text-sm" />
            </div>
            <div className="flex gap-2 mt-5">
              <Button variant="ghost" className="flex-1 justify-center" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="accent" className="flex-1 justify-center" onClick={() => setShowForm(false)}>Create campus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
