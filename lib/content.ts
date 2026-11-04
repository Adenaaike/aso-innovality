import { publicClient } from "@/lib/supabase/public";

export type Testimonial = { id: string; quote: string; name: string; role: string | null; organisation: string | null };
export type Faq = { id: string; question: string; answer: string };
export type Package = { id: string; name: string; tagline: string | null; price_from: string | null; features: string[]; highlighted: boolean };
export type FaqHub = "general" | "design" | "web" | "ai";

async function list<T>(table: string, cols: string): Promise<T[]> {
  const sb = publicClient();
  if (!sb) return [];
  const { data } = await sb.from(table).select(cols).eq("published", true).order("sort_order");
  return (data ?? []) as unknown as T[];
}

export const getTestimonials = () => list<Testimonial>("testimonials", "id, quote, name, role, organisation");
export const getPackages = () => list<Package>("packages", "id, name, tagline, price_from, features, highlighted");

export async function getFaqs(hub: FaqHub = "general"): Promise<Faq[]> {
  const sb = publicClient();
  if (!sb) return [];
  const { data } = await sb.from("faqs").select("id, question, answer").eq("published", true).eq("hub", hub).order("sort_order");
  return (data ?? []) as unknown as Faq[];
}