import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  MessageCircle,
  Languages,
  Landmark,
  ExternalLink,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchNgoBySlug, initialsOf, type NgoRow } from "@/lib/ngos";
import { BookAppointmentDialog } from "@/components/site/BookAppointmentDialog";
import { HelpRequestDialog } from "@/components/site/HelpRequestDialog";

export const Route = createFileRoute("/ngos/$slug")({
  loader: async ({ params }) => {
    const ngo = await fetchNgoBySlug(params.slug);
    if (!ngo) throw notFound();
    return { ngo };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.ngo.name} — Sahay` },
          { name: "description", content: loaderData.ngo.description ?? "Verified NGO on Sahay." },
          { property: "og:title", content: loaderData.ngo.name },
          { property: "og:description", content: loaderData.ngo.description ?? "" },
        ]
      : [{ title: "NGO — Sahay" }],
  }),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <div className="container-x py-20 text-center text-sm text-muted-foreground">{error.message}</div>
    </SiteLayout>
  ),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-bold">NGO not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The organization you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-6"><Link to="/find-support">Browse NGOs</Link></Button>
      </div>
    </SiteLayout>
  ),
  component: NgoProfile,
});

function NgoProfile() {
  const initial = Route.useLoaderData().ngo;
  const { data: ngo = initial } = useQuery({
    queryKey: ["ngo", initial.slug],
    queryFn: () => fetchNgoBySlug(initial.slug).then((r) => r ?? initial),
    initialData: initial,
  });
  const [bookOpen, setBookOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const location = [ngo.address, ngo.city, ngo.state, ngo.pin_code].filter(Boolean).join(", ");
  const mapUrl =
    ngo.google_maps_url ||
    (ngo.latitude != null && ngo.longitude != null
      ? `https://www.google.com/maps?q=${ngo.latitude},${ngo.longitude}`
      : location
        ? `https://www.google.com/maps?q=${encodeURIComponent(location)}`
        : null);

  return (
    <SiteLayout>
      {/* Cover */}
      <div className="relative h-56 w-full bg-gradient-to-r from-primary/15 via-emerald/10 to-primary/10 sm:h-72">
        {ngo.cover_url && (
          <img src={ngo.cover_url} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="container-x -mt-14 pb-16">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-card sm:flex-row sm:items-end">
          {ngo.logo_url ? (
            <img
              src={ngo.logo_url}
              alt={`${ngo.name} logo`}
              className="h-24 w-24 shrink-0 rounded-2xl border border-border bg-background object-cover"
            />
          ) : (
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
              {initialsOf(ngo.name)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-2xl font-extrabold tracking-tight">{ngo.name}</h1>
              {ngo.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
            </div>
            {ngo.category && <p className="mt-1 text-sm text-muted-foreground">{ngo.category}</p>}
            {location && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {location}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setBookOpen(true)}>Book appointment</Button>
            <Button variant="outline" onClick={() => setHelpOpen(true)}>Send help request</Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            {ngo.description && (
              <Section title="About">
                <p className="text-sm leading-relaxed text-muted-foreground">{ngo.description}</p>
              </Section>
            )}
            {ngo.mission && (
              <Section title="Our mission">
                <p className="text-sm leading-relaxed text-muted-foreground">{ngo.mission}</p>
              </Section>
            )}
            {ngo.services.length > 0 && (
              <Section title="Services offered">
                <div className="flex flex-wrap gap-2">
                  {ngo.services.map((s) => (
                    <Badge key={s} variant="secondary" className="rounded-full bg-emerald/10 text-emerald hover:bg-emerald/15">
                      {s}
                    </Badge>
                  ))}
                </div>
              </Section>
            )}
            <Section title="Photo gallery">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl border border-dashed border-border bg-muted/40" />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Gallery coming soon.</p>
            </Section>
            <Section title="Location">
              <div className="grid h-56 place-items-center rounded-xl border border-dashed border-border bg-muted/30 text-center">
                <div>
                  <MapPin className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-2 text-sm">{location || "Address not provided"}</p>
                  {mapUrl && (
                    <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                      Open in Google Maps <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </Section>
          </div>

          <aside className="space-y-6">
            <Section title="Contact">
              <ul className="space-y-2 text-sm">
                {ngo.contact_person && <InfoRow icon={BadgeCheck} label={ngo.contact_person} />}
                {ngo.phone && <InfoRow icon={Phone} label={ngo.phone} href={`tel:${ngo.phone}`} />}
                {ngo.whatsapp && (
                  <InfoRow
                    icon={MessageCircle}
                    label={`WhatsApp ${ngo.whatsapp}`}
                    href={`https://wa.me/${ngo.whatsapp.replace(/\D/g, "")}`}
                  />
                )}
                {ngo.email && <InfoRow icon={Mail} label={ngo.email} href={`mailto:${ngo.email}`} />}
                {ngo.website && <InfoRow icon={Globe} label={ngo.website} href={ngo.website} />}
              </ul>
            </Section>
            <Section title="Working hours">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {ngo.working_days && <InfoRow icon={Clock} label={ngo.working_days} />}
                {ngo.working_hours && <InfoRow icon={Clock} label={ngo.working_hours} />}
                {ngo.emergency_support && (
                  <li>
                    <Badge className="rounded-full bg-emerald/15 text-emerald hover:bg-emerald/20">
                      24×7 Emergency support
                    </Badge>
                  </li>
                )}
              </ul>
            </Section>
            {ngo.languages.length > 0 && (
              <Section title="Languages">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Languages className="h-4 w-4" /> {ngo.languages.join(", ")}
                </p>
              </Section>
            )}
            {ngo.nearby_landmark && (
              <Section title="Nearby landmark">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Landmark className="h-4 w-4" /> {ngo.nearby_landmark}
                </p>
              </Section>
            )}
            {ngo.registration_number && (
              <Section title="Registration">
                <p className="text-sm text-muted-foreground">{ngo.registration_number}</p>
              </Section>
            )}
          </aside>
        </div>
      </div>

      <BookAppointmentDialog ngo={ngo as NgoRow} open={bookOpen} onOpenChange={setBookOpen} />
      <HelpRequestDialog ngo={ngo as NgoRow} open={helpOpen} onOpenChange={setHelpOpen} />
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function InfoRow({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href?: string }) {
  const inner = (
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <span className="truncate">{label}</span>
    </span>
  );
  return (
    <li>
      {href ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="hover:text-foreground">
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  );
}
