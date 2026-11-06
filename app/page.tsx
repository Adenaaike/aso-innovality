import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { Reveal } from "@/components/Reveal";
import { StatusCard } from "@/components/home/StatusCard";
import { Marquee } from "@/components/home/Marquee";
import { RotatingWord } from "@/components/home/RotatingWord";
import { WorkTabs, type WorkItem } from "@/components/home/WorkTabs";
import { StartProjectButton } from "@/components/StartProjectButton";
import { RemixButton } from "@/components/remix/RemixButton";
import { Testimonials } from "@/components/content/Testimonials";
import { publicClient } from "@/lib/supabase/public";
import { getSettings } from "@/lib/settings";
import { getTestimonials } from "@/lib/content";
import { PRACTICES } from "@/lib/practices";
import { PLAYGROUND_TOOLS } from "@/lib/playground";
import { ARCH_KEYS, PRESETS } from "@/lib/remix";
import { getWall } from "@/lib/wall";

export const revalidate = 300;

/* ---------- data ---------- */
const WEB_CATS = ["Web Design & Development", "SEO"];
const AI_CATS = ["AI & Automation"];
const practiceOf = (c: string | null): WorkItem["practice"] =>
  c && WEB_CATS.includes(c) ? "web" : c && AI_CATS.includes(c) ? "ai" : "design";

async function getWork(): Promise<WorkItem[]> {
  const sb = publicClient();
  if (!sb) return [];
  const { data } = await sb.from("projects")
    .select("slug, title, year, cover_url, featured, category:categories(name)")
    .eq("published", true)
    .order("featured", { ascending: false }).order("sort_order").limit(40);
  const rows = ((data ?? []) as unknown as { slug: string; title: string; year: number | null; cover_url: string | null; category: { name: string } | null }[])
    .map((r) => ({ slug: r.slug, title: r.title, year: r.year, cover_url: r.cover_url, category: r.category?.name ?? null, practice: practiceOf(r.category?.name ?? null) }));
  // Up to 8 design projects, plus every web and AI project
  let design = 0;
  return rows.filter((r) => (r.practice === "design" ? design++ < 8 : true));
}

/* ---------- content ---------- */
const DETAILS: Record<string, { eyebrow: string; text: string; services: string[]; from: string; explore: string }> = {
  design: {
    eyebrow: "IDENTITY",
    text: "Brand identities and visuals that make organisations impossible to ignore. 9+ years of craft.",
    services: ["Logo & brand identity systems", "Social media posts & carousels", "Campaign key visuals & posters", "Packaging, print & photo manipulation"],
    from: "From $300", explore: "Explore Design",
  },
  web: {
    eyebrow: "INNOVATION",
    text: "Fast, mobile-first websites I design and build myself, set up to be found on Google.",
    services: ["Landing pages & business websites", "On-page SEO & speed optimisation", "Google Business Profile & analytics setup", "Care & SEO plans to keep growing"],
    from: "From $150", explore: "Explore Web & SEO",
  },
  ai: {
    eyebrow: "INNOVATION",
    text: "Practical automations that reply, follow up and organise, so repetitive work runs itself.",
    services: ["WhatsApp & chatbot automations", "Lead capture & instant follow-ups", "Content & admin workflows", "Custom workflows connecting your tools"],
    from: "From $300", explore: "Explore AI & Automation",
  },
};

const PROCESS = [
  { no: "01", title: "Discover", text: "We talk through your goals, audience and timeline, starting with a short brief and a discovery call." },
  { no: "02", title: "Plan", text: "I map the approach and share a clear quote, scope and timeline before any work begins." },
  { no: "03", title: "Create", text: "I design, build or automate, sharing progress and refining with two rounds of revisions." },
  { no: "04", title: "Launch & support", text: "You get final files, a live site or a working automation, plus help afterwards." },
];

const STATS = [
  { value: "9+", label: "Years designing" },
  { value: "8", label: "Organisations designed for" },
  { value: "2", label: "Countries served" },
  { value: "3", label: "Practices, one studio" },
];

const eyebrow = "text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure";
const sweep = "accent-gradient absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100";

