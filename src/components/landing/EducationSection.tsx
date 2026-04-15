export function EducationSection() {
  const verdicts = [
    { label: "TRUE", color: "bg-verdict-true/20 text-verdict-true border-verdict-true/30", desc: "The claim is supported by verifiable evidence and reliable sources." },
    { label: "FALSE", color: "bg-verdict-false/20 text-verdict-false border-verdict-false/30", desc: "The claim is contradicted by evidence. The statement is factually incorrect." },
    { label: "MISLEADING", color: "bg-verdict-misleading/20 text-verdict-misleading border-verdict-misleading/30", desc: "The claim contains elements of truth but is presented in a deceptive way." },
    { label: "UNVERIFIED", color: "bg-verdict-unverified/20 text-verdict-unverified border-verdict-unverified/30", desc: "Insufficient evidence exists to confirm or deny the claim." },
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-px w-6 bg-gold" />
          <h2 className="text-2xl font-bold text-foreground">How Verification Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {verdicts.map((v) => (
            <div key={v.label} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold tracking-wider ${v.color}`}>
                {v.label}
              </span>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Our Process</h3>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">1</span> A public claim is identified or submitted by users.</li>
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">2</span> Our team researches primary sources, official records, and expert opinions.</li>
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">3</span> Evidence is weighed and a verdict is assigned with full transparency.</li>
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">4</span> The fact-check is published with all sources cited for public scrutiny.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
