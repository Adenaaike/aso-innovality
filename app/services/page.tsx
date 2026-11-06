import type { Metadata } from "next";
import { PracticeCards } from "@/components/practices/PracticeCards";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ServicesAccordion } from "@/components/services/ServicesAccordion";
import { CoverflowCarousel } from "@/components/carousel/CoverflowCarousel";
import { StartProjectButton } from "@/components/StartProjectButton";
import { services, steps } from "@/lib/site";
import { getServicePreviews, getCarousels } from "@/lib/projects";
import { getTestimonials, getFaqs, getPackages } from "@/lib/content";
import { Testimonials } from "@/components/content/Testimonials";
import { FaqSection } from "@/components/content/Faq";
import { Packages } from "@/components/content/Packages";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Services — Brand Identity, Design, Websites & Automation",
  description: "Brand identity, campaign and carousel design, photo manipulation, packaging and print, plus websites, SEO and AI automation by ASO INNOVALITY in Lagos.",
  alternates: { canonical: "/services" },
};

export default async function Services() {
  const [previews, carousels, testimonials, faqs, packages] = await Promise.all([
    getServicePreviews(), getCarousels(), getTestimonials(), getFaqs(), getPackages(),
  ]);

  return (
    <div className="pt-32">
      <section className="mx-auto max-w-6xl px-6">
        <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">SERVICES</p>
        <h1 className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">
          End-to-end visual solutions built for <span className="aso-text-gradient">growth and authority.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          Whether you’re launching a new venture, running a campaign or refreshing an established identity, I bring structured creative execution from first idea to final file.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Need a website or automation too? Explore <Link href="/web" className="font-medium text-royal hover:underline dark:text-light-azure">Web & SEO</Link> and{" "}
          <Link href="/ai" className="font-medium text-royal hover:underline dark:text-light-azure">AI & Automation</Link>.
        </p>
        <div className="mt-12"><ServicesAccordion previews={previews} /></div>
      </section>

      {carousels.length > 0 && (
        <section id="carousels" className="mt-10 scroll-mt-20 overflow-hidden bg-navy py-14 text-white sm:mt-20 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold tracking-[0.3em] text-sky">CAROUSEL DESIGN</p>
              <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight">
                Swipe-worthy <span className="text-sky">carousels.</span>
              </h2>
              <p className="mt-4 text-ice">
                Multi-slide stories built to stop the scroll, explain the offer and earn the swipe. Tap the centre carousel to view every slide.
              </p>
            </div>
            <div className="mt-14"><CoverflowCarousel carousels={carousels} /></div>
          </div>
        </section>
      )}

      <section className="mx-auto mt-16 max-w-6xl px-6">
        {services.map((s) => (
          <section key={s.slug} id={s.slug} className="grid scroll-mt-24 gap-10 border-t border-line py-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <span className="font-display text-sm text-royal dark:text-light-azure">{s.no}</span>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">{s.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-muted">{s.summary}</p>
              <Link href={`/contact?service=${s.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-bright">
                Start a project <ArrowUpRight size={16} />
              </Link>
            </Reveal>
            <Reveal delay={0.1} className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Deliverables</h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {s.deliverables.map((d) => <li key={d} className="flex gap-2.5"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-royal" />{d}</li>)}
                </ul>
              </div>
              <Link href={s.slug === "carousel-design" && carousels.length ? "#carousels" : "/work"} className="group grid grid-cols-3 gap-2 self-start" aria-label={`See ${s.title} work`}>
                {(previews[s.slug]?.length ? previews[s.slug] : [null, null, null]).slice(0, 3).map((src, i) => (
                  <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface">
                    {src
                      ? <Image src={src} alt="" fill sizes="160px" className="object-cover transition duration-500 group-hover:scale-105" />
                      : <div className="absolute inset-0 aso-gradient opacity-40" />}
                  </div>
                ))}
                <span className="col-span-3 mt-1 text-xs font-medium text-royal group-hover:underline dark:text-light-azure">See related work →</span>
              </Link>
            </Reveal>
          </section>
        ))}
      </section>

      <section className="mt-10 bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal><h2 className="font-display text-2xl font-bold md:text-3xl">How a project runs</h2></Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
              <li key={s.no} className="group relative h-full overflow-hidden rounded-lg border border-line bg-bg p-6 transition duration-300 hover:-translate-y-1 hover:border-royal hover:shadow-[0_20px_40px_-24px_var(--color-royal)]">
                <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 aso-gradient transition-transform duration-500 group-hover:scale-x-100" />
                <Reveal delay={i * 0.08}>
                  <span className="inline-block font-display text-sm text-royal transition duration-300 group-hover:translate-x-1 dark:text-light-azure">{s.no}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <PracticeCards />
      <Packages items={packages} />
      <Testimonials items={testimonials} />
      <FaqSection items={faqs} />

      <section className="bg-navy py-20 text-center text-white">
        <Reveal className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight">
            Have a brief in mind? <span className="text-sky">Let’s talk.</span>
          </h2>
          <p className="mt-4 text-ice">Projects start from $300. Every brief is quoted individually.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <StartProjectButton className="inline-flex rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-azure">Start your project</StartProjectButton>
            <Link href="/estimate" className="inline-flex rounded-full border border-white/25 px-6 py-3 text-sm font-medium hover:border-sky">Get an instant estimate</Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}