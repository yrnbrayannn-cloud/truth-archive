import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { VerdictBadge } from "@/components/shared/VerdictBadge";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

interface FeaturedCheck {
  id: string;
  title: string;
  verdict: string;
  excerpt: string | null;
  category: string | null;
}

export function HeroSection() {
  const [featured, setFeatured] = useState<FeaturedCheck | null>(null);

  useEffect(() => {
    supabase
      .from("fact_checks")
      .select("id, title, verdict, excerpt, category")
      .eq("featured", true)
      .order("date", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setFeatured(data[0]);
      });
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-primary" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Truth Verification Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-4">
            Verifying Kenya's
            <br />
            <span className="text-primary">Public Claims</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Data-driven fact-checking holding public figures accountable. Search, explore, and understand the truth behind every claim.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/fact-checks">
              <Button variant="hero" size="xl">Explore Verdicts</Button>
            </Link>
            <Link to="/submit">
              <Button variant="hero-outline" size="xl">Submit Claim</Button>
            </Link>
          </div>
        </div>

        {featured && (
          <Link
            to="/fact-checks/$id"
            params={{ id: featured.id }}
            className="mt-10 block max-w-xl rounded-lg border border-border bg-card/80 backdrop-blur-sm p-5 transition-all duration-300 hover:border-primary/40 hover-scale animate-fade-in-up opacity-0 stagger-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-gold">Featured</span>
              <VerdictBadge verdict={featured.verdict} />
            </div>
            <h3 className="text-base font-semibold text-foreground">{featured.title}</h3>
            {featured.excerpt && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{featured.excerpt}</p>}
          </Link>
        )}
      </div>
    </section>
  );
}
