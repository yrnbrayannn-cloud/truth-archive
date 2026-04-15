import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/politicians")({
  component: AdminPoliticiansPage,
});

function AdminPoliticiansPage() {
  const [politicians, setPoliticians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", role: "", initials: "", avatar_color: "#B11226", true_pct: 0, false_pct: 0, misleading_pct: 0 });

  function load() {
    setLoading(true);
    supabase.from("politicians").select("*").order("name").then(({ data }) => { setPoliticians(data || []); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setForm({ name: "", role: "", initials: "", avatar_color: "#B11226", true_pct: 0, false_pct: 0, misleading_pct: 0 });
    setEditing(null);
  }

  function startEdit(p: any) {
    setEditing(p);
    setForm({ name: p.name, role: p.role || "", initials: p.initials || "", avatar_color: p.avatar_color || "#B11226", true_pct: p.true_pct ?? 0, false_pct: p.false_pct ?? 0, misleading_pct: p.misleading_pct ?? 0 });
  }

  async function handleSave() {
    if (!form.name) return;
    const payload = { ...form, true_pct: Number(form.true_pct), false_pct: Number(form.false_pct), misleading_pct: Number(form.misleading_pct) };
    if (editing) {
      await supabase.from("politicians").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("politicians").insert(payload);
    }
    resetForm();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete politician?")) return;
    await supabase.from("politicians").delete().eq("id", id);
    load();
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Politicians Manager</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-card animate-pulse rounded" />)}</div>
          ) : politicians.length === 0 ? (
            <p className="text-muted-foreground">No politicians added yet.</p>
          ) : (
            <div className="space-y-2">
              {politicians.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-foreground" style={{ backgroundColor: p.avatar_color || "#B11226" }}>
                    {p.initials || p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.role || "—"}</p>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    T:{p.true_pct}% F:{p.false_pct}% M:{p.misleading_pct}%
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(p)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)} className="text-destructive">Del</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">{editing ? "Edit" : "Add"} Politician</h2>
          <div className="space-y-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name *" className="w-full h-9 px-3 rounded-md border border-border bg-surface text-foreground text-sm" />
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role/Title" className="w-full h-9 px-3 rounded-md border border-border bg-surface text-foreground text-sm" />
            <input value={form.initials} onChange={(e) => setForm({ ...form, initials: e.target.value })} placeholder="Initials" className="w-full h-9 px-3 rounded-md border border-border bg-surface text-foreground text-sm" />
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Color:</label>
              <input type="color" value={form.avatar_color} onChange={(e) => setForm({ ...form, avatar_color: e.target.value })} className="h-8 w-12 rounded border-0" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground">True %</label>
                <input type="number" min={0} max={100} value={form.true_pct} onChange={(e) => setForm({ ...form, true_pct: Number(e.target.value) })} className="w-full h-8 px-2 rounded border border-border bg-surface text-foreground text-xs" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground">False %</label>
                <input type="number" min={0} max={100} value={form.false_pct} onChange={(e) => setForm({ ...form, false_pct: Number(e.target.value) })} className="w-full h-8 px-2 rounded border border-border bg-surface text-foreground text-xs" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground">Misleading %</label>
                <input type="number" min={0} max={100} value={form.misleading_pct} onChange={(e) => setForm({ ...form, misleading_pct: Number(e.target.value) })} className="w-full h-8 px-2 rounded border border-border bg-surface text-foreground text-xs" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="flex-1">{editing ? "Update" : "Add"}</Button>
              {editing && <Button onClick={resetForm} size="sm" variant="outline">Cancel</Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
