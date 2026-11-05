"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { AlertTriangle, ArrowUpRight, Download, ImagePlus, Loader2 } from "lucide-react";
import JSZip from "jszip";

const FORMATS = [
  { key: "portrait", label: "Portrait 4:5", w: 1080, h: 1350 },
  { key: "square", label: "Square 1:1", w: 1080, h: 1080 },
] as const;
type Format = (typeof FORMATS)[number];

export function CarouselSplitter() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("carousel");
  const [n, setN] = useState(3);
  const [fmt, setFmt] = useState<Format>(FORMATS[0]);
  const [px, setPx] = useState(0.5);
  const [py, setPy] = useState(0.5);
  const [busy, setBusy] = useState(false);
  const preview = useRef<HTMLCanvasElement>(null);

  function load(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const im = new Image();
    im.onload = () => setImg(im);
    im.src = URL.createObjectURL(file);
    setName(file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-") || "carousel");
  }
  const onPick = (e: ChangeEvent<HTMLInputElement>) => { load(e.target.files?.[0]); e.target.value = ""; };
  const onDrop = (e: DragEvent) => { e.preventDefault(); load(e.dataTransfer.files?.[0]); };

  // Where the image sits across the whole carousel strip
  function layout(im: HTMLImageElement) {
    const W = n * fmt.w, H = fmt.h;
    const scale = Math.max(W / im.width, H / im.height);
    const dw = im.width * scale, dh = im.height * scale;
    return { W, H, dw, dh, ox: (W - dw) * px, oy: (H - dh) * py };
  }

  useEffect(() => {
    const el = preview.current;
    if (!el || !img) return;
    const L = layout(img);
    const PW = el.parentElement?.clientWidth || 900;
    const s = PW / L.W, dpr = window.devicePixelRatio || 1;
    el.width = PW * dpr; el.height = L.H * s * dpr;
    el.style.height = `${L.H * s}px`;
    const ctx = el.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(img, L.ox * s, L.oy * s, L.dw * s, L.dh * s);
    ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
    for (let i = 1; i < n; i++) { const x = i * fmt.w * s; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, L.H * s); ctx.stroke(); }
    ctx.setLineDash([]);
    for (let i = 0; i < n; i++) {
      const cx = i * fmt.w * s + 18;
      ctx.fillStyle = "rgba(16,27,43,0.75)"; ctx.beginPath(); ctx.arc(cx, 18, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "600 12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(i + 1), cx, 18.5);
    }
  }, [img, n, fmt, px, py]); // eslint-disable-line react-hooks/exhaustive-deps

  async function slide(i: number): Promise<Blob | null> {
    if (!img) return null;
    const L = layout(img);
    const c = document.createElement("canvas");
    c.width = fmt.w; c.height = fmt.h;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, fmt.w, fmt.h);
    ctx.drawImage(img, L.ox - i * fmt.w, L.oy, L.dw, L.dh);
    return new Promise((r) => c.toBlob(r, "image/jpeg", 0.92));
  }
  function save(blob: Blob, file: string) {
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), { href: url, download: file }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function downloadOne(i: number) { const b = await slide(i); if (b) save(b, `${name}-slide-${i + 1}.jpg`); }
  async function downloadAll() {
    setBusy(true);
    const zip = new JSZip();
    for (let i = 0; i < n; i++) { const b = await slide(i); if (b) zip.file(`${name}-slide-${i + 1}.jpg`, b); }
    save(await zip.generateAsync({ type: "blob" }), `${name}-carousel.zip`);
    setBusy(false);
  }

  const lowRes = img && (img.height < fmt.h * 0.7 || img.width < n * fmt.w * 0.5);
  const chip = "rounded-full border px-3 py-1.5 text-xs font-medium transition";
  const on = "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-text)]";
  const off = "border-line hover:border-[var(--accent)]";

  return (
    <section aria-labelledby="cs-title">
      <p className="accent-text text-xs font-semibold tracking-[0.3em]">CAROUSEL SPLITTER</p>
      <h2 id="cs-title" className="mt-3 font-display text-2xl font-bold md:text-3xl">One wide image, a seamless swipe.</h2>
      <p className="mt-2 max-w-xl text-muted">Upload a panorama or wide design, choose how many slides, and download them ready for Instagram. Nothing is uploaded: it all happens in your browser.</p>

      <div className="mt-8 space-y-6">
        <label onDragOver={(e) => e.preventDefault()} onDrop={onDrop}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line p-8 text-center transition hover:border-[var(--accent)]">
          <ImagePlus size={24} className="accent-text" />
          <span className="font-medium">{img ? "Change image" : "Choose an image or drop it here"}</span>
          <span className="text-xs text-muted">JPG or PNG · wide images work best</span>
          <input type="file" accept="image/*" className="sr-only" onChange={onPick} />
        </label>

        <div className="flex flex-wrap items-end gap-6">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Slides: {n}</legend>
            <input type="range" min={2} max={10} value={n} onChange={(e) => setN(Number(e.target.value))} className="w-48 accent-[var(--accent)]" aria-label="Number of slides" />
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Format</legend>
            <div className="flex gap-2">
              {FORMATS.map((f) => <button key={f.key} type="button" onClick={() => setFmt(f)} aria-pressed={fmt.key === f.key} className={`${chip} ${fmt.key === f.key ? on : off}`}>{f.label}</button>)}
            </div>
          </fieldset>
          {img && (
            <>
              <fieldset>
                <legend className="mb-2 text-sm font-medium">Left ↔ right</legend>
                <input type="range" min={0} max={1} step={0.01} value={px} onChange={(e) => setPx(Number(e.target.value))} className="w-36 accent-[var(--accent)]" aria-label="Horizontal position" />
              </fieldset>
              <fieldset>
                <legend className="mb-2 text-sm font-medium">Top ↕ bottom</legend>
                <input type="range" min={0} max={1} step={0.01} value={py} onChange={(e) => setPy(Number(e.target.value))} className="w-36 accent-[var(--accent)]" aria-label="Vertical position" />
              </fieldset>
            </>
          )}
        </div>

        {img ? (
          <>
            <div className="overflow-hidden rounded-lg border border-line bg-surface">
              <canvas ref={preview} className="block w-full" aria-label={`Preview split into ${n} slides`} role="img" />
            </div>
            {lowRes && (
              <p className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <AlertTriangle size={16} /> Your image is smaller than the output size, so slides may look soft. A larger image gives sharper results.
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={downloadAll} disabled={busy}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-on)] hover:brightness-110 disabled:opacity-60">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Download all ({n} slides, ZIP)
              </button>
              {Array.from({ length: n }, (_, i) => (
                <button key={i} type="button" onClick={() => downloadOne(i)} className={`${chip} ${off}`}>Slide {i + 1}</button>
              ))}
            </div>
          </>
        ) : (
          <div className="accent-gradient grid aspect-[3/1] place-items-center rounded-lg text-sm font-medium text-white/90 opacity-80">Your carousel preview appears here</div>
        )}

        <p className="text-sm text-muted">
          Need carousels designed to stop the scroll and tell a story?{" "}
          <Link href="/design#estimate" className="accent-text inline-flex items-center gap-1 font-medium hover:underline">Price a carousel <ArrowUpRight size={14} /></Link>
        </p>
      </div>
    </section>
  );
}