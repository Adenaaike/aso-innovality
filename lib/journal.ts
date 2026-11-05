import { publicClient } from "@/lib/supabase/public";

export const JOURNAL_CATEGORIES = [
  { value: "design", label: "Design" },
  { value: "web", label: "Web & SEO" },
  { value: "ai", label: "AI & Automation" },
  { value: "process", label: "Process & Insights" },
] as const;

export type JournalCategory = (typeof JOURNAL_CATEGORIES)[number]["value"];

export type Post = {
  id: string; slug: string; title: string; excerpt: string | null; body: string;
  cover_url: string | null; category: JournalCategory; published: boolean;
  published_at: string | null; seo_title: string | null; seo_description: string | null; updated_at: string;
};

export const categoryLabel = (c: string) => JOURNAL_CATEGORIES.find((x) => x.value === c)?.label ?? c;

export const readingTime = (text: string) =>
  Math.max(1, Math.round(text.trim().split(/\s+/).filter(Boolean).length / 220));

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export async function getPosts(): Promise<Post[]> {
  const sb = publicClient();
  if (!sb) return [];
  const { data } = await sb.from("journal_posts").select("*").eq("published", true).order("published_at", { ascending: false });
  return (data ?? []) as Post[];
}

export async function getPost(slug: string): Promise<Post | null> {
  const sb = publicClient();
  if (!sb) return null;
  const { data } = await sb.from("journal_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return (data as Post) ?? null;
}