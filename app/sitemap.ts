import type { MetadataRoute } from "next";
import { site, nav } from "@/lib/site";
import { getPublishedProjects } from "@/lib/projects";
import { getPosts } from "@/lib/journal";

export const revalidate = 3600;

// Pages that aren't in the main menu but should be found by Google
const EXTRA_PAGES = ["/design", "/web", "/ai", "/estimate"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getPublishedProjects(), getPosts()]);
  const paths = [...new Set([...nav.map((n) => n.href), ...EXTRA_PAGES])];
  const pages = paths.map((href) => ({ url: `${site.url}${href === "/" ? "" : href}`, lastModified: new Date() }));
  const work = projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, lastModified: new Date() }));
  const journal = posts.map((p) => ({ url: `${site.url}/journal/${p.slug}`, lastModified: new Date(p.updated_at) }));
  return [...pages, ...work, ...journal];
}