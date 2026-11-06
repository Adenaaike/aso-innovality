import Link from "next/link";
import { ArrowUpRight, Check, Clock, ShieldCheck, Tag } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { HubPanels } from "@/components/hub/HubPanels";
import { HubVisual, WebBadges } from "@/components/hub/HubVisual";
import { Calculator } from "@/components/calculator/Calculator";
import { ProjectTile } from "@/components/work/ProjectTile";
import { FaqSection } from "@/components/content/Faq";
import { steps as processSteps } from "@/lib/site";
import type { Hub } from "@/lib/hubs";
import type { CalcStep } from "@/lib/calculators";
import type { ProjectCard } from "@/lib/projects";
import type { Faq } from "@/lib/content";

const card = "glow-card group relative h-full overflow-hidden rounded-lg border border-line bg-bg p-6";
const sweep = "accent-gradient absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100";
const eyebrow = "text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure";

export function HubPage({ hub, projects, calcSteps, faqs, ngnRate, whatsapp }: {
  hub: Hub; projects: ProjectCard[]; calcSteps: CalcStep[]; faqs: Faq[]; ngnRate: number; whatsapp: string;
}) {
  const withCover = projects.filter((p): p is ProjectCard & { cover_url: string } => Boolean(p.cover_url));
  const panels = withCover.slice(0, 5).map((p) => ({ slug: p.slug, title: p.title, cover: p.cover_url }));
  const related = withCover.map((p) => p.cover_url);

  return (
    <div className={`accent-${hub.key}`}>
      {/* HERO */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 pt-32 pb-16 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <p className={eyebrow}>{hub.eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.03]">
            {hub.title} <span className="aso-text-gradient">{hub.titleAccent}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">{hub.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/contact?service=${hub.contactService}`} className="inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-bright">
              Start a project <ArrowUpRight size={16} />
            </Link>
            <a href="#estimate" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium hover:border-royal hover:text-royal">
              Estimate the cost
            </a>
          </div>
        </div>
        <div className="relative min-w-0 lg:col-span-6">
          {panels.length ? <HubPanels items={panels} /> : <HubVisual kind={hub.key} />}
          {hub.key === "web" && panels.length > 0 && <WebBadges />}
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="border-y border-line">
        <dl className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-3">
          {hub.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs uppercase tracking-wider text-muted">{f.label}</dt>
              <dd className="mt-1 font-display text-xl font-bold">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* WHAT YOU GET */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">What you get</h2></Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hub.benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05}>
              <div className={card}>
                <span aria-hidden className={sweep} />
                <span className="inline-block font-display text-sm accent-text transition duration-300 group-hover:translate-x-1">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DELIVERABLES + PROCESS */}
      <section className="bg-surface py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Everything included</h2>
            <ul className="mt-8 space-y-3">
              {hub.deliverables.map((d) => (
                <li key={d} className="flex gap-3"><Check size={18} className="accent-text mt-0.5 shrink-0" />{d}</li>
              ))}
            </ul>
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">How a project runs</h2></Reveal>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2">
              {(hub.process ?? processSteps).map((s, i) => (
                <li key={s.no} className={card}>
                  <span aria-hidden className={sweep} />
                  <Reveal delay={i * 0.06}>
                    <span className="inline-block font-display text-sm accent-text transition duration-300 group-hover:translate-x-1">{s.no}</span>
                    <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* PROOF */}
      {projects.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Selected work</h2>
            <Link href="/work" className="text-sm font-medium text-royal hover:underline dark:text-light-azure">View all projects →</Link>
          </Reveal>
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
            {projects.slice(0, 8).map((p) => <ProjectTile key={p.slug} p={p} />)}
          </div>
        </section>
      )}

      {/* CALCULATOR */}
      <section id="estimate" className="scroll-mt-20 border-t border-line bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className={eyebrow}>INSTANT ESTIMATE</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight">
            Know your cost <span className="accent-text-gradient">in 60 seconds.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-muted">Pick what you need and watch the estimate update. Then send it on WhatsApp or request a formal quote.</p>
          <div className="mt-10">
            <Calculator steps={calcSteps} ngnRate={ngnRate} whatsapp={whatsapp} related={related}
              calcName={hub.calcName} contactService={hub.contactService} />
          </div>
          <ul className="mt-14 grid gap-6 border-t border-line pt-10 sm:grid-cols-3">
            {[
              { Icon: Tag, title: "Real ASO rates", text: "The calculator uses my published starting rates, not teaser prices." },
              { Icon: ShieldCheck, title: "No obligation", text: "An estimate isn’t a commitment. We confirm scope before anything is billed." },
              { Icon: Clock, title: "Reply within 24–48 hours", text: "Send your estimate and I’ll come back with a formal, itemised quote." },
            ].map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="accent-icon grid size-10 shrink-0 place-items-center rounded-full"><Icon size={18} /></span>
                <span><span className="block font-display font-semibold">{title}</span><span className="mt-1 block text-sm text-muted">{text}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection items={faqs} />

      {/* CTA */}
      <section className="bg-navy py-20 text-center text-white">
        <Reveal className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight">
            Ready when you are. <span className="text-sky">Let’s start.</span>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/contact?service=${hub.contactService}`} className="inline-flex rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-azure">Start a project</Link>
            <a href="#estimate" className="inline-flex rounded-full border border-white/25 px-6 py-3 text-sm font-medium hover:border-sky">Get an estimate</a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}