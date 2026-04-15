import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VerdictBadge } from "@/components/shared/VerdictBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/fact-checks/$id")({
  component: FactCheckDetailPage,
});

function FactCheckDetailPage() {
  const { id } = Route.useParams();
  const [fc, setFc] = useState<any>(null);
  const [politician, setPolitician] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase
      .from("fact_checks")
      .select("*, politicians(id, name, role)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setFc(data);
        if (data?.politicians) setPolitician(data.politicians);
        setLoading(false);
      });
  }, [id]);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="h-8 w-48 bg-card animate-pulse rounded mb-4" />
          <div className="h-12 w-full bg-card animate-pulse rounded mb-4" />
          <div className="h-64 w-full bg-card animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!fc) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Fact-check not found</h1>
          <Link to="/fact-checks"><Button variant="outline">Browse all fact-checks</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/fact-checks" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block">
          ← Back to Fact Checks
        </Link>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <VerdictBadge verdict={fc.verdict} size="lg" />
          {fc.category && <span className="text-sm text-muted-foreground uppercase tracking-wider">{fc.category}</span>}
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">{fc.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
          {fc.author && <span>By {fc.author}</span>}
          {fc.date && <span>{new Date(fc.date).toLocaleDateString("en-KE", { month: "long", day: "numeric", year: "numeric" })}</span>}
          {fc.sources_count > 0 && <span>{fc.sources_count} sources</span>}
          {fc.confidence_level && <span className="capitalize">{fc.confidence_level} confidence</span>}
        </div>

        <div className="rounded-lg border border-border bg-card p-6 mb-8">
          <h2 className="text-sm font-semibold text-gold uppercase tracking-wider mb-2">The Claim</h2>
          <p className="text-foreground">{fc.claim}</p>
        </div>

        {fc.excerpt && (
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-muted-foreground leading-relaxed">{fc.excerpt}</p>
          </div>
        )}

        {politician && (
          <div className="rounded-lg border border-border bg-card p-4 mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Associated Politician</h3>
            <Link to="/politicians/$id" params={{ id: politician.id }} className="flex items-center gap-3 hover:bg-surface-elevated p-2 rounded transition-colors">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                {politician.name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{politician.name}</p>
                {politician.role && <p className="text-xs text-muted-foreground">{politician.role}</p>}
              </div>
            </Link>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </article>
      <Footer />
    </div>
  );
}
