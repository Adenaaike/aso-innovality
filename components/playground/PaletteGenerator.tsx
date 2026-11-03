"use client";
import { useEffect, useState } from "react";
import { Copy, Check, Lock, Unlock, RefreshCw, Heart, Trash2 } from "lucide-react";

type Swatch = { hex: string; locked: boolean };
type Mode = "aso" | "random" | "analogous" | "complementary" | "triadic" | "monochrome";

const MODES: { id: Mode; label: string }[] = [
  { id: "aso", label: "ASO Blues" },
  { id: "random", label: "Random" },
  { id: "analogous", label: "Analogous" },
  { id: "complementary", label: "Complementary" },
  { id: "triadic", label: "Triadic" },
  { id: "monochrome", label: "Monochrome" },
];
const ASO = ["#1177FF", "#1D9BFF", "#48B7FF", "#9BD9FE", "#E8FCFC"];
const STORE = "aso-saved-palettes";
const rand = (min: number, max: number) => min + Math.random() * (max - min);

function hslToHex(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const hex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${hex(f(0))}${hex(f(8))}${hex(f(4))}`.toUpperCase();
}

function hexToHue(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (d === 0) return 0;
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

// Picks navy or white text, whichever is more readable on the swatch
function textOn(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.2 ? "#101B2B" : "#FFFFFF";
}

function build(mode: Mode, base: number): string[] {
  switch (mode) {
    case "aso": return ASO;
    case "analogous": return [-40, -20, 0, 20, 40].map((o, i) => hslToHex(base + o, rand(55, 85), [35, 45, 55, 65, 75][i]));
    case "complementary": return [0, 0, 0, 180, 180].map((o, i) => hslToHex(base + o, rand(55, 85), [30, 50, 70, 45, 65][i]));
    case "triadic": return [0, 120, 240, 0, 120].map((o, i) => hslToHex(base + o, rand(55, 80), [45, 50, 55, 75, 30][i]));
    case "monochrome": return [20, 35, 50, 65, 82].map((l) => hslToHex(base, rand(60, 85), l));
    default: return Array.from({ length: 5 }, () => hslToHex(rand(0, 360), rand(40, 90), rand(25, 80)));
  }
}

export function PaletteGenerator() {
  const [mode, setMode] = useState<Mode>("aso");
  const [swatches, setSwatches] = useState<Swatch[]>(ASO.map((hex) => ({ hex, locked: false })));
  const [copied, setCopied] = useState<number | null>(null);
  const [saved, setSaved] = useState<string[][]>([]);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORE); if (raw) setSaved(JSON.parse(raw)); } catch {}
  }, []);

  function persist(list: string[][]) {
    setSaved(list);
    try { localStorage.setItem(STORE, JSON.stringify(list)); } catch {}
  }

  function generate(m: Mode = mode) {
    setSwatches((prev) => {
      const anchor = prev.find((s) => s.locked);
      const next = build(m, anchor ? hexToHue(anchor.hex) : rand(0, 360));
      return prev.map((s, i) => (s.locked ? s : { hex: next[i], locked: false }));
    });
  }

  function pickMode(m: Mode) { setMode(m); generate(m); }

  function toggleLock(i: number) {
    setSwatches((prev) => prev.map((s, j) => (j === i ? { ...s, locked: !s.locked } : s)));
  }

  async function copy(i: number) {
    try {
      await navigator.clipboard.writeText(swatches[i].hex);
      setCopied(i);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  }

  function save() {
    const hexes = swatches.map((s) => s.hex);
    if (saved.some((p) => p.join() === hexes.join())) return;
    persist([hexes, ...saved].slice(0, 12));
  }

  const btn = "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition";

  return (
    <section aria-labelledby="palette-title" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="palette-title" className="font-display text-2xl font-bold">Colour Palette Generator</h2>
          <p className="mt-1 text-sm text-muted">Lock the colours you love, then generate the rest. Locked colours guide the harmony.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => generate()} className={`${btn} bg-royal text-white hover:bg-bright`}>
            <RefreshCw size={16} /> Generate
          </button>
          <button onClick={save} className={`${btn} border border-line hover:border-royal hover:text-royal`}>
            <Heart size={16} /> Save
          </button>
        </div>
      </div>

      <div role="group" aria-label="Harmony" className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button key={m.id} onClick={() => pickMode(m.id)} aria-pressed={mode === m.id}
            className="rounded-full border border-line px-4 py-1.5 text-xs font-medium aria-pressed:border-royal aria-pressed:bg-royal aria-pressed:text-white">
            {m.label}
          </button>
        ))}
      </div>

      <ul className="grid overflow-hidden rounded-sm sm:grid-cols-5">
        {swatches.map((s, i) => {
          const fg = textOn(s.hex);
          return (
            <li key={i} className="flex h-24 items-center justify-between gap-2 px-4 sm:h-64 sm:flex-col sm:justify-end sm:py-5"
              style={{ background: s.hex, color: fg }}>
              <span className="font-display text-sm font-semibold tracking-wide">{s.hex}</span>
              <div className="flex gap-1">
                <button onClick={() => copy(i)} aria-label={`Copy ${s.hex}`}
                  className="grid size-9 place-items-center rounded-full transition hover:bg-black/10" style={{ color: fg }}>
                  {copied === i ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <button onClick={() => toggleLock(i)} aria-pressed={s.locked} aria-label={`${s.locked ? "Unlock" : "Lock"} ${s.hex}`}
                  className="grid size-9 place-items-center rounded-full transition hover:bg-black/10" style={{ color: fg }}>
                  {s.locked ? <Lock size={16} /> : <Unlock size={16} />}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p role="status" aria-live="polite" className="sr-only">{copied !== null ? `${swatches[copied].hex} copied` : ""}</p>

      {saved.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Saved palettes</h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((p, i) => (
              <li key={p.join()} className="flex items-center gap-2">
                <button onClick={() => setSwatches(p.map((hex) => ({ hex, locked: false })))}
                  aria-label={`Load palette ${p.join(", ")}`} className="flex h-10 flex-1 overflow-hidden rounded-sm border border-line">
                  {p.map((hex) => <span key={hex} className="flex-1" style={{ background: hex }} />)}
                </button>
                <button onClick={() => persist(saved.filter((_, j) => j !== i))} aria-label="Delete palette"
                  className="grid size-9 place-items-center rounded-full text-muted hover:text-royal">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}