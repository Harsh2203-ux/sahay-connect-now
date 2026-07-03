import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { dashboardPathForRole, type AppRole } from "@/lib/auth";
import { User, Scale, Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

type RoleChoice = Exclude<AppRole, "admin">;

const roles: { value: RoleChoice; title: string; desc: string; icon: typeof User }[] = [
  { value: "citizen", title: "Citizen", desc: "I'm looking for help.", icon: User },
  { value: "lawyer", title: "Lawyer", desc: "I want to offer legal services.", icon: Scale },
  { value: "ngo_owner", title: "NGO Owner", desc: "I represent an NGO.", icon: Building2 },
];

function RegisterPage() {
  const [role, setRole] = useState<RoleChoice>("citizen");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName, phone, role },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created");
    navigate({ to: dashboardPathForRole(role) });
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Choose a role, then tell us a little about yourself.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div>
          <Label className="mb-2 block">I am a</Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {roles.map((r) => (
              <button
                type="button"
                key={r.value}
                onClick={() => setRole(r.value)}
                className={cn(
                  "relative rounded-xl border p-3 text-left transition-all",
                  role === r.value
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-foreground/30",
                )}
              >
                <r.icon className={cn("h-4 w-4", role === r.value ? "text-primary" : "text-muted-foreground")} />
                <p className="mt-2 text-sm font-semibold">{r.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.desc}</p>
                {role === r.value && (
                  <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
