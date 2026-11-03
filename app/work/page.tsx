import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/projects";
import { WorkGallery } from "@/components/work/WorkGallery";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Work — Brand Identity, Campaign & Graphic Design Portfolio",
  description: "Brand identity, campaign, social media and photo manipulation work by Adenaike Sodiq Olusegun (ASO INNOVALITY), a creative designer in Lagos, Nigeria.",
  alternates: { canonical: "/work" },
};

export default async function Work() {
  const projects = await getPublishedProjects();

  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">02 — IDENTITY</p>
      <h1 className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">
        Selected work across brand identity, campaigns and visual storytelling.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Real projects for organisations, ministries and businesses in Nigeria, Belgium and beyond.
      </p>
      <div className="mt-12"><WorkGallery projects={projects} /></div>
    </div>
  );
}