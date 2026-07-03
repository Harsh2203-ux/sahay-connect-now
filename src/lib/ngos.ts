import { supabase } from "@/integrations/supabase/client";

export type NgoRow = {
  id: string;
  owner_id: string | null;
  slug: string;
  name: string;
  registration_number: string | null;
  verified: boolean;
  description: string | null;
  mission: string | null;
  category: string | null;
  contact_person: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pin_code: string | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  working_days: string | null;
  working_hours: string | null;
  emergency_support: boolean;
  languages: string[];
  services: string[];
  nearby_landmark: string | null;
  logo_url: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
};

export const NGO_SERVICE_OPTIONS = [
  "Family Counseling",
  "Women's Rights",
  "Domestic Violence",
  "Legal Aid",
  "Child Protection",
  "Senior Citizen Support",
  "Cyber Crime Guidance",
  "Property Dispute",
  "Mental Health Counseling",
  "Education Support",
  "Community Welfare",
] as const;

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export async function fetchNgos(): Promise<NgoRow[]> {
  const { data, error } = await supabase
    .from("ngos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as NgoRow[];
}

export async function fetchNgoBySlug(slug: string): Promise<NgoRow | null> {
  const { data, error } = await supabase
    .from("ngos")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as NgoRow) ?? null;
}

export async function fetchMyNgo(userId: string): Promise<NgoRow | null> {
  const { data, error } = await supabase
    .from("ngos")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as NgoRow) ?? null;
}
