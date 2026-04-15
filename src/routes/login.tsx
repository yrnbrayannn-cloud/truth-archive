import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Admin Login — Sema Data" }],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    // Check admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Authentication failed"); setLoading(false); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const isAdmin = roles?.some((r) => r.role === "admin");
    if (!isAdmin) {
      setError("You do not have admin access.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-primary mx-auto mb-3">
            <span className="text-lg font-black text-primary-foreground">S</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Sema Data Verification Engine</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="admin@semadata.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
