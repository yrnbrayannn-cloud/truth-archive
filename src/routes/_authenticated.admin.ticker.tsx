import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/ticker")({
  component: AdminTickerPage,
});

function AdminTickerPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ headline: "", label: "", priority: 0 });

  function load() {
    setLoading(true);
    supabase.from("ticker_items").select("*").order("priority", { ascending: false }).then(({ data }) => { setItems(data || []); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!form.headline) return;
    await supabase.from("ticker_items").insert({ headline: form.headline, label: form.label || null, priority: form.priority, is_active: true });
    setForm({ headline: "", label: "", priority: 0 });
    load();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("ticker_items").update({ is_active: !current }).eq("id", id);
    load();
  }

  async function handleDelete(id: string) {
    await supabase.from("ticker_items").delete().eq("id", id);
    load();
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Ticker Management</h1>
      <div className="rounded-lg border border-border bg-card p-5 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Add Headline</h2>
        <div className="flex gap-2">
          <input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="Headline text" className="flex-1 h-9 px-3 rounded-md border border-border bg-surface text-foreground text-sm" />
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label" className="w-24 h-9 px-3 rounded-md border border-border bg-surface text-foreground text-sm" />
          <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} placeholder="Priority" className="w-20 h-9 px-3 rounded-md border border-border bg-surface text-foreground text-sm" />
          <Button onClick={handleAdd} size="sm">Add</Button>
        </div>
      </div>
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-card animate-pulse rounded" />)}</div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground">No ticker items yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
              <button onClick={() => toggleActive(item.id, item.is_active)} className={`h-3 w-3 rounded-full ${item.is_active ? "bg-verdict-true" : "bg-muted-foreground"}`} title={item.is_active ? "Active" : "Inactive"} />
              <span className="text-sm text-foreground flex-1">{item.headline}</span>
              {item.label && <span className="text-xs text-gold">{item.label}</span>}
              <span className="text-xs text-muted-foreground">P:{item.priority}</span>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="text-destructive">Delete</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
