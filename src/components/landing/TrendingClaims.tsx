import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FactCheckCard } from "@/components/shared/FactCheckCard";

interface FactCheck {
  id: string;
  title: string;
  claim: string;
  verdict: string;
  excerpt: string | null;
  category: string | null;
  date: string | null;
  shares: number | null;
  sources_count: number | null;
  confidence_level: string | null;
}

export function TrendingClaims() {
  const [claims, setClaims] = useState<FactCheck[]>([]);

  useEffect(() => {
    supabase
      .from("fact_checks")
      .select("id, title, claim, verdict, excerpt, category, date, shares, sources_count, confidence_level")
      .order("shares", { ascending: false })
      .limit(6)
      .then(({ data }) => setClaims(data || []));
  }, []);

  if (claims.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-px w-6 bg-primary" />
          <h2 className="text-2xl font-bold text-foreground">Trending Claims</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {claims.map((c, i) => (
            <div key={c.id} className={`animate-fade-in-up opacity-0 stagger-${i + 1}`}>
              <FactCheckCard
                id={c.id}
                title={c.title}
                claim={c.claim}
                verdict={c.verdict}
                excerpt={c.excerpt}
                category={c.category}
                date={c.date}
                sourcesCount={c.sources_count ?? 0}
                confidenceLevel={c.confidence_level}
                shares={c.shares ?? 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
