import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/newsletter")({
  component: AdminNewsletterPage,
});

function AdminNewsletterPage() {
  const [signups, setSignups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("newsletter_signups").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setSignups(data || []); setLoading(false); });
  }, []);

  function exportCSV() {
    const csv = "Email,Source,Date\n" + signups.map((s) => `${s.email},${s.source || ""},${s.created_at}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter_signups.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Newsletter Signups</h1>
        {signups.length > 0 && <Button onClick={exportCSV} variant="outline" size="sm">Export CSV</Button>}
      </div>
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-10 bg-card animate-pulse rounded" />)}</div>
      ) : signups.length === 0 ? (
        <p className="text-muted-foreground">No signups yet.</p>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Email</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Source</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">{s.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.source || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
