import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FactCheckCard } from "@/components/shared/FactCheckCard";

export const Route = createFileRoute("/politicians/$id")({
  component: PoliticianDetailPage,
});

function PoliticianDetailPage() {
  const { id } = Route.useParams();
  const [politician, setPolitician] = useState<any>(null);
  const [factChecks, setFactChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("politicians").select("*").eq("id", id).single(),
      supabase.from("fact_checks").select("id, title, claim, verdict, excerpt, category, date, shares, sources_count, confidence_level").eq("politician_id", id).order("date", { ascending: false }),
    ]).then(([pRes, fcRes]) => {
      setPolitician(pRes.data);
      setFactChecks(fcRes.data || []);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background"><Header />
        <div className="mx-auto max-w-4xl px-4 py-16"><div className="h-32 bg-card animate-pulse rounded" /></div>
      </div>
    );
  }

  if (!politician) {
    return (
      <div className="min-h-screen bg-background"><Header />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Politician not found</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">Go home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block">← Home</Link>
        <div className="flex items-center gap-4 mb-8">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-foreground"
            style={{ backgroundColor: politician.avatar_color || "#B11226" }}
          >
            {politician.initials || politician.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{politician.name}</h1>
            {politician.role && <p className="text-muted-foreground">{politician.role}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-verdict-true">{politician.true_pct ?? 0}%</p>
            <p className="text-xs text-muted-foreground">True</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-verdict-false">{politician.false_pct ?? 0}%</p>
            <p className="text-xs text-muted-foreground">False</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-verdict-misleading">{politician.misleading_pct ?? 0}%</p>
            <p className="text-xs text-muted-foreground">Misleading</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4">Related Fact Checks</h2>
        {factChecks.length === 0 ? (
          <p className="text-muted-foreground">No fact-checks associated with this politician yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {factChecks.map((fc) => (
              <FactCheckCard key={fc.id} id={fc.id} title={fc.title} claim={fc.claim} verdict={fc.verdict} excerpt={fc.excerpt} category={fc.category} date={fc.date} sourcesCount={fc.sources_count ?? 0} confidenceLevel={fc.confidence_level} shares={fc.shares ?? 0} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
