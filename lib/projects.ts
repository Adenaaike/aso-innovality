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
// Which project categories feed each service's preview images
export const SERVICE_CATEGORIES: Record<string, string[]> = {
    "brand-identity": ["Brand Identity", "Logo Design"],
    "graphic-design": ["Graphic Design", "Social Media Design"],
    "campaign-direction": ["Campaigns & Posters"],
    "photo-manipulation": ["Photo Manipulation", "Photography"],
    "packaging-print": ["Packaging"],
    "digital-experiences": ["Experimental Design"],
    "carousel-design": ["Carousel & Social Content Design"],
  };
  
  export async function getServicePreviews(): Promise<Record<string, string[]>> {
    const sb = publicClient();
    if (!sb) return {};
    const { data } = await sb.from("projects")
      .select("cover_url, category:categories(name)")
      .eq("published", true).not("cover_url", "is", null).order("sort_order").limit(60);
    const rows = (data ?? []) as unknown as { cover_url: string; category: { name: string } | null }[];
    const out: Record<string, string[]> = {};
    for (const [slug, cats] of Object.entries(SERVICE_CATEGORIES)) {
      out[slug] = rows.filter((r) => r.category && cats.includes(r.category.name)).map((r) => r.cover_url).slice(0, 3);
    }
    return out;
  }
  export type Carousel = { slug: string; title: string; client: string | null; year: number | null; slides: { url: string; alt: string }[] };

export async function getCarousels(limit = 12): Promise<Carousel[]> {
  const sb = publicClient();
  if (!sb) return [];
  const { data: cat } = await sb.from("categories").select("id").eq("slug", "carousel-design").maybeSingle();
  if (!cat) return [];
  const { data } = await sb.from("projects")
    .select("slug, title, client, year, cover_url, images:project_images(url, alt, sort_order)")
    .eq("published", true).eq("category_id", cat.id).order("sort_order").limit(limit);
  const rows = (data ?? []) as unknown as {
    slug: string; title: string; client: string | null; year: number | null; cover_url: string | null;
    images: { url: string; alt: string; sort_order: number }[] | null;
  }[];
  return rows
    .map((r) => {
      const imgs = [...(r.images ?? [])].sort((a, b) => a.sort_order - b.sort_order).map((i) => ({ url: i.url, alt: i.alt }));
      const slides = imgs.length ? imgs : r.cover_url ? [{ url: r.cover_url, alt: r.title }] : [];
      return { slug: r.slug, title: r.title, client: r.client, year: r.year, slides };
    })
    .filter((c) => c.slides.length > 0);
}