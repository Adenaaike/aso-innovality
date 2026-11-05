"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { scriptFont } from "@/lib/script-font";

const SHAPES = ["Circle", "Double ring", "Shield", "Square", "Diamond", "None"] as const;
const FONTS = ["Modern", "Classic", "Script"] as const;
const COLOURS = [
  { name: "ASO Blue", hex: "#1177FF" }, { name: "Navy", hex: "#101B2B" }, { name: "Gold", hex: "#C9962A" },
  { name: "Coral", hex: "#E5484D" }, { name: "Black", hex: "#111111" }, { name: "White", hex: "#FFFFFF" },
];
const BACKGROUNDS = [
  { name: "Transparent", hex: "transparent" }, { name: "Light", hex: "#F7FAFE" }, { name: "Dark", hex: "#101B2B" },
];

type Shape = (typeof SHAPES)[number];
type FontKey = (typeof FONTS)[number];
type Opts = { text: string; shape: Shape; font: FontKey; fg: string; bg: string };

function family(font: FontKey) {
  if (font === "Script") return scriptFont.style.fontFamily;
  if (font === "Classic") return "Georgia, 'Times New Roman', serif";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-space-grotesk").trim();
  return v || "system-ui, sans-serif";
}

function draw(ctx: CanvasRenderingContext2D, S: number, o: Opts) {
  ctx.clearRect(0, 0, S, S);
  if (o.bg !== "transparent") { ctx.fillStyle = o.bg; ctx.fillRect(0, 0, S, S); }
  const c = S / 2;
  ctx.strokeStyle = o.fg; ctx.fillStyle = o.fg; ctx.lineWidth = S * 0.018; ctx.lineJoin = "round";

  ctx.beginPath();
  if (o.shape === "Circle") { ctx.arc(c, c, S * 0.4, 0, Math.PI * 2); ctx.stroke(); }
  if (o.shape === "Double ring") {
    ctx.lineWidth = S * 0.014; ctx.arc(c, c, S * 0.42, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.lineWidth = S * 0.006; ctx.arc(c, c, S * 0.37, 0, Math.PI * 2); ctx.stroke();
  }
  if (o.shape === "Square") { ctx.roundRect(c - S * 0.36, c - S * 0.36, S * 0.72, S * 0.72, S * 0.08); ctx.stroke(); }
  if (o.shape === "Diamond") {
    ctx.moveTo(c, c - S * 0.42); ctx.lineTo(c + S * 0.42, c); ctx.lineTo(c, c + S * 0.42); ctx.lineTo(c - S * 0.42, c); ctx.closePath(); ctx.stroke();
  }
  if (o.shape === "Shield") {
    ctx.moveTo(c - S * 0.34, c - S * 0.36); ctx.lineTo(c + S * 0.34, c - S * 0.36); ctx.lineTo(c + S * 0.34, c + S * 0.02);
    ctx.quadraticCurveTo(c + S * 0.34, c + S * 0.3, c, c + S * 0.42);
    ctx.quadraticCurveTo(c - S * 0.34, c + S * 0.3, c - S * 0.34, c + S * 0.02); ctx.closePath(); ctx.stroke();
  }

  const text = o.font === "Script" ? o.text : o.text.toUpperCase();
  const n = Math.max(1, text.length);
  let size = S * (n === 1 ? 0.42 : n === 2 ? 0.32 : 0.24);
  if (o.font === "Script") size *= 1.3;
  if (o.shape === "Diamond") size *= 0.85;
  ctx.font = `${o.font === "Script" ? 400 : 700} ${size}px ${family(o.font)}`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, c, c + (o.shape === "Shield" ? -S * 0.03 : 0) + size * 0.04);
}

