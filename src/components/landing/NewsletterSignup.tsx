import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    const { error } = await supabase.from("newsletter_signups").insert({ email, source: "landing" });
    setStatus(error ? "error" : "success");
    if (!error) setEmail("");
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Stay Informed</h2>
        <p className="text-sm text-muted-foreground mb-6">Get notified when new fact-checks are published.</p>
        {status === "success" ? (
          <p className="text-sm text-verdict-true">Thank you! You've been subscribed.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 h-10 px-4 rounded-md border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "..." : "Subscribe"}
            </Button>
          </form>
        )}
        {status === "error" && <p className="text-xs text-destructive mt-2">Something went wrong. Please try again.</p>}
      </div>
    </section>
  );
}
