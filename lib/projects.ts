import { publicClient } from "@/lib/supabase/public";

export type Swatch = { name: string; hex: string };
export type ExecPoint = { label: string; text: string };
export type ProjectImage = { id: string; url: string; alt: string; caption: string | null; kind: string; sort_order: number };
export type ProjectCard = {
  id: string; slug: string; title: string; year: number | null; cover_url: string | null;
  summary: string | null; overview: string | null; category: { name: string; slug: string } | null;
};
export type Project = ProjectCard & {
  client: string | null; role: string | null; location: string | null; industry: string | null; duration: string | null;
  challenge: string | null; concept: string | null; process: string | null; outcome: string | null;
  deliverables: string[]; services: string[]; tags: string[]; palette: Swatch[]; execution: ExecPoint[];
  seo_title: string | null; seo_description: string | null; images: ProjectImage[];
};

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

const CARD = "id, slug, title, year, cover_url, summary, overview, category:categories(name, slug)";

export async function getPublishedProjects(): Promise<ProjectCard[]> {
  const sb = publicClient();
  if (!sb) return [];
  const { data } = await sb.from("projects").select(CARD).eq("published", true)
    .order("sort_order").order("year", { ascending: false, nullsFirst: false });
  return (data ?? []) as unknown as ProjectCard[];
}

export async function getProject(slug: string): Promise<Project | null> {
  const sb = publicClient();
  if (!sb) return null;
  const { data } = await sb.from("projects")
    .select("*, category:categories(name, slug), images:project_images(id, url, alt, caption, kind, sort_order)")
    .eq("slug", slug).eq("published", true).maybeSingle();
  if (!data) return null;
  const p = data as unknown as Project;
  return {
    ...p,
    deliverables: arr<string>(p.deliverables),
    services: arr<string>(p.services),
    tags: arr<string>(p.tags),
    palette: arr<Swatch>(p.palette),
    execution: arr<ExecPoint>(p.execution),
    images: arr<ProjectImage>(p.images).sort((a, b) => a.sort_order - b.sort_order),
  };
}