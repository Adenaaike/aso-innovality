"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgets, enquirySchema, projectTypes, projectTypeGroups, type Enquiry } from "@/lib/validation";

// "Start a project" buttons link to /contact?service=<slug>
const SERVICE_TO_TYPE: Record<string, (typeof projectTypes)[number]> = {
    "brand-identity": "Brand Identity & Logo System",
    "graphic-design": "Graphic Design & Advertising",
    "campaign-direction": "Event / Campaign Series",
    "photo-manipulation": "Photo Manipulation & Compositing",
    "packaging-print": "Print & Packaging",
    "digital-experiences": "Digital & UI Visuals",
    "carousel-design": "Social Media & Carousel Design",
    "web-development": "Website Design & Development",
    "seo": "SEO & Search Visibility",
    "ai-automation": "Workflow & AI Automation",
  };

export function ContactForm() {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<Enquiry>({ resolver: zodResolver(enquirySchema) });
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Estimate details from a calculator
    const brief = params.get("brief");
    if (brief) setValue("description", brief.slice(0, 4000));

    // Budget tier matching the calculator total
    const usd = Number(params.get("budget"));
    if (usd > 0) {
      const tiers = budgets
        .map((b) => ({ b, min: Number((String(b).match(/\$([\d,]+)/)?.[1] ?? "").replace(/,/g, "")) }))
        .filter((t) => t.min > 0)
        .sort((a, z) => z.min - a.min);
      const pick = tiers.find((t) => usd >= t.min);
      if (pick) setValue("budget", pick.b);
    }

    // Project type from "Start a project" links
    const s = params.get("service");
    if (s && SERVICE_TO_TYPE[s]) setValue("projectType", SERVICE_TO_TYPE[s]);
  }, [setValue]);

  async function onSubmit(values: Enquiry) {
    setStatus(null);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
      reset();
      setStatus({ ok: true, msg: "Thank you — your enquiry has been received. I’ll reply within 24–48 hours." });
    } catch (err) {
      setStatus({ ok: false, msg: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  const input = "w-full rounded-sm border border-line bg-bg p-3 focus:border-royal focus:outline-none aria-invalid:border-red-600";
  const Err = ({ name }: { name: keyof Enquiry }) =>
    errors[name] ? <p id={`${name}-err`} className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[name]?.message as string}</p> : null;
  const aria = (name: keyof Enquiry) => ({ "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `${name}-err` : undefined });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 md:grid-cols-2">
      <div><label htmlFor="fullName" className="mb-1 block text-sm font-medium">Full name *</label>
        <input id="fullName" autoComplete="name" className={input} {...register("fullName")} {...aria("fullName")} /><Err name="fullName" /></div>
      <div><label htmlFor="email" className="mb-1 block text-sm font-medium">Email address *</label>
        <input id="email" type="email" autoComplete="email" className={input} {...register("email")} {...aria("email")} /><Err name="email" /></div>
      <div><label htmlFor="company" className="mb-1 block text-sm font-medium">Company or brand</label>
        <input id="company" autoComplete="organization" className={input} {...register("company")} /></div>
      <div><label htmlFor="projectType" className="mb-1 block text-sm font-medium">Project type *</label>
        <select id="projectType" defaultValue="" className={input} {...register("projectType")} {...aria("projectType")}>
        <option value="" disabled>Select…</option>
              {projectTypeGroups.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.types.map((t) => <option key={t}>{t}</option>)}
                </optgroup>
              ))}
                          </select><Err name="projectType" /></div>
      <div className="md:col-span-2"><label htmlFor="budget" className="mb-1 block text-sm font-medium">Estimated budget</label>
        <select id="budget" defaultValue="" className={input} {...register("budget")}>
   
          <option value="">Prefer not to say</option>{budgets.map((b) => <option key={b}>{b}</option>)}
        </select></div>
      <div className="md:col-span-2"><label htmlFor="description" className="mb-1 block text-sm font-medium">Project description *</label>
        <textarea id="description" rows={6} className={input} {...register("description")} {...aria("description")} /><Err name="description" /></div>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("website")} />
      <div className="md:col-span-2">
        <button type="submit" disabled={isSubmitting} className="rounded-full bg-royal px-8 py-4 font-medium text-white hover:bg-bright disabled:opacity-60">
          {isSubmitting ? "Sending…" : "Send enquiry"}
        </button>
        <p className="mt-3 text-xs text-muted">
              By sending this form, you agree to how I handle your details in the <a href="/privacy" className="underline hover:text-royal">Privacy Policy</a>.
            </p>
        <p role="status" aria-live="polite" className={`mt-4 text-sm ${status?.ok ? "text-royal dark:text-light-azure" : "text-red-600 dark:text-red-400"}`}>{status?.msg}</p>
      </div>
    </form>
  );
}