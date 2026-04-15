import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FactCheckCard } from "@/components/shared/FactCheckCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/fact-checks")({
  component: FactChecksPage,
  head: () => ({
    meta: [
      { title: "Fact Checks — Sema Data" },
      { name: "description", content: "Browse all verified fact-checks on Kenya's public claims." },
    ],
  }),
});

const categories = ["All", "Politics", "Economy", "Health", "Education"];

function FactChecksPage() {
  const [factChecks, setFactChecks] = useState<any[]>([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"latest" | "critical">("latest");
  const [verdictFilter, setVerdictFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let query = supabase
      .from("fact_checks")
      .select("id, title, claim, verdict, excerpt, category, date, shares, sources_count, confidence_level");

    if (category !== "All") {
      query = query.ilike("category", category);
    }
    if (verdictFilter !== "all") {
      query = query.eq("verdict", verdictFilter);
    }
    if (sort === "latest") {
      query = query.order("date", { ascending: false });
    } else {
      query = query.order("shares", { ascending: false });
    }

    query.limit(50).then(({ data }) => {
      setFactChecks(data || []);
      setLoading(false);
    });
  }, [category, sort, verdictFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Fact Checks</h1>
        <p className="text-muted-foreground mb-8">Browse all verified claims</p>

        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                category === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <select
            value={verdictFilter}
            onChange={(e) => setVerdictFilter(e.target.value)}
            className="h-9 px-3 rounded-md border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Verdicts</option>
            <option value="true">True</option>
            <option value="false">False</option>
            <option value="misleading">Misleading</option>
            <option value="unverified">Unverified</option>
            <option value="partly-true">Partly True</option>
          </select>
          <div className="flex rounded-md border border-border overflow-hidden">
            <button
              onClick={() => setSort("latest")}
              className={`px-3 py-1.5 text-sm ${sort === "latest" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`}
            >
              Latest
            </button>
            <button
              onClick={() => setSort("critical")}
              className={`px-3 py-1.5 text-sm ${sort === "critical" ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"}`}
            >
              Most Critical
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-card animate-pulse" />
            ))}
          </div>
        ) : factChecks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">No fact-checks found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or check back later.</p>
            <Link to="/" className="mt-4 inline-block">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {factChecks.map((fc) => (
              <FactCheckCard
                key={fc.id}
                id={fc.id}
                title={fc.title}
                claim={fc.claim}
                verdict={fc.verdict}
                excerpt={fc.excerpt}
                category={fc.category}
                date={fc.date}
                sourcesCount={fc.sources_count ?? 0}
                confidenceLevel={fc.confidence_level}
                shares={fc.shares ?? 0}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
