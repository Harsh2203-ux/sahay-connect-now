import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Briefcase, Users, Calendar, Star, MessageSquare, Settings } from "lucide-react";
import { DashboardShell, StatCard, Panel, EmptyState, type NavItem } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard/lawyer")({
  component: LawyerDashboard,
});

const nav: NavItem[] = [
  { to: "/dashboard/lawyer", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/lawyer", label: "Cases", icon: Briefcase },
  { to: "/dashboard/lawyer", label: "Clients", icon: Users },
  { to: "/dashboard/lawyer", label: "Appointments", icon: Calendar },
  { to: "/dashboard/lawyer", label: "Reviews", icon: Star },
  { to: "/dashboard/lawyer", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/lawyer", label: "Settings", icon: Settings },
];

function LawyerDashboard() {
  return (
    <DashboardShell title="Lawyer" navItems={nav}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Lawyer dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your practice, cases and appointments.</p>
        </div>
        <Button>New availability</Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active cases" value="0" icon={Briefcase} />
        <StatCard label="Clients" value="0" icon={Users} />
        <StatCard label="Upcoming" value="0" icon={Calendar} />
        <StatCard label="Avg. rating" value="—" icon={Star} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Recent case activity">
            <EmptyState
              icon={Briefcase}
              title="No cases yet"
              description="Once clients reach out, their cases will appear here."
            />
          </Panel>
        </div>
        <Panel title="Profile completion">
          <ul className="space-y-3 text-sm">
            {[
              ["Basic info", true],
              ["Bar council ID", false],
              ["Specializations", true],
              ["Availability", false],
            ].map(([label, done]) => (
              <li key={label as string} className="flex items-center justify-between">
                <span className="text-muted-foreground">{label as string}</span>
                <span className={done ? "text-emerald" : "text-muted-foreground"}>
                  {done ? "Complete" : "Pending"}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </DashboardShell>
  );
}
