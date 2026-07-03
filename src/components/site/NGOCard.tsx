import { BadgeCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type NGO = {
  name: string;
  initials: string;
  location: string;
  category: string;
  services: string[];
  verified?: boolean;
};

export function NGOCard({ ngo }: { ngo: NGO }) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-base font-bold text-primary">
          {ngo.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-semibold text-foreground">{ngo.name}</h3>
            {ngo.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {ngo.location}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Badge variant="secondary" className="rounded-full bg-emerald/10 text-emerald hover:bg-emerald/15">
          {ngo.category}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {ngo.services.slice(0, 3).map((s) => (
          <span
            key={s}
            className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-6 flex-1" />
      <Button variant="outline" className="w-full">View profile</Button>
    </div>
  );
}
