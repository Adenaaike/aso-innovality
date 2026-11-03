import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Start a branding, logo or design project with ASO Innovality." };

export default function Contact() {
  return (
    <div className="mx-auto grid max-w-7xl gap-16 px-6 pt-32 pb-24 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <h1 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-bold uppercase leading-[0.95]">
          Have an idea? <span className="aso-text-gradient">Let’s bring it to life.</span>
        </h1>
        <dl className="mt-12 space-y-5">
          <div><dt className="text-xs uppercase tracking-wider text-muted">Email</dt><dd><a href={`mailto:${site.email}`} className="hover:text-royal">{site.email}</a></dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted">Phone</dt><dd><a href="tel:+2348106458863" className="hover:text-royal">{site.phoneDisplay}</a></dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted">Social</dt>
            <dd className="flex gap-4"><a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-royal">@aso_innovality</a>
              <a href={site.pinterest} target="_blank" rel="noopener noreferrer" className="hover:text-royal">Pinterest</a></dd></div>
        </dl>
        <a href={`${site.whatsapp}?text=${encodeURIComponent("Hi ASO, I'd like to discuss a project.")}`} target="_blank" rel="noopener noreferrer"
          className="mt-10 inline-flex rounded-full border border-line px-6 py-3 font-medium hover:border-royal hover:text-royal">Chat on WhatsApp</a>
      </div>
      <div className="lg:col-span-7"><ContactForm /></div>
    </div>
  );
}