import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { VerdictBadge } from "@/components/shared/VerdictBadge";

interface SearchResult {
  id: string;
  title: string;
  verdict: string;
  category: string | null;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("fact_checks")
        .select("id, title, verdict, category")
        .ilike("title", `%${query}%`)
        .limit(8);
      setResults(data || []);
      setOpen(true);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function highlightMatch(text: string) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">{part}</mark> : part
    );
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Search Any Claim</h2>
          <p className="text-sm text-muted-foreground">Type to search verified fact-checks instantly</p>
        </div>
        <div ref={ref} className="relative">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any claim, politician, or topic…"
              className="w-full h-12 pl-11 pr-4 rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </div>
          {open && (
            <div className="absolute top-full mt-2 w-full rounded-lg border border-border bg-card shadow-xl z-50 overflow-hidden animate-fade-in">
              {results.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No results found. Try a different search term or explore <Link to="/fact-checks" className="text-primary hover:underline">all fact-checks</Link>.
                </div>
              ) : (
                results.map((r) => (
                  <Link
                    key={r.id}
                    to="/fact-checks/$id"
                    params={{ id: r.id }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-0"
                    onClick={() => setOpen(false)}
                  >
                    <VerdictBadge verdict={r.verdict} size="sm" />
                    <span className="text-sm text-foreground flex-1 line-clamp-1">{highlightMatch(r.title)}</span>
                    {r.category && <span className="text-xs text-muted-foreground">{r.category}</span>}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