export default async function Home() {
  const [work, settings, testimonials, wall] = await Promise.all([getWork(), getSettings(), getTestimonials(), getWall(24)]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-16 lg:min-h-[90svh] lg:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_50%_at_78%_38%,#21A9FF33,transparent_70%),radial-gradient(40%_40%_at_15%_85%,#1177FF1F,transparent_70%)]" />
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <StatusCard available={settings.available} note={settings.availabilityNote}
              workDays={settings.workDays} workStart={settings.workStart} workEnd={settings.workEnd} />
            <h1 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.75rem)] font-bold uppercase leading-[1.02] tracking-tight">
              I turn ideas into <span className="sr-only">brands, websites and automations.</span>
              <span className="block"><RotatingWord /></span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted md:text-lg">Brand identity, websites and smart automation, under one studio.</p>

            <ul aria-label="My practices" className="mt-6 flex flex-wrap gap-2">
              {PRACTICES.map((p) => {
                const Icon = p.Icon;
                return (
                  <li key={p.key}>
                    <Link href={p.href}
                      className={`accent-${p.key} inline-flex items-center gap-2 rounded-full border border-line bg-bg/60 px-4 py-2 text-sm font-medium backdrop-blur transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]`}>
                      <span aria-hidden className="size-2 rounded-full bg-[var(--accent)]" />
                      <Icon size={15} className="accent-text" />
                      {p.title}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link href="/estimate" className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-royal dark:text-light-azure">
              <span className="grid size-6 place-items-center rounded-full bg-royal/10 text-xs font-bold">$</span>
              Know your project cost in 60 seconds
              <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <div className="mt-6 flex flex-wrap gap-3">
              <StartProjectButton className="group inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-medium text-white transition hover:bg-bright">
                Start your project <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </StartProjectButton>
              <Link href="/work" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium transition hover:border-royal hover:text-royal">
                Explore my work
              </Link>
            </div>
          </div>
          <div className="h-[36vh] lg:col-span-5 lg:h-[56vh]"><HeroVisual /></div>
        </div>
      </section>

      {/* WHAT I DO */}
      <section className="mx-auto max-w-6xl px-6 py-24" aria-labelledby="what-title">
        <Reveal className="max-w-3xl">
          <p className={eyebrow}>WHAT I DO</p>
          <h2 id="what-title" className="mt-4 font-display text-3xl font-bold md:text-4xl">
            One studio. <span className="aso-text-gradient">Three ways to grow your brand.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Pick the practice you need, or combine them. Every project gets the same care, strategy and finish.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PRACTICES.map((p, i) => {
            const Icon = p.Icon;
            const d = DETAILS[p.key];
            return (
              <Reveal key={p.key} delay={i * 0.08}>
                <article className={`accent-${p.key} glow-card group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-bg p-7`}>
                  <span aria-hidden className={sweep} />
                  <span className="accent-icon grid size-12 place-items-center rounded-full"><Icon size={22} /></span>
                  <p className="mt-5 text-[10px] font-semibold tracking-[0.3em] text-muted">{d.eyebrow}</p>
                  <h3 className="mt-1 font-display text-2xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{d.text}</p>
                  <ul className="mt-5 space-y-2.5 text-sm">
                    {d.services.map((s) => (
                      <li key={s} className="flex gap-2.5"><Check size={16} className="accent-text mt-0.5 shrink-0" />{s}</li>
                    ))}
                  </ul>
                  <p className="mt-6 font-display text-lg font-bold accent-text">{d.from}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    <Link href={`${p.href}#estimate`}
                      className="inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-on)] transition hover:brightness-110">
                      Get an estimate
                    </Link>
                    <Link href={p.href}
                      className="inline-flex items-center gap-1 rounded-full border border-line px-5 py-2.5 text-sm font-medium transition hover:border-[var(--accent)]">
                      {d.explore} <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-muted">
          Not sure where to start?{" "}
          <StartProjectButton className="font-medium text-royal underline underline-offset-4 dark:text-light-azure">Start your project →</StartProjectButton>
        </p>
      </section>

      {/* TRUSTED BY */}
      <Marquee />

      {/* SELECTED WORK */}
      <section className="border-b border-line bg-surface/50 py-24" aria-labelledby="work-title">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={eyebrow}>SELECTED WORK</p>
              <h2 id="work-title" className="mt-4 font-display text-3xl font-bold md:text-4xl">Recent projects across all three practices.</h2>
            </div>
            <Link href="/work" className="text-sm font-medium text-royal hover:underline dark:text-light-azure">View all work →</Link>
          </Reveal>
          <WorkTabs items={work} />
        </div>
      </section>

      {/* HOW I WORK */}
      <section className="mx-auto max-w-6xl px-6 py-24" aria-labelledby="process-title">
        <Reveal>
          <p className={eyebrow}>HOW I WORK</p>
          <h2 id="process-title" className="mt-4 font-display text-3xl font-bold md:text-4xl">A clear process, whatever you need.</h2>
        </Reveal>
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((s, i) => (
            <li key={s.no} className="accent-design glow-card group relative h-full overflow-hidden rounded-lg border border-line bg-bg p-6">
              <span aria-hidden className={sweep} />
              <Reveal delay={i * 0.08}>
                <span className="inline-block font-display text-sm accent-text transition duration-300 group-hover:translate-x-1">{s.no}</span>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="border-t border-line bg-surface py-24" aria-labelledby="about-title">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-lg sm:max-w-sm lg:mx-0">
              <Image src={settings.portraitHome} alt="Portrait of Adenaike Sodiq Olusegun, creative designer in Lagos"
                fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <p className={eyebrow}>THE CREATIVE MIND BEHIND ASO INNOVALITY</p>
            <h2 id="about-title" className="mt-4 font-display text-3xl font-bold md:text-4xl">
              Where strategic thinking meets <span className="aso-text-gradient">visual craft.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              I’m Adenaike Sodiq Olusegun, a Lagos-based creative designer with 9+ years helping organisations, startups and ministries communicate with clarity. Today I bring that same care to websites and smart automation, so my clients get one trusted partner from brand to growth.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-3xl font-bold">{s.value}</dd>
                  <dd className="mt-1 text-xs text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium transition hover:border-royal hover:text-royal">
              More about me <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* THE LAB */}
      <section className="bg-navy py-24 text-white" aria-labelledby="lab-title">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.3em] text-sky">THE LAB</p>
            <h2 id="lab-title" className="mt-4 font-display text-3xl font-bold md:text-4xl">
              Free tools, <span className="aso-text-gradient">built in-house.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ice">Proof of the craft: interactive tools I designed and built, free for everyone.</p>
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <Reveal>
              <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-7">
                <h3 className="font-display text-xl font-bold">The Creative Playground</h3>
                <p className="mt-2 text-sm leading-relaxed text-ice">
                  {PLAYGROUND_TOOLS.length} free tools: brand personality quiz, palette generator, monogram maker, carousel splitter, link preview tester and more.
                </p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {PLAYGROUND_TOOLS.slice(0, 6).map((t) => (
                    <li key={t.id}><Link href={`/playground#${t.id}`} className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20">{t.label}</Link></li>
                  ))}
                </ul>
                <Link href="/playground" className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-semibold text-sky hover:text-pale-blue">
                  Open the Playground <ArrowUpRight size={15} />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-7">
                <h3 className="font-display text-xl font-bold">Remix This Site</h3>
                <p className="mt-2 text-sm leading-relaxed text-ice">See this whole website transform into your brand’s colours and fonts, live.</p>
                <div className="mt-5 flex gap-2" aria-hidden>
                  {ARCH_KEYS.slice(0, 5).map((k) => (
                    <span key={k} className="size-8 rounded-full ring-2 ring-white/20" style={{ backgroundImage: `linear-gradient(135deg, ${PRESETS[k].p}, ${PRESETS[k].a})` }} />
                  ))}
                </div>
                <RemixButton className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-semibold text-sky hover:text-pale-blue">
                  Remix it <ArrowUpRight size={15} />
                </RemixButton>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-7">
                <h3 className="font-display text-xl font-bold">The Idea Wall</h3>
                <p className="mt-2 text-sm leading-relaxed text-ice">A living palette made by visitors. Add one colour a day.</p>
                <div className="mt-5 grid grid-cols-8 gap-1.5" aria-hidden>
                  {(wall.length ? wall.map((e) => e.color) : ["#0B6CEB", "#21A9FF", "#00A699", "#F2A900", "#FF5A5F", "#7B3FE4", "#3B7A52", "#E5484D"])
                    .slice(0, 24).map((c, i) => <span key={i} className="aspect-square rounded-sm" style={{ background: c }} />)}
                </div>
                <Link href="/wall" className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-semibold text-sky hover:text-pale-blue">
                  Add your colour <ArrowUpRight size={15} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (only shows once you add some in the admin) */}
      <Testimonials items={testimonials} />

      {/* CTA */}
      <section className="bg-navy py-20 text-center text-white">
        <Reveal className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-[clamp(1.75rem,4.5vw,3.25rem)] font-bold uppercase leading-[1.05]">
            Have an idea? <span className="aso-text-gradient">Let’s bring it to life.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ice">Brand identity, websites and smart automation, under one studio.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <StartProjectButton className="inline-flex rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-azure">Start your project</StartProjectButton>
            <Link href="/estimate" className="inline-flex rounded-full border border-white/25 px-6 py-3 text-sm font-medium hover:border-sky">Get an instant estimate</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}