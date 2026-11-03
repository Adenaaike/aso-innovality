import type { MetadataRoute } from "next";
import { site, nav } from "@/lib/site";
import { getPublishedProjects } from "@/lib/projects";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();
  const pages = nav.map((n) => ({ url: `${site.url}${n.href === "/" ? "" : n.href}`, lastModified: new Date() }));
  const work = projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, lastModified: new Date() }));
  return [...pages, ...work];
}