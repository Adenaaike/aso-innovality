import type { Metadata } from "next";
import { TypographyLab } from "@/components/playground/TypographyLab";

export const metadata: Metadata = { title: "The Creative Playground", description: "Interactive typography, colour and design experiments by ASO Innovality." };

export default function Playground() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
      <p className="text-xs font-semibold tracking-[0.35em] text-royal dark:text-light-azure">THE CREATIVE PLAYGROUND</p>
      <h1 className="mt-4 mb-16 max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95]">
        A space where creativity meets experimentation.
      </h1>
      <TypographyLab />
    </div>
  );
}