"use client";
import { Palette, Wand2 } from "lucide-react";
import { ARCH_KEYS, FONT_PAIRS, PRESETS, type ArchKey } from "@/lib/remix";

export function RemixTool() {
  const apply = (key: ArchKey) => window.dispatchEvent(new CustomEvent("aso:remix-apply", { detail: { kind: "preset", key } }));

  return (
    <section aria-labelledby="remix-tool-title">
      <p className="accent-text text-xs font-semibold tracking-[0.3em]">REMIX THIS SITE</p>
      <h2 id="remix-tool-title" className="mt-3 font-display text-2xl font-bold md:text-3xl">See this whole website in your brand.</h2>
      <p className="mt-2 max-w-xl text-muted">
        Pick a brand personality and watch every page transform: colours, gradients, glows and fonts. Browse around, share your remix, and reset anytime from the bar at the bottom.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ARCH_KEYS.map((k) => (
          <button key={k} type="button" onClick={() => apply(k)}
            className="group rounded-xl border border-line p-3 text-left transition hover:-translate-y-1 hover:border-[var(--accent)]">
            <span className="block aspect-[4/3] rounded-lg transition group-hover:shadow-lg"
              style={{ backgroundImage: `linear-gradient(135deg, ${PRESETS[k].p}, ${PRESETS[k].a})` }} />
            <span className="mt-2 block text-sm font-semibold">{PRESETS[k].name}</span>
            <span className="block text-[11px] text-muted">{FONT_PAIRS[k].display} + {FONT_PAIRS[k].body}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => window.dispatchEvent(new Event("aso:remix-open"))}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-on)] hover:brightness-110">
          <Palette size={16} /> Use my own colours
        </button>
        <a href="#brand-quiz" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium hover:border-[var(--accent)]">
          <Wand2 size={16} /> Find my brand personality first
        </a>
      </div>
    </section>
  );
}