import type { MetadataRoute } from "next";
import { site, nav } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return nav.map((n) => ({ url: `${site.url}${n.href === "/" ? "" : n.href}`, lastModified: new Date() }));
}