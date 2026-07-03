import { createFileRoute } from "@tanstack/react-router";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LawyerCard, type Lawyer } from "@/components/site/LawyerCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/find-lawyers")({
  head: () => ({
    meta: [
      { title: "Find Lawyers — Sahay" },
      { name: "description", content: "Discover verified lawyers by specialization and location across India." },
      { property: "og:title", content: "Find Lawyers — Sahay" },
      { property: "og:description", content: "Discover verified lawyers by specialization and location." },
    ],
  }),
  component: FindLawyers,
});

const specializations = ["All", "Family Law", "Criminal", "Women's Rights", "Cyber Crime", "Property", "Consumer"];

const list: Lawyer[] = [
  { name: "Adv. Meera Kapoor", initials: "MK", experience: "12 years", specialization: "Family & Divorce Law", location: "Pune, MH", verified: true },
  { name: "Adv. Rohan Iyer", initials: "RI", experience: "9 years", specialization: "Cyber Crime Law", location: "Hyderabad, TS", verified: true },
  { name: "Adv. Sana Qureshi", initials: "SQ", experience: "15 years", specialization: "Women's Rights & DV", location: "Jaipur, RJ", verified: true },
  { name: "Adv. Arjun Nair", initials: "AN", experience: "7 years", specialization: "Property Disputes", location: "Kochi, KL", verified: true },
  { name: "Adv. Neha Verma", initials: "NV", experience: "11 years", specialization: "Consumer Rights", location: "Lucknow, UP", verified: true },
  { name: "Adv. Kabir Shah", initials: "KS", experience: "6 years", specialization: "Criminal Defense", location: "Ahmedabad, GJ", verified: true },
];

function FindLawyers() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Find Lawyers"
        title="Experienced counsel, verified and near you"
        subtitle="Search by specialization, experience and location."
      />

      <section className="container-x -mt-8 pb-20">
        <div className="rounded-2xl border border-border bg-card p-3 shadow-card">
          <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr_auto]">
            <div className="flex items-center gap-2 rounded-xl border border-border px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search by name or specialization..." className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
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
            {specializations.map((c, i) => (
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

        <p className="mt-8 text-sm text-muted-foreground">{list.length} verified lawyers</p>

        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((l) => (
            <LawyerCard key={l.name} lawyer={l} />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
