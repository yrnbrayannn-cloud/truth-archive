import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/fact-checks/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    edit: (search.edit as string) || "",
    claim: (search.claim as string) || "",
  }),
  component: FactCheckEditor,
});

function FactCheckEditor() {
  const { edit, claim } = Route.useSearch();
  const navigate = useNavigate();
  const [politicians, setPoliticians] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", claim: claim || "", verdict: "unverified", excerpt: "", author: "",
    category: "Politics", featured: false, politician_id: "", sources_count: 0,
    confidence_level: "medium", shares: 0,
  });

  useEffect(() => {
    supabase.from("politicians").select("id, name").then(({ data }) => setPoliticians(data || []));
  }, []);

  useEffect(() => {
    if (edit) {
      supabase.from("fact_checks").select("*").eq("id", edit).single().then(({ data }) => {
        if (data) setForm({
          title: data.title, claim: data.claim, verdict: data.verdict,
          excerpt: data.excerpt || "", author: data.author || "",
          category: data.category || "Politics", featured: data.featured ?? false,
          politician_id: data.politician_id || "", sources_count: data.sources_count ?? 0,
          confidence_level: data.confidence_level || "medium", shares: data.shares ?? 0,
        });
      });
    }
  }, [edit]);

  async function handleSave(publish: boolean) {
    if (!form.title || !form.claim || !form.verdict) return;
    setSaving(true);
    const payload = {
      title: form.title, claim: form.claim, verdict: form.verdict,
      excerpt: form.excerpt || null, author: form.author || null,
      category: form.category || null, featured: form.featured,
      politician_id: form.politician_id || null, sources_count: form.sources_count,
      confidence_level: form.confidence_level, shares: form.shares,
      date: new Date().toISOString(),
    };
    if (edit) {
      await supabase.from("fact_checks").update(payload).eq("id", edit);
    } else {
      await supabase.from("fact_checks").insert(payload);
    }
    setSaving(false);
    navigate({ to: "/admin/fact-checks" });
  }

  function updateField(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">{edit ? "Edit" : "New"} Fact Check</h1>
      <div className="space-y-5">
        <Field label="Title *">
          <input value={form.title} onChange={(e) => updateField("title", e.target.value)} className="input-field" placeholder="Fact check title" />
        </Field>
        <Field label="Claim *">
          <textarea value={form.claim} onChange={(e) => updateField("claim", e.target.value)} rows={3} className="input-field" placeholder="The original claim" />
        </Field>
        <Field label="Verdict *">
          <select value={form.verdict} onChange={(e) => updateField("verdict", e.target.value)} className="input-field">
            <option value="true">True</option>
            <option value="false">False</option>
            <option value="misleading">Misleading</option>
            <option value="unverified">Unverified</option>
            <option value="partly-true">Partly True</option>
          </select>
        </Field>
        <Field label="Excerpt">
          <textarea value={form.excerpt} onChange={(e) => updateField("excerpt", e.target.value)} rows={4} className="input-field" placeholder="Detailed analysis" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Author"><input value={form.author} onChange={(e) => updateField("author", e.target.value)} className="input-field" /></Field>
          <Field label="Category">
            <select value={form.category} onChange={(e) => updateField("category", e.target.value)} className="input-field">
              <option>Politics</option><option>Economy</option><option>Health</option><option>Education</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Politician">
            <select value={form.politician_id} onChange={(e) => updateField("politician_id", e.target.value)} className="input-field">
              <option value="">None</option>
              {politicians.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Confidence Level">
            <select value={form.confidence_level} onChange={(e) => updateField("confidence_level", e.target.value)} className="input-field">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Sources Count">
            <input type="number" min={0} value={form.sources_count} onChange={(e) => updateField("sources_count", parseInt(e.target.value) || 0)} className="input-field" />
          </Field>
          <div className="flex items-end gap-2 pb-1">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} className="rounded" />
              Featured
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button onClick={() => handleSave(true)} disabled={saving}>{saving ? "Saving…" : "Publish"}</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/admin/fact-checks" })}>Cancel</Button>
        </div>
      </div>
      <style>{`.input-field { width: 100%; height: 40px; padding: 0 12px; border-radius: 6px; border: 1px solid var(--border); background: var(--surface); color: var(--foreground); font-size: 14px; } .input-field:focus { outline: none; box-shadow: 0 0 0 2px color-mix(in oklab, var(--primary) 50%, transparent); } textarea.input-field { height: auto; padding: 8px 12px; }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