export function MonogramMaker() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [o, setO] = useState<Opts>({ text: "ASO", shape: "Circle", font: "Modern", fg: "#1177FF", bg: "transparent" });
  const set = <K extends keyof Opts>(k: K, v: Opts[K]) => setO((p) => ({ ...p, [k]: v }));

  const render = useCallback(async () => {
    const el = canvas.current;
    if (!el) return;
    try { await document.fonts.load(`700 40px ${family(o.font)}`); } catch {}
    const S = 480, dpr = window.devicePixelRatio || 1;
    el.width = S * dpr; el.height = S * dpr;
    const ctx = el.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, S, o);
  }, [o]);

  useEffect(() => { render(); }, [render]);

  async function download() {
    try { await document.fonts.load(`700 40px ${family(o.font)}`); } catch {}
    const S = 1080;
    const c = document.createElement("canvas");
    c.width = S; c.height = S;
    draw(c.getContext("2d")!, S, o);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/png"));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), { href: url, download: `monogram-${(o.text || "aso").toLowerCase()}.png` }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const chip = "rounded-full border px-3 py-1.5 text-xs font-medium transition";
  const on = "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-text)]";
  const off = "border-line hover:border-[var(--accent)]";

  return (
    <section aria-labelledby="monogram-title">
      <span aria-hidden className={`${scriptFont.className} absolute opacity-0`}>Aa</span>
      <p className="accent-text text-xs font-semibold tracking-[0.3em]">MONOGRAM MAKER</p>
      <h2 id="monogram-title" className="mt-3 font-display text-2xl font-bold md:text-3xl">Turn your initials into a mark.</h2>
      <p className="mt-2 max-w-xl text-muted">Pick a frame, a font style and a colour, then download your monogram as a high-resolution PNG.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div>
            <label htmlFor="mono-text" className="mb-1 block text-sm font-medium">Initials (1–3 letters)</label>
            <input id="mono-text" value={o.text} maxLength={3} onChange={(e) => set("text", e.target.value.replace(/[^A-Za-z0-9&]/g, ""))}
              className="w-full rounded-sm border border-line bg-bg p-3 font-display text-lg focus:border-[var(--accent)] focus:outline-none" />
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Frame</legend>
            <div className="flex flex-wrap gap-2">
              {SHAPES.map((s) => <button key={s} type="button" onClick={() => set("shape", s)} aria-pressed={o.shape === s} className={`${chip} ${o.shape === s ? on : off}`}>{s}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Font style</legend>
            <div className="flex flex-wrap gap-2">
              {FONTS.map((f) => <button key={f} type="button" onClick={() => set("font", f)} aria-pressed={o.font === f} className={`${chip} ${o.font === f ? on : off}`}>{f}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Colour</legend>
            <div className="flex flex-wrap gap-2">
              {COLOURS.map((c) => (
                <button key={c.hex} type="button" onClick={() => set("fg", c.hex)} aria-pressed={o.fg === c.hex} aria-label={c.name} title={c.name}
                  className={`size-9 rounded-full border-2 transition ${o.fg === c.hex ? "border-[var(--accent)] scale-110" : "border-line"}`} style={{ background: c.hex }} />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Background</legend>
            <div className="flex flex-wrap gap-2">
              {BACKGROUNDS.map((b) => <button key={b.name} type="button" onClick={() => set("bg", b.hex)} aria-pressed={o.bg === b.hex} className={`${chip} ${o.bg === b.hex ? on : off}`}>{b.name}</button>)}
            </div>
          </fieldset>
          <button type="button" onClick={download} disabled={!o.text}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-on)] transition hover:brightness-110 disabled:opacity-40">
            <Download size={16} /> Download PNG (1080 × 1080)
          </button>
        </div>

        <div className="lg:col-span-7">
          <div className="grid aspect-square w-full max-w-[480px] place-items-center overflow-hidden rounded-lg border border-line bg-[conic-gradient(#e5e7eb_25%,#fff_0_50%,#e5e7eb_0_75%,#fff_0)] bg-[length:24px_24px] dark:bg-[conic-gradient(#1f2937_25%,#111827_0_50%,#1f2937_0_75%,#111827_0)]">
            <canvas ref={canvas} className="size-full" aria-label={`Monogram preview: ${o.text}`} role="img" />
          </div>
          <p className="mt-4 text-sm text-muted">
            A monogram is a great start. A full logo system is what makes a brand.{" "}
            <Link href="/design" className="accent-text inline-flex items-center gap-1 font-medium hover:underline">Explore Design Studio <ArrowUpRight size={14} /></Link>
          </p>
        </div>
      </div>
    </section>
  );
}