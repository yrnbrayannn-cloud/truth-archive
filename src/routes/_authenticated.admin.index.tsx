import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({ factChecks: 0, pendingClaims: 0, politicians: 0, newsletters: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from("fact_checks").select("id", { count: "exact", head: true }),
      supabase.from("claim_submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("politicians").select("id", { count: "exact", head: true }),
      supabase.from("newsletter_signups").select("id", { count: "exact", head: true }),
      supabase.from("fact_checks").select("id, title, verdict, date").order("created_at", { ascending: false }).limit(5),
    ]).then(([fc, claims, pols, news, recent]) => {
      setStats({
        factChecks: fc.count ?? 0,
        pendingClaims: claims.count ?? 0,
        politicians: pols.count ?? 0,
        newsletters: news.count ?? 0,
      });
      setRecentActivity(recent.data || []);
    });
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Fact Checks" value={stats.factChecks} color="text-primary" />
        <StatCard label="Pending Claims" value={stats.pendingClaims} color="text-gold" />
        <StatCard label="Politicians Tracked" value={stats.politicians} color="text-foreground" />
        <StatCard label="Newsletter Signups" value={stats.newsletters} color="text-muted-foreground" />
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet. Start by publishing fact-checks.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.date ? new Date(item.date).toLocaleDateString() : ""}</p>
                </div>
                <span className="text-xs uppercase font-bold text-muted-foreground">{item.verdict}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
