import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

interface Politician {
  id: string;
  name: string;
  role: string | null;
  initials: string | null;
  avatar_color: string | null;
  true_pct: number | null;
  false_pct: number | null;
  misleading_pct: number | null;
}

function PoliticianCard({ p, label }: { p: Politician; label: string }) {
  return (
    <Link
      to="/politicians/$id"
      params={{ id: p.id }}
      className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:bg-surface-elevated transition-all duration-300 hover-scale"
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-foreground"
        style={{ backgroundColor: p.avatar_color || "#B11226" }}
      >
        {p.initials || p.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gold font-semibold tracking-wider uppercase mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
        {p.role && <p className="text-xs text-muted-foreground">{p.role}</p>}
      </div>
      <div className="text-right text-xs text-muted-foreground">
        <div>True: {p.true_pct ?? 0}%</div>
        <div>False: {p.false_pct ?? 0}%</div>
      </div>
    </Link>
  );
}

export function PoliticianSpotlight() {
  const [politicians, setPoliticians] = useState<Politician[]>([]);

  useEffect(() => {
    supabase
      .from("politicians")
      .select("*")
      .then(({ data }) => setPoliticians(data || []));
  }, []);

  if (politicians.length === 0) return null;

  const mostMisleading = [...politicians].sort((a, b) => (b.false_pct ?? 0) - (a.false_pct ?? 0))[0];
  const mostAccurate = [...politicians].sort((a, b) => (b.true_pct ?? 0) - (a.true_pct ?? 0))[0];
  const recent = politicians[0];

  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-px w-6 bg-gold" />
          <h2 className="text-2xl font-bold text-foreground">Politician Spotlight</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mostMisleading && <PoliticianCard p={mostMisleading} label="Most Misleading" />}
          {mostAccurate && <PoliticianCard p={mostAccurate} label="Most Accurate" />}
          {recent && <PoliticianCard p={recent} label="Recently Checked" />}
        </div>
      </div>
    </section>
  );
}
