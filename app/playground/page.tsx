import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TypographyLab } from "@/components/playground/TypographyLab";
import { PaletteGenerator } from "@/components/playground/PaletteGenerator";
import { ColourMatch } from "@/components/playground/ColourMatch";
import { PromptGenerator } from "@/components/playground/PromptGenerator";
import { DesignMemory } from "@/components/playground/DesignMemory";
import { LogoDetective } from "@/components/playground/LogoDetective";
import { MonogramMaker } from "@/components/playground/MonogramMaker";
import { TimeSavedCalculator } from "@/components/playground/TimeSavedCalculator";
import { CarouselSplitter } from "@/components/playground/CarouselSplitter";
import { LinkPreviewTester } from "@/components/playground/LinkPreviewTester";
import { BrandQuiz } from "@/components/playground/BrandQuiz";
import { PLAYGROUND_SECTIONS, PLAYGROUND_TOOLS } from "@/lib/playground";

export const metadata: Metadata = {
  title: "The Creative Playground — Free Design, Web & Automation Tools",
  description: "Free interactive tools by ASO Innovality: typography, palettes, design games, a monogram maker and an automation time-saved calculator.",
  alternates: { canonical: "/playground" },
};

const EL: Record<string, ReactNode> = {
  "typography-lab": <TypographyLab />,
  palette: <PaletteGenerator />,
  "colour-match": <ColourMatch />,
  memory: <DesignMemory />,
  "logo-detective": <LogoDetective />,
  prompts: <PromptGenerator />,
  monogram: <MonogramMaker />,
  "time-saved": <TimeSavedCalculator />,
  "carousel-splitter": <CarouselSplitter />,
  "link-preview": <LinkPreviewTester />,
  "brand-quiz": <BrandQuiz />,
};

export default function Playground() {
  const sections = PLAYGROUND_SECTIONS
    .map((s) => ({ ...s, tools: PLAYGROUND_TOOLS.filter((t) => t.practice === s.key && EL[t.id]) }))
    .filter((s) => s.tools.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">THE CREATIVE PLAYGROUND</p>
      <h1 className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">
        A space where creativity meets experimentation.
      </h1>
      <p className="mt-4 max-w-2xl text-muted">Free tools and games, built by ASO. Play, create, download, and share.</p>

      <nav aria-label="Playground tools" className="mt-10 mb-20 space-y-4">
        {sections.map((s) => (
          <div key={s.key} className={`accent-${s.key} flex flex-wrap items-center gap-2`}>
            <span className="accent-text mr-2 w-full text-[10px] font-semibold uppercase tracking-[0.25em] sm:w-auto">{s.title}</span>
            {s.tools.map((t) => (
              <a key={t.id} href={`#${t.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium transition hover:border-[var(--accent)] hover:text-[var(--accent-text)]">
                {t.label}
                {t.isNew && <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[var(--accent-on)]">New</span>}
              </a>
            ))}
          </div>
        ))}
      </nav>

      <div className="space-y-32">
        {sections.map((s) => (
          <section key={s.key} className={`accent-${s.key}`} aria-labelledby={`sec-${s.key}`}>
            <div className="mb-14 border-b border-line pb-6">
              <h2 id={`sec-${s.key}`} className="font-display text-3xl font-bold md:text-4xl">
                <span className="accent-text-gradient">{s.title}</span>
              </h2>
              <p className="mt-2 max-w-xl text-muted">{s.text}</p>
            </div>
            <div className="space-y-24">
              {s.tools.map((t) => (
                <div key={t.id} id={t.id} className="scroll-mt-24">{EL[t.id]}</div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}