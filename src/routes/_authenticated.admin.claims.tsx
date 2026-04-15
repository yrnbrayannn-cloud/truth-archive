import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/claims")({
  component: AdminClaimsPage,
});

function AdminClaimsPage() {
  const [claims, setClaims] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  function loadClaims() {
    setLoading(true);
    supabase
      .from("claim_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setClaims(data || []); setLoading(false); });
  }

  useEffect(() => { loadClaims(); }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from("claim_submissions").update({ status }).eq("id", id);
    loadClaims();
    if (selected?.id === id) setSelected({ ...selected, status });
  }

  const statusColors: Record<string, string> = {
    pending: "bg-gold/20 text-gold",
    investigating: "bg-primary/20 text-primary",
    verified: "bg-verdict-true/20 text-verdict-true",
    rejected: "bg-verdict-false/20 text-verdict-false",
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Claims Management</h1>
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-card animate-pulse rounded" />)}</div>
      ) : claims.length === 0 ? (
        <p className="text-muted-foreground">No claims submitted yet.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Claim</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Date</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-surface-elevated/50 transition-colors">
                  <td className="px-4 py-3 text-foreground max-w-xs truncate">{c.claim_text}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[c.status] || ""}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="ghost" onClick={() => setSelected(c)}>View</Button>
                      <select
                        value={c.status}
                        onChange={(e) => updateStatus(c.id, e.target.value)}
                        className="h-8 px-2 rounded border border-border bg-surface text-foreground text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="investigating">Investigating</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-lg p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-foreground mb-3">Claim Details</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">Claim:</span><p className="text-foreground mt-1">{selected.claim_text}</p></div>
              {selected.context && <div><span className="text-muted-foreground">Context:</span><p className="text-foreground mt-1">{selected.context}</p></div>}
              {selected.source && <div><span className="text-muted-foreground">Source:</span><p className="text-foreground mt-1">{selected.source}</p></div>}
              {selected.email && <div><span className="text-muted-foreground">Email:</span><p className="text-foreground mt-1">{selected.email}</p></div>}
              <div><span className="text-muted-foreground">Status:</span><span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[selected.status] || ""}`}>{selected.status}</span></div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button size="sm" variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
