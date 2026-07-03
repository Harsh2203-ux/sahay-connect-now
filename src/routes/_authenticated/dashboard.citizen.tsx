import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, FileText, MessageSquare, Calendar, Search, Bookmark, Settings } from "lucide-react";
import { DashboardShell, StatCard, Panel, EmptyState, type NavItem } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard/citizen")({
  component: CitizenDashboard,
});

const nav: NavItem[] = [
  { to: "/dashboard/citizen", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/citizen", label: "My Requests", icon: FileText },
  { to: "/dashboard/citizen", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/citizen", label: "Appointments", icon: Calendar },
  { to: "/dashboard/citizen", label: "Saved", icon: Bookmark },
  { to: "/dashboard/citizen", label: "Settings", icon: Settings },
];

function CitizenDashboard() {
  return (
    <DashboardShell title="Citizen" navItems={nav}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's a summary of your Sahay activity.</p>
        </div>
        <Button><Search className="mr-1.5 h-4 w-4" /> Find help</Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active requests" value="0" hint="No open requests" icon={FileText} />
        <StatCard label="Appointments" value="0" hint="Nothing scheduled" icon={Calendar} />
        <StatCard label="Messages" value="0" hint="Inbox empty" icon={MessageSquare} />
        <StatCard label="Saved profiles" value="0" hint="Bookmark for later" icon={Bookmark} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Recent activity">
            <EmptyState
              icon={FileText}
              title="No activity yet"
              description="Start by finding an NGO or lawyer for your issue."
              action={<Button size="sm">Explore help</Button>}
            />
          </Panel>
        </div>
        <Panel title="Quick actions">
          <div className="space-y-2">
            {["Find nearby NGOs", "Book an appointment", "Talk to a lawyer", "Report an issue"].map((a) => (
              <button
                key={a}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
              >
                {a}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
