import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";
import { getSettings } from "@/lib/settings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact — Start a Branding or Design Project",
  description: "Get in touch with Adenaike Sodiq Olusegun (ASO INNOVALITY) for brand identity, campaign art direction and creative collaborations in Lagos and worldwide.",
};

export default async function Contact() {
  const s = await getSettings();
  const tel = s.phoneDisplay.replace(/[^+\d]/g, "");

  return (
    <div className="mx-auto grid max-w-6xl gap-16 px-6 pt-32 pb-24 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <h1 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">
          Let’s build something <span className="aso-text-gradient">distinctive</span> together.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted">
          I’m available for brand identity commissions, campaign design, agency partnerships and international collaborations. Tell me about your organisation, timeline and goals, and I’ll reply within 24–48 hours.
        </p>
        <dl className="mt-10 space-y-5">
          <div><dt className="text-xs uppercase tracking-wider text-muted">Email</dt><dd><a href={`mailto:${s.email}`} className="hover:text-royal">{s.email}</a></dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted">Phone & WhatsApp</dt><dd><a href={`tel:${tel}`} className="hover:text-royal">{s.phoneDisplay}</a></dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted">Location</dt><dd>Lagos, Nigeria · Working with clients in Nigeria, Belgium and beyond</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted">Social</dt>
            <dd className="flex gap-4"><a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-royal">@aso_innovality</a>
              <a href={site.pinterest} target="_blank" rel="noopener noreferrer" className="hover:text-royal">Pinterest</a></dd></div>
        </dl>
        <a href={`https://wa.me/${s.whatsappNumber}?text=${encodeURIComponent("Hi ASO, I’d like to discuss a project.")}`} target="_blank" rel="noopener noreferrer"
          className="mt-10 inline-flex rounded-full border border-line px-6 py-3 text-sm font-medium hover:border-royal hover:text-royal">Chat on WhatsApp</a>
      </div>
      <div className="lg:col-span-7"><ContactForm /></div>
    </div>
  );
}