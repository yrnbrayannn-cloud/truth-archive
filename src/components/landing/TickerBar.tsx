import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function TickerBar() {
  const [items, setItems] = useState<{ id: string; headline: string; label: string | null }[]>([]);

  useEffect(() => {
    supabase
      .from("ticker_items")
      .select("id, headline, label")
      .eq("is_active", true)
      .order("priority", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="border-b border-border bg-surface overflow-hidden">
      <div className="flex items-center h-8">
        <div className="shrink-0 px-3 bg-primary h-full flex items-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary-foreground">Breaking</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker flex whitespace-nowrap">
            {[...items, ...items].map((item, i) => (
              <span key={`${item.id}-${i}`} className="mx-8 text-xs text-muted-foreground">
                {item.label && <span className="text-gold font-semibold mr-1">{item.label}:</span>}
                {item.headline}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
