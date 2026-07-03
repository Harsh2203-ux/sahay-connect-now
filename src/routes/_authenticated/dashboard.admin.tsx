import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, ShieldCheck, Users, Building2, Scale, Flag, Settings } from "lucide-react";
import { DashboardShell, StatCard, Panel, EmptyState, type NavItem } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard/admin")({
  component: AdminDashboard,
});

const nav: NavItem[] = [
  { to: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/admin", label: "Verifications", icon: ShieldCheck },
  { to: "/dashboard/admin", label: "Users", icon: Users },
  { to: "/dashboard/admin", label: "NGOs", icon: Building2 },
  { to: "/dashboard/admin", label: "Lawyers", icon: Scale },
  { to: "/dashboard/admin", label: "Reports", icon: Flag },
  { to: "/dashboard/admin", label: "Settings", icon: Settings },
];

function AdminDashboard() {
  return (
    <DashboardShell title="Admin" navItems={nav}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin console</h1>
          <p className="mt-1 text-sm text-muted-foreground">Oversee the Sahay platform — verifications, users and reports.</p>
        </div>
        <Button variant="outline">Export data</Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value="1" icon={Users} />
        <StatCard label="Verified NGOs" value="0" icon={Building2} />
        <StatCard label="Verified lawyers" value="0" icon={Scale} />
        <StatCard label="Pending verifications" value="0" icon={ShieldCheck} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Verification queue">
            <EmptyState
              icon={ShieldCheck}
              title="No pending verifications"
              description="New NGO and lawyer applications will appear here."
            />
          </Panel>
        </div>
        <Panel title="Reports">
          <EmptyState
            icon={Flag}
            title="No reports"
            description="User-submitted reports will show here."
          />
        </Panel>
      </div>
    </DashboardShell>
  );
}
