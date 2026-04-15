import { type ReactNode } from "react";

type VerdictType = "true" | "false" | "misleading" | "unverified" | "partly-true";

const verdictConfig: Record<VerdictType, { label: string; className: string }> = {
  true: { label: "TRUE", className: "bg-verdict-true/20 text-verdict-true border-verdict-true/30" },
  false: { label: "FALSE", className: "bg-verdict-false/20 text-verdict-false border-verdict-false/30" },
  misleading: { label: "MISLEADING", className: "bg-verdict-misleading/20 text-verdict-misleading border-verdict-misleading/30" },
  unverified: { label: "UNVERIFIED", className: "bg-verdict-unverified/20 text-verdict-unverified border-verdict-unverified/30" },
  "partly-true": { label: "PARTLY TRUE", className: "bg-verdict-misleading/20 text-verdict-misleading border-verdict-misleading/30" },
};

export function VerdictBadge({ verdict, size = "sm" }: { verdict: string; size?: "sm" | "md" | "lg" }) {
  const config = verdictConfig[verdict as VerdictType] || verdictConfig.unverified;
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };
  return (
    <span className={`inline-flex items-center rounded border font-bold tracking-wider uppercase ${config.className} ${sizeClasses[size]}`}>
      {config.label}
    </span>
  );
}
