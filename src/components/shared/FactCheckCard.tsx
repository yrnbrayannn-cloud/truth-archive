import { Link } from "@tanstack/react-router";
import { VerdictBadge } from "./VerdictBadge";

interface FactCheckCardProps {
  id: string;
  title: string;
  claim: string;
  verdict: string;
  excerpt?: string | null;
  category?: string | null;
  date?: string | null;
  sourcesCount?: number;
  confidenceLevel?: string | null;
  shares?: number;
}

export function FactCheckCard({ id, title, claim, verdict, excerpt, category, date, sourcesCount = 0, confidenceLevel, shares }: FactCheckCardProps) {
  return (
    <Link
      to="/fact-checks/$id"
      params={{ id }}
      className="group block rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:bg-surface-elevated hover-scale"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <VerdictBadge verdict={verdict} size="md" />
        {category && (
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{category}</span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{excerpt || claim}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {date && <span>{new Date(date).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}</span>}
        {sourcesCount > 0 && <span>{sourcesCount} sources</span>}
        {confidenceLevel && <span className="capitalize">{confidenceLevel} confidence</span>}
        {typeof shares === "number" && shares > 0 && <span>{shares} shares</span>}
      </div>
    </Link>
  );
}
