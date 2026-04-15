import { Link, useLocation } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "📊" },
  { to: "/admin/claims", label: "Claims", icon: "📥" },
  { to: "/admin/fact-checks", label: "Fact Checks", icon: "✅" },
  { to: "/admin/politicians", label: "Politicians", icon: "🧑‍⚖️" },
  { to: "/admin/ticker", label: "Ticker", icon: "📰" },
  { to: "/admin/newsletter", label: "Newsletter", icon: "📧" },
  { to: "/admin/settings", label: "Settings", icon: "⚙️" },
] as const;

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    supabase.from("claim_submissions").select("id", { count: "exact", head: true }).eq("status", "pending").then(({ count }) => {
      setPendingCount(count ?? 0);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-sidebar min-h-screen flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
            <span className="text-xs font-black text-primary-foreground">S</span>
          </div>
          <div>
            <span className="text-sm font-bold text-sidebar-foreground">SEMA DATA</span>
            <span className="block text-[10px] text-muted-foreground">Admin Panel</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== "/admin" && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.label === "Claims" && pendingCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
