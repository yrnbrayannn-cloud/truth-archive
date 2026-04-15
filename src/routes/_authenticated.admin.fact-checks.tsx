import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { VerdictBadge } from "@/components/shared/VerdictBadge";

export const Route = createFileRoute("/_authenticated/admin/fact-checks")({
  component: AdminFactChecksPage,
});

function AdminFactChecksPage() {
  const [factChecks, setFactChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    supabase.from("fact_checks").select("id, title, verdict, category, date, featured").order("created_at", { ascending: false })
      .then(({ data }) => { setFactChecks(data || []); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  async function toggleFeatured(id: string, current: boolean) {
    await supabase.from("fact_checks").update({ featured: !current }).eq("id", id);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this fact-check?")) return;
    await supabase.from("fact_checks").delete().eq("id", id);
    load();
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Fact Checks</h1>
        <Link to="/admin/fact-checks/new"><Button>New Fact Check</Button></Link>
      </div>
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-card animate-pulse rounded" />)}</div>
      ) : factChecks.length === 0 ? (
        <p className="text-muted-foreground">No fact-checks yet. Create your first one.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Title</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Verdict</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Category</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Featured</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {factChecks.map((fc) => (
                <tr key={fc.id} className="border-t border-border hover:bg-surface-elevated/50 transition-colors">
                  <td className="px-4 py-3 text-foreground max-w-xs truncate">{fc.title}</td>
                  <td className="px-4 py-3"><VerdictBadge verdict={fc.verdict} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{fc.category || "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(fc.id, fc.featured)} className={`h-5 w-5 rounded border ${fc.featured ? "bg-primary border-primary" : "border-border"}`}>
                      {fc.featured && <svg className="h-5 w-5 text-primary-foreground" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Link to="/admin/fact-checks/new" search={{ edit: fc.id }}><Button size="sm" variant="ghost">Edit</Button></Link>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(fc.id)} className="text-destructive hover:text-destructive">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
