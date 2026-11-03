import type { Metadata } from "next";
import { TypographyLab } from "@/components/playground/TypographyLab";
import { PaletteGenerator } from "@/components/playground/PaletteGenerator";
import { ColourMatch } from "@/components/playground/ColourMatch";
import { PromptGenerator } from "@/components/playground/PromptGenerator";
import { DesignMemory } from "@/components/playground/DesignMemory";
import { LogoDetective } from "@/components/playground/LogoDetective";

export const metadata: Metadata = {
  title: "The Creative Playground",
  description: "Interactive typography, colour and design experiments and games by ASO Innovality.",
};

const tools = [
    { id: "typography-lab", label: "Typography Lab", el: <TypographyLab /> },
    { id: "palette", label: "Palette Generator", el: <PaletteGenerator /> },
    { id: "colour-match", label: "Colour Match", el: <ColourMatch /> },
    { id: "memory", label: "Design Memory", el: <DesignMemory /> },
    { id: "logo-detective", label: "Logo Detective", el: <LogoDetective /> },
    { id: "prompts", label: "Prompt Generator", el: <PromptGenerator /> },
  ];

export default function Playground() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">THE CREATIVE PLAYGROUND</p>
      <h1 className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">
        A space where creativity meets experimentation.
      </h1>

      <nav aria-label="Playground tools" className="mt-8 mb-16 flex flex-wrap gap-2">
        {tools.map((t) => (
          <a key={t.id} href={`#${t.id}`}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium transition hover:border-royal hover:text-royal">
            {t.label}
          </a>
        ))}
      </nav>

      <div className="space-y-24">
        {tools.map((t) => (
          <div key={t.id} id={t.id} className="scroll-mt-24">{t.el}</div>
        ))}
      </div>
    </div>
  );
}