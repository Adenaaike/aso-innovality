import type { Metadata } from "next";
import { HubPage } from "@/components/hub/HubPage";
import { webHub as hub } from "@/lib/hubs";
import { getCalculator } from "@/lib/calculators";
import { getPublishedProjects } from "@/lib/projects";
import { getFaqs } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: hub.seo.title,
  description: hub.seo.description,
  alternates: { canonical: hub.path },
};

export default async function WebHub() {
  const [steps, projects, faqs, settings] = await Promise.all([
    getCalculator(hub.key), getPublishedProjects(), getFaqs(hub.key), getSettings(),
  ]);
  const own = projects.filter((p) => p.category && hub.categories.includes(p.category.name));

  return <HubPage hub={hub} projects={own} calcSteps={steps} faqs={faqs} ngnRate={settings.ngnRate} whatsapp={settings.whatsappNumber} />;
}