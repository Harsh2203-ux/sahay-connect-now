import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Users, FileText, MessageSquare, ShieldCheck, Settings } from "lucide-react";
import { DashboardShell, StatCard, Panel, EmptyState, type NavItem } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard/ngo")({
  component: NGODashboard,
});

const nav: NavItem[] = [
  { to: "/dashboard/ngo", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/ngo", label: "Organization", icon: Building2 },
  { to: "/dashboard/ngo", label: "Team", icon: Users },
  { to: "/dashboard/ngo", label: "Requests", icon: FileText },
  { to: "/dashboard/ngo", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/ngo", label: "Verification", icon: ShieldCheck },
  { to: "/dashboard/ngo", label: "Settings", icon: Settings },
];

function NGODashboard() {
  return (
    <DashboardShell title="NGO" navItems={nav}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">NGO dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your organization, team and incoming requests.</p>
        </div>
        <Button>Invite team member</Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open requests" value="0" icon={FileText} />
        <StatCard label="Team members" value="1" icon={Users} />
        <StatCard label="Programs" value="0" icon={Building2} />
        <StatCard label="Verification" value="Pending" icon={ShieldCheck} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Recent requests">
            <EmptyState
              icon={FileText}
              title="No requests yet"
              description="Requests from citizens will show up here for triage."
            />
          </Panel>
        </div>
        <Panel title="Verification checklist">
          <ul className="space-y-3 text-sm">
            {[
              ["Registration certificate", "Pending"],
              ["PAN & 80G", "Pending"],
              ["Authorized signatory", "Complete"],
              ["Contact verification", "Pending"],
            ].map(([k, v]) => (
              <li key={k} className="flex items-center justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className={v === "Complete" ? "text-emerald" : "text-muted-foreground"}>{v}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </DashboardShell>
  );
}
