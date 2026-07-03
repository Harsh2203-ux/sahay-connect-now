import { createFileRoute } from "@tanstack/react-router";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { NGOCard, type NGO } from "@/components/site/NGOCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/find-ngos")({
  head: () => ({
    meta: [
      { title: "Find NGOs — Sahay" },
      { name: "description", content: "Discover verified NGOs near you across categories like women's rights, child protection, legal aid and more." },
      { property: "og:title", content: "Find NGOs — Sahay" },
      { property: "og:description", content: "Discover verified NGOs near you across many categories." },
    ],
  }),
  component: FindNGOs,
});

const categories = ["All", "Women's Rights", "Child Protection", "Legal Aid", "Domestic Violence", "Senior Support", "Cyber Crime"];

const list: NGO[] = [
  { name: "Aashray Foundation", initials: "AF", location: "Mumbai, MH", category: "Women's Rights", services: ["Counseling", "Legal Aid", "Shelter"], verified: true },
  { name: "Ummeed Trust", initials: "UT", location: "Bengaluru, KA", category: "Child Protection", services: ["Advocacy", "Rehabilitation"], verified: true },
  { name: "Nyaya Sahayak", initials: "NS", location: "Delhi, DL", category: "Legal Aid", services: ["Free consultation", "Documentation"], verified: true },
  { name: "Suraksha Kendra", initials: "SK", location: "Chennai, TN", category: "Domestic Violence", services: ["Helpline", "Counseling"], verified: true },
  { name: "Elder Care India", initials: "EC", location: "Kolkata, WB", category: "Senior Support", services: ["Home visits", "Legal help"], verified: true },
  { name: "Cyber Sahayta", initials: "CS", location: "Hyderabad, TS", category: "Cyber Crime", services: ["Reporting", "Recovery"], verified: true },
];

function FindNGOs() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Find NGOs"
        title="Verified organizations, close to home"
        subtitle="Filter by cause, location and services to find the right NGO for your needs."
      />

      <section className="container-x -mt-8 pb-20">
        <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
          <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr_auto]">
            <div className="flex items-center gap-2 rounded-xl border border-border px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search NGOs, categories, services..." className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border px-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <input placeholder="City or area" className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
            <Button className="h-11">Search</Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="mr-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters:
            </span>
            {categories.map((c, i) => (
              <Badge
                key={c}
                variant={i === 0 ? "default" : "secondary"}
                className="cursor-pointer rounded-full px-3 py-1"
              >
                {c}
              </Badge>
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">{list.length} verified NGOs</p>

        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((n) => (
            <NGOCard key={n.name} ngo={n} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <section className="bg-section">
      <div className="container-x py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">{subtitle}</p>
      </div>
    </section>
  );
}
