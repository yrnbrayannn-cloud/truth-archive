import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function DataInsights() {
  const [stats, setStats] = useState<{ total_fact_checks: number | null; false_claims_pct: number | null; politicians_tracked: number | null } | null>(null);

  useEffect(() => {
    supabase
      .from("site_stats")
      .select("total_fact_checks, false_claims_pct, politicians_tracked")
      .limit(1)
      .single()
      .then(({ data }) => setStats(data));
  }, []);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-px w-6 bg-primary" />
          <h2 className="text-2xl font-bold text-foreground">Data Insights</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <p className="text-3xl font-bold text-primary">{stats?.total_fact_checks ?? 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Claims Verified</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <p className="text-3xl font-bold text-verdict-false">{stats?.false_claims_pct ?? 0}%</p>
            <p className="text-sm text-muted-foreground mt-1">False Claims Rate</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <p className="text-3xl font-bold text-gold">{stats?.politicians_tracked ?? 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Politicians Tracked</p>
          </div>
        </div>
      </div>
    </section>
  );
}
