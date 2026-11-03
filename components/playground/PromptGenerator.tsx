"use client";
import { useState } from "react";
import { Shuffle, Copy, Check } from "lucide-react";

// Examples from the ASO brief
const BRIEFS = [
  "Create a visual identity for a futuristic coffee brand.",
  "Design a promotional poster using only two colours.",
  "Create an album cover inspired by architecture.",
  "Design a logo using geometric shapes.",
  "Develop a brand identity for a sustainable fashion company.",
];
const TASKS = [
  "Design a logo for", "Create a visual identity for", "Design a poster for",
  "Create packaging for", "Design a social media campaign for", "Create an album cover for",
];
const SUBJECTS = [
  "a Lagos street-food startup", "a futuristic coffee brand", "a sustainable fashion label",
  "an indie jazz festival", "a children’s science museum", "a solar energy company",
  "a minimalist skincare line", "a neighbourhood bookstore café", "a student budgeting app",
  "an Afrobeats record label",
];
const CONSTRAINTS = [
  "using only two colours.", "using only geometric shapes.", "inspired by architecture.",
  "using only typography, no images.", "inspired by Yoruba textile patterns.",
  "that works in pure black and white.", "with a retro 1970s feel.",
  "built on the golden ratio.", "inspired by nature.", "using a single continuous line.",
];

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const makePrompt = () =>
  Math.random() < 0.25 ? pick(BRIEFS) : `${pick(TASKS)} ${pick(SUBJECTS)} ${pick(CONSTRAINTS)}`;

export function PromptGenerator() {
  const [prompt, setPrompt] = useState(BRIEFS[0]);
  const [copied, setCopied] = useState(false);

  function next() {
    let p = makePrompt();
    for (let i = 0; p === prompt && i < 10; i++) p = makePrompt();
    setPrompt(p);
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  const btn = "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition";

  return (
    <section aria-labelledby="prompt-title" className="space-y-6">
      <div>
        <h2 id="prompt-title" className="font-display text-2xl font-bold">Creative Prompt Generator</h2>
        <p className="mt-1 text-sm text-muted">Stuck for ideas? Generate a design challenge and make it your own.</p>
      </div>

      <div className="rounded-sm aso-gradient p-8 text-navy md:p-12">
        <p className="text-xs font-semibold tracking-[0.3em]">YOUR CHALLENGE</p>
        <p aria-live="polite" className="mt-4 max-w-3xl font-display text-2xl font-bold leading-snug md:text-3xl">{prompt}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={next} className={`${btn} bg-royal text-white hover:bg-bright`}>
          <Shuffle size={16} /> New challenge
        </button>
        <button onClick={copy} className={`${btn} border border-line hover:border-royal hover:text-royal`}>
          {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </section>
  );
}