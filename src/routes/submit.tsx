import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/submit")({
  component: SubmitClaimPage,
  head: () => ({
    meta: [
      { title: "Submit a Claim — Sema Data" },
      { name: "description", content: "Submit a public claim for verification by our fact-checking team." },
    ],
  }),
});

function SubmitClaimPage() {
  const [form, setForm] = useState({ claim_text: "", context: "", source: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.claim_text.trim()) return;
    setStatus("loading");
    const { error } = await supabase.from("claim_submissions").insert({
      claim_text: form.claim_text.trim(),
      context: form.context.trim() || null,
      source: form.source.trim() || null,
      email: form.email.trim() || null,
    });
    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setForm({ claim_text: "", context: "", source: "", email: "" });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Submit a Claim</h1>
        <p className="text-muted-foreground mb-8">
          Have you heard a public claim that needs verification? Submit it below and our team will investigate.
        </p>

        {status === "success" ? (
          <div className="rounded-lg border border-verdict-true/30 bg-verdict-true/10 p-6 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-2">Claim Submitted Successfully</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Your claim will be reviewed and verified by our team. The process typically follows:
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span className="px-3 py-1 rounded bg-gold/20 text-gold">Pending</span>
              <span>→</span>
              <span className="px-3 py-1 rounded bg-primary/20 text-primary">Investigating</span>
              <span>→</span>
              <span className="px-3 py-1 rounded bg-verdict-true/20 text-verdict-true">Verified</span>
            </div>
            <Button onClick={() => setStatus("idle")} variant="outline" className="mt-6">Submit Another</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Claim *</label>
              <textarea
                required
                value={form.claim_text}
                onChange={(e) => setForm({ ...form, claim_text: e.target.value })}
                placeholder="What public claim needs to be verified?"
                rows={4}
                className="w-full rounded-md border border-border bg-surface p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Context</label>
              <textarea
                value={form.context}
                onChange={(e) => setForm({ ...form, context: e.target.value })}
                placeholder="Where and when was this claim made?"
                rows={2}
                className="w-full rounded-md border border-border bg-surface p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Source</label>
              <input
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="Link or reference to the original claim"
                className="w-full h-10 px-3 rounded-md border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Your Email (optional)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="To receive updates about your submission"
                className="w-full h-10 px-3 rounded-md border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <Button type="submit" disabled={status === "loading"} size="lg" className="w-full">
              {status === "loading" ? "Submitting…" : "Submit Claim for Verification"}
            </Button>
            {status === "error" && <p className="text-sm text-destructive">Failed to submit. Please try again.</p>}
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}
