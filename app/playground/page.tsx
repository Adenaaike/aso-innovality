import type { Metadata } from "next";
import { TypographyLab } from "@/components/playground/TypographyLab";
import { PaletteGenerator } from "@/components/playground/PaletteGenerator";

export const metadata: Metadata = { title: "The Creative Playground", description: "Interactive typography, colour and design experiments by ASO Innovality." };

export default function Playground() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">THE CREATIVE PLAYGROUND</p>
      <h1 className="mt-4 mb-16 max-w-3xl font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">
        A space where creativity meets experimentation.
      </h1>
      <div className="space-y-24">
        <TypographyLab />
        <PaletteGenerator />
      </div>
    </div>
  );
}