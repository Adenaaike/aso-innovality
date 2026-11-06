"use client";
import { CollectionEditor, type Field } from "@/components/admin/CollectionEditor";

const testimonialFields: Field[] = [
  { key: "quote", label: "Quote", type: "textarea", required: true, hint: "Their exact words. Only add real testimonials you have permission to share." },
  { key: "name", label: "Name", type: "text", required: true },
  { key: "role", label: "Role", type: "text", placeholder: "e.g. Executive Director" },
  { key: "organisation", label: "Organisation", type: "text", placeholder: "e.g. IBETA" },
];

const faqFields: Field[] = [
  { key: "question", label: "Question", type: "text", required: true },
  { key: "answer", label: "Answer", type: "textarea", required: true },
  { key: "hub", label: "Show on", type: "select", required: true, options: [
    { value: "general", label: "Services page (general)" },
    { value: "design", label: "Design Studio hub" },
    { value: "web", label: "Web & SEO hub" },
    { value: "ai", label: "AI & Automation hub" },
  ] },
];

const packageFields: Field[] = [
  { key: "name", label: "Package name", type: "text", required: true, placeholder: "e.g. Brand Identity" },
  { key: "tagline", label: "Short description", type: "text" },
  { key: "price_from", label: "Price", type: "text", placeholder: "e.g. From $750", hint: "Leave empty to show no price." },
  { key: "features", label: "What’s included", type: "lines", placeholder: "One item per line", hint: "One item per line." },
  { key: "highlighted", label: "Mark as “Most popular”", type: "checkbox" },
];

const HUB_LABEL: Record<string, string> = { general: "Services", design: "Design", web: "Web", ai: "AI" };

const wallFields: Field[] = [
  { key: "color", label: "Colour (hex, e.g. #1177FF)", type: "text", required: true },
  { key: "label", label: "Name or word (optional)", type: "text" },
];

export default function AdminContent() {
  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold">Content</h1>
        <p className="mt-2 text-sm text-muted">Each section appears on the site only once it has published items. Changes show on the live site within 5 minutes. Calculator prices live in Admin → Calculators.</p>
      </div>
      <CollectionEditor table="idea_wall" title="Idea Wall" hint="Every colour visitors add. Click 👁 to hide an entry, or the bin to delete it."
        fields={wallFields} summary={(r) => `${r.color}${r.label ? ` · ${r.label}` : ""}`} />
      <CollectionEditor table="packages" title="Packages (Ways to work together)" hint="Shown as cards on the Services page."
        fields={packageFields} summary={(r) => `${r.name}${r.price_from ? ` · ${r.price_from}` : ""}${r.highlighted ? " · Most popular" : ""}`} />
      <CollectionEditor table="testimonials" title="Testimonials" hint="Shown on the homepage and Services page as a rotating quote."
        fields={testimonialFields} summary={(r) => `${r.name}: “${String(r.quote).slice(0, 70)}…”`} />
      <CollectionEditor table="faqs" title="FAQ" hint="Choose where each question appears: the Services page or one of the three hubs."
        fields={faqFields} summary={(r) => `[${HUB_LABEL[String(r.hub)] ?? "Services"}] ${r.question}`} />
    </div>
  );
}