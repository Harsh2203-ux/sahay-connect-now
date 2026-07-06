import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, ShieldCheck, Users, Building2, Scale, Settings, BadgeCheck } from "lucide-react";
import { DashboardShell, StatCard, Panel, EmptyState, type NavItem } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/admin")({
  beforeLoad: async ({ context }) => {
    const { redirect } = await import("@tanstack/react-router");
    const user = (context as { user?: { id: string } }).user;
    if (!user) throw redirect({ to: "/auth/login" });
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (error || !data) throw redirect({ to: "/" });
  },
  component: AdminDashboard,
});

const nav: NavItem[] = [
  { to: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/profile", label: "My Profile", icon: Settings },
];

function AdminDashboard() {
  const qc = useQueryClient();

  const { data: ngos = [] } = useQuery({
    queryKey: ["adm-ngos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ngos").select("id,name,slug,city,verified,created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: lawyers = [] } = useQuery({
    queryKey: ["adm-lawyers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lawyers").select("id,full_name,slug,city,verified,created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const { data: appts = [] } = useQuery({
    queryKey: ["adm-appts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("appointments").select("id,type,name,phone,status,created_at").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });
  const { data: help = [] } = useQuery({
    queryKey: ["adm-help"],
    queryFn: async () => {
      const { data, error } = await supabase.from("help_requests").select("id,title,subject,urgency,status,created_at").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });
  const { data: userCount = 0 } = useQuery({
    queryKey: ["adm-users"],
    queryFn: async () => {
      const { count } = await supabase.from("profiles").select("id", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  async function verifyNgo(id: string, on: boolean) {
    const { error } = await supabase.from("ngos").update({ verified: on }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(on ? "NGO verified" : "Verification removed");
    qc.invalidateQueries({ queryKey: ["adm-ngos"] });
  }
  async function verifyLawyer(id: string, on: boolean) {
    const { error } = await supabase.from("lawyers").update({ verified: on }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(on ? "Lawyer verified" : "Verification removed");
    qc.invalidateQueries({ queryKey: ["adm-lawyers"] });
  }

  const pendingNgos = ngos.filter((n) => !n.verified).length;
  const pendingLawyers = lawyers.filter((l) => !l.verified).length;

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
        <StatCard label="Total users" value={String(userCount)} icon={Users} />
        <StatCard label="Verified NGOs" value={String(ngos.filter((n) => n.verified).length)} hint={`${pendingNgos} pending`} icon={Building2} />
        <StatCard label="Verified lawyers" value={String(lawyers.filter((l) => l.verified).length)} hint={`${pendingLawyers} pending`} icon={Scale} />
        <StatCard label="Pending verifications" value={String(pendingNgos + pendingLawyers)} icon={ShieldCheck} />
      </div>

      <Tabs defaultValue="ngos" className="mt-6">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
          <TabsTrigger value="ngos">NGOs</TabsTrigger>
          <TabsTrigger value="lawyers">Lawyers</TabsTrigger>
          <TabsTrigger value="appts">Appointments</TabsTrigger>
          <TabsTrigger value="help">Help Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="ngos" className="mt-6">
          <Panel title={`NGOs (${ngos.length})`}>
            {ngos.length === 0 ? (
              <EmptyState icon={Building2} title="No NGOs" description="NGO registrations will appear here." />
            ) : (
              <ul className="divide-y divide-border">
                {ngos.map((n) => (
                  <li key={n.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div>
                      <p className="text-sm font-medium">{n.name}</p>
                      <p className="text-xs text-muted-foreground">{n.city ?? "—"} • /{n.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {n.verified ? (
                        <Badge className="rounded-full bg-emerald/15 text-emerald hover:bg-emerald/20"><BadgeCheck className="mr-1 h-3 w-3" />Verified</Badge>
                      ) : (
                        <Badge variant="secondary" className="rounded-full">Pending</Badge>
                      )}
                      <Button size="sm" variant={n.verified ? "outline" : "default"} onClick={() => verifyNgo(n.id, !n.verified)}>
                        {n.verified ? "Unverify" : "Verify"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="lawyers" className="mt-6">
          <Panel title={`Lawyers (${lawyers.length})`}>
            {lawyers.length === 0 ? (
              <EmptyState icon={Scale} title="No lawyers" description="Lawyer registrations will appear here." />
            ) : (
              <ul className="divide-y divide-border">
                {lawyers.map((l) => (
                  <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div>
                      <p className="text-sm font-medium">{l.full_name}</p>
                      <p className="text-xs text-muted-foreground">{l.city ?? "—"} • /{l.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {l.verified ? (
                        <Badge className="rounded-full bg-emerald/15 text-emerald hover:bg-emerald/20"><BadgeCheck className="mr-1 h-3 w-3" />Verified</Badge>
                      ) : (
                        <Badge variant="secondary" className="rounded-full">Pending</Badge>
                      )}
                      <Button size="sm" variant={l.verified ? "outline" : "default"} onClick={() => verifyLawyer(l.id, !l.verified)}>
                        {l.verified ? "Unverify" : "Verify"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="appts" className="mt-6">
          <Panel title={`Recent appointments (${appts.length})`}>
            {appts.length === 0 ? (
              <EmptyState icon={Users} title="No appointments" description="Bookings will appear here." />
            ) : (
              <ul className="divide-y divide-border">
                {appts.map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <p className="font-medium">{a.name} <span className="text-xs text-muted-foreground">({a.type})</span></p>
                      <p className="text-xs text-muted-foreground">{a.phone}</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full capitalize">{a.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="help" className="mt-6">
          <Panel title={`Recent help requests (${help.length})`}>
            {help.length === 0 ? (
              <EmptyState icon={Users} title="No help requests" description="Citizen requests will appear here." />
            ) : (
              <ul className="divide-y divide-border">
                {help.map((h) => (
                  <li key={h.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <p className="font-medium">{h.title ?? h.subject}</p>
                      <p className="text-xs text-muted-foreground capitalize">urgency: {h.urgency}</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full capitalize">{h.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
