import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Admin Users</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Admin users are managed through Supabase Authentication. To add a new admin, create a user account and assign them the admin role in the user_roles table.
        </p>
        <div className="rounded-lg border border-border bg-surface p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Role System</h3>
          <p className="text-sm text-muted-foreground">
            The platform uses a role-based access control system. Admin users have full access to create, edit, and delete content. Regular users can only browse public content and submit claims.
          </p>
        </div>
      </div>
    </div>
  );
}
