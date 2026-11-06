import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { ArrowUpRight, Download } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Stats } from "@/components/home/Stats";
import { StartProjectButton } from "@/components/StartProjectButton";
import { bio, principles, experience, education, certifications, exhibitions, competencies, tools } from "@/lib/about";
import { getSettings } from "@/lib/settings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About — Creative Designer, Web Builder & Automation Studio in Lagos",
  description: "About Adenaike Sodiq Olusegun (ASO), founder of ASO INNOVALITY: a Lagos-based creative designer with 9+ years in brand identity, now building websites and smart automation.",
  alternates: { canonical: "/about" },
};

const label = "text-xs font-semibold uppercase tracking-[0.2em] text-muted";

export default async function About() {
  const settings = await getSettings();
  return (
    <div className="pt-28">
      {/* HEADER */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-lg sm:max-w-xs lg:mx-0">
            <Image src={settings.portraitAbout} alt="Portrait of Adenaike Sodiq Olusegun, creative designer in Lagos"
              fill sizes="(min-width:1024px) 320px, 260px" loading="eager" className="object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7">
          <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">THE CREATIVE MIND BEHIND ASO INNOVALITY</p>
          <h1 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">
            Where strategic thinking meets <span className="aso-text-gradient">visual craft.</span>
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
            {bio.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={settings.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-bright">
              <Download size={16} /> Download CV
            </a>
            <StartProjectButton className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium hover:border-royal hover:text-royal">
              Start your project <ArrowUpRight size={16} />
            </StartProjectButton>
          </div>
        </Reveal>
      </section>

      {/* PRINCIPLES */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">How I think about design</h2></Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.no} delay={i * 0.08}>
                <div className="glow-card group relative h-full overflow-hidden rounded-lg border border-line bg-bg p-6">
                  <span aria-hidden className="accent-gradient absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                  <span className="accent-text inline-block font-display text-sm transition duration-300 group-hover:translate-x-1">{p.no}</span>
                  <h3 className="mt-3 font-display text-xl font-bold">{p.title}</h3>
                  <p className="text-xs uppercase tracking-wider text-muted">{p.subtitle}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-16"><Stats /></div>
        </div>
      </section>

      {/* EXPERIENCE + CREDENTIALS */}
      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">Experience</h2></Reveal>
          <ol className="relative mt-10 space-y-8 border-l border-line pl-8">
            {experience.map((r, i) => (
              <Reveal key={r.org} delay={i * 0.05}>
                <li className="relative">
                  <span aria-hidden className={`absolute top-1.5 -left-[37px] size-2.5 rounded-full ring-4 ring-bg ${r.current ? "bg-royal" : "bg-neutral-grey"}`} />
                  <p className="text-xs font-medium text-muted">{r.years}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{r.role}</h3>
                  <p className="text-sm font-medium text-royal dark:text-light-azure">{r.org}</p>
                  {r.note && <p className="mt-2 text-sm leading-relaxed text-muted">{r.note}</p>}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <aside className="space-y-10 lg:col-span-5">
          <Reveal>
            <h2 className={label}>Education</h2>
            <p className="mt-3 font-display font-semibold">{education.degree}</p>
            <p className="text-sm text-muted">{education.school} · {education.years}</p>
          </Reveal>
          <Reveal>
            <h2 className={label}>Certifications</h2>
            <ul className="mt-3 space-y-3">
              {certifications.map((c) => (
                <li key={c.title}>
                  <p className="font-display text-sm font-semibold">{c.title}</p>
                  <p className="text-sm text-muted">{[c.issuer, c.year].filter(Boolean).join(" · ")}</p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <h2 className={label}>Exhibitions & engagements</h2>
            <ul className="mt-3 space-y-3">
              {exhibitions.map((e) => (
                <li key={e.year} className="flex gap-4">
                  <span className="font-display text-sm font-semibold text-royal dark:text-light-azure">{e.year}</span>
                  <span className="text-sm text-muted">{e.items.join(" · ")}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <a href={settings.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-royal hover:underline dark:text-light-azure">
              <Download size={15} /> Download full CV (PDF)
            </a>
          </Reveal>
        </aside>
      </section>

      {/* COMPETENCIES + TOOLS */}
      <section className="border-t border-line py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">Core competencies</h2></Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {competencies.map((c) => (
              <Reveal key={c.group}>
                <h3 className="font-display font-semibold">{c.group}</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {c.items.map((it) => <li key={it} className="flex gap-2.5"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-royal" />{it}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-16">
            <h3 className={label}>Tools I create with</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {tools.map((t) => <li key={t} className="rounded-full border border-line px-4 py-2 text-sm font-medium">{t}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

            {/* CTA */}
            <CtaBand title="Let’s turn your idea into" accent="something people remember."
        text="Brand identity, websites and smart automation, under one studio."
        secondaryLabel="Explore my work" secondaryHref="/work" />
    </div>
  );
}