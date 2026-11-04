import { publicClient } from "@/lib/supabase/public";

export type CalcKey = "design" | "web" | "ai";

export const CALCULATORS: { key: CalcKey; label: string; path: string }[] = [
  { key: "design", label: "Design Studio", path: "/design" },
  { key: "web", label: "Web & SEO", path: "/web" },
  { key: "ai", label: "AI & Automation", path: "/ai" },
];

export type CalcOption = {
  id: string; name: string; description: string | null;
  price_usd: number | null; // null = "On request"
  unit: string | null; features: string[]; billing: "one_off" | "monthly";
};
export type CalcStep = {
  id: string; title: string; kind: "single" | "multi" | "quantity";
  none_label: string | null; none_note: string | null; options: CalcOption[];
};

type RawOption = Omit<CalcOption, "price_usd"> & { published: boolean; sort_order: number; price_usd: number | string | null };
type RawStep = Omit<CalcStep, "options"> & { options: RawOption[] | null };

export async function getCalculator(key: CalcKey): Promise<CalcStep[]> {
  const sb = publicClient();
  if (!sb) return [];
  const { data } = await sb.from("calc_steps")
    .select("id, title, kind, none_label, none_note, sort_order, options:calc_options(id, name, description, price_usd, unit, features, billing, published, sort_order)")
    .eq("calculator", key).eq("published", true).order("sort_order");

  return ((data ?? []) as unknown as RawStep[])
    .map((s) => ({
      ...s,
      options: (s.options ?? [])
        .filter((o) => o.published)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((o) => ({
          id: o.id, name: o.name, description: o.description, unit: o.unit, billing: o.billing,
          price_usd: o.price_usd === null || o.price_usd === "" ? null : Number(o.price_usd),
          features: Array.isArray(o.features) ? o.features : [],
        })),
    }))
    .filter((s) => s.options.length > 0);
}