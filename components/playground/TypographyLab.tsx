"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Download, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { spaceGrotesk, sora, manrope, inter, dmSans, anton, bebas } from "@/lib/fonts";

const FONTS = [
  { label: "Space Grotesk", family: spaceGrotesk.style.fontFamily, weights: [300, 400, 500, 600, 700] },
  { label: "Sora", family: sora.style.fontFamily, weights: [200, 300, 400, 500, 600, 700, 800] },
  { label: "Manrope", family: manrope.style.fontFamily, weights: [200, 300, 400, 500, 600, 700, 800] },
  { label: "Inter", family: inter.style.fontFamily, weights: [300, 400, 500, 600, 700, 800, 900] },
  { label: "DM Sans", family: dmSans.style.fontFamily, weights: [300, 400, 500, 600, 700, 800, 900] },
  { label: "Anton", family: anton.style.fontFamily, weights: [400] },
  { label: "Bebas Neue", family: bebas.style.fontFamily, weights: [400] },
];
const SWATCHES = ["#1177FF", "#1689FE", "#1D9BFF", "#21A9FF", "#48B7FF", "#6DC6FE", "#9BD9FE", "#C4E8FC", "#E8FCFC", "#101B2B", "#FFFFFF"];
const W = 1600, H = 1000, PAD = 80;
type Align = "left" | "center" | "right";

export function TypographyLab() {
  const id = useId();
  const [text, setText] = useState("IDEAS.\nIDENTITY.\nINNOVATION.");
  const [fontIdx, setFontIdx] = useState(0);
  const [size, setSize] = useState(150);
  const [weight, setWeight] = useState(700);
  const [tracking, setTracking] = useState(-0.02);
  const [lineHeight, setLineHeight] = useState(1);
  const [color, setColor] = useState("#FFFFFF");
  const [bg, setBg] = useState("#1177FF");
  const [align, setAlign] = useState<Align>("left");
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const font = FONTS[fontIdx];

  useEffect(() => {
    if (!font.weights.includes(weight)) {
      setWeight(font.weights.reduce((a, b) => (Math.abs(b - weight) < Math.abs(a - weight) ? b : a)));
    }
  }, [font, weight]);

  async function exportPNG() {
    setBusy(true);
    try {
      await document.fonts.load(`${weight} ${size}px ${font.family}`);
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.font = `${weight} ${size}px ${font.family}`;
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${tracking * size}px`;
      ctx.fillStyle = color; ctx.textBaseline = "middle"; ctx.textAlign = align;

      const lines = wrap(ctx, text, W - PAD * 2);
      const lh = size * lineHeight;
      let y = (H - lines.length * lh) / 2 + lh / 2;
      const x = align === "left" ? PAD : align === "right" ? W - PAD : W / 2;
      for (const line of lines) { ctx.fillText(line, x, y); y += lh; }

      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
      if (!blob) throw new Error("Export failed");
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href: url, download: "aso-typography-lab.png" });
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally { setBusy(false); }
  }

  const label = "block text-xs font-semibold uppercase tracking-wider text-muted mb-2";

  return (
    <section aria-labelledby={`${id}-t`} className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div ref={previewRef} className="relative flex aspect-[16/10] w-full items-center overflow-hidden rounded-sm [container-type:inline-size]"
          style={{ background: bg, padding: `${(PAD / W) * 100}cqw` }}>
          <p className="w-full whitespace-pre-wrap break-words"
            style={{ fontFamily: font.family, fontWeight: weight, fontSize: `${(size / W) * 100}cqw`, letterSpacing: `${tracking}em`, lineHeight, color, textAlign: align }}>
            {text || " "}
          </p>
        </div>
        <button onClick={exportPNG} disabled={busy}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 font-medium text-white hover:bg-bright disabled:opacity-60">
          <Download size={18} /> {busy ? "Exporting…" : "Export PNG"}
        </button>
      </div>

      <div className="space-y-6 lg:col-span-4">
        <h2 id={`${id}-t`} className="font-display text-2xl font-bold">Typography Lab</h2>

        <div><label htmlFor={`${id}-text`} className={label}>Text</label>
          <textarea id={`${id}-text`} value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={200}
            className="w-full rounded-sm border border-line bg-bg p-3 focus:border-royal focus:outline-none" /></div>

        <div><label htmlFor={`${id}-font`} className={label}>Font</label>
          <select id={`${id}-font`} value={fontIdx} onChange={(e) => setFontIdx(+e.target.value)}
            className="w-full rounded-sm border border-line bg-bg p-3">
            {FONTS.map((f, i) => <option key={f.label} value={i}>{f.label}</option>)}
          </select></div>

        <Range id={`${id}-size`} label={`Size · ${size}px`} min={24} max={320} step={2} value={size} onChange={setSize} cls={label} />
        <div><label htmlFor={`${id}-w`} className={label}>Weight</label>
          <select id={`${id}-w`} value={weight} onChange={(e) => setWeight(+e.target.value)} disabled={font.weights.length === 1}
            className="w-full rounded-sm border border-line bg-bg p-3 disabled:opacity-60">
            {font.weights.map((w) => <option key={w} value={w}>{w}</option>)}
          </select></div>
        <Range id={`${id}-ls`} label={`Letter spacing · ${tracking.toFixed(2)}em`} min={-0.1} max={0.5} step={0.01} value={tracking} onChange={setTracking} cls={label} />
        <Range id={`${id}-lh`} label={`Line height · ${lineHeight.toFixed(2)}`} min={0.7} max={2} step={0.05} value={lineHeight} onChange={setLineHeight} cls={label} />

        <fieldset><legend className={label}>Alignment</legend>
          <div className="flex gap-2">
            {([["left", AlignLeft], ["center", AlignCenter], ["right", AlignRight]] as const).map(([a, Icon]) => (
              <button key={a} type="button" onClick={() => setAlign(a)} aria-pressed={align === a} aria-label={`Align ${a}`}
                className="grid size-11 place-items-center rounded-sm border border-line aria-pressed:border-royal aria-pressed:bg-royal aria-pressed:text-white">
                <Icon size={18} />
              </button>
            ))}
          </div></fieldset>

        <ColorPicker label="Text colour" value={color} onChange={setColor} cls={label} />
        <ColorPicker label="Background" value={bg} onChange={setBg} cls={label} />
      </div>
    </section>
  );
}

function Range({ id, label, cls, onChange, ...p }: { id: string; label: string; cls: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  return (<div><label htmlFor={id} className={cls}>{label}</label>
    <input id={id} type="range" {...p} onChange={(e) => onChange(+e.target.value)} className="w-full accent-royal" /></div>);
}

function ColorPicker({ label, value, onChange, cls }: { label: string; value: string; onChange: (v: string) => void; cls: string }) {
  return (
    <fieldset><legend className={cls}>{label}</legend>
      <div className="flex flex-wrap items-center gap-2">
        {SWATCHES.map((c) => (
          <button key={c} type="button" onClick={() => onChange(c)} aria-label={`${label} ${c}`} aria-pressed={value.toLowerCase() === c.toLowerCase()}
            className="size-8 rounded-full border border-line ring-royal ring-offset-2 ring-offset-bg aria-pressed:ring-2" style={{ background: c }} />
        ))}
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={`Custom ${label.toLowerCase()}`}
          className="size-8 cursor-pointer rounded-full border border-line bg-transparent" />
      </div>
    </fieldset>
  );
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(" ")) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) { out.push(line); line = word; } else line = test;
    }
    out.push(line);
  }
  return out;
}