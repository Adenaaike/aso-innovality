"use client";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Loader2, Shuffle, Sparkles } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";
import type { WallEntry } from "@/lib/wall";

const SUGGESTED = ["#1177FF", "#21A9FF", "#00A699", "#3B7A52", "#F2A900", "#E0A526", "#FF5A5F", "#E5484D", "#7B3FE4", "#101B2B"];
const todayKey = () => new Date().toISOString().slice(0, 10);
const randomHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0").toUpperCase()}`;

function when(iso: string) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const steps: [number, Intl.RelativeTimeFormatUnit][] = [[60, "second"], [3600, "minute"], [86400, "hour"], [604800, "day"], [2629800, "week"], [31557600, "month"]];
  for (let i = steps.length - 1; i >= 0; i--) {
    const [secs, unit] = steps[i];
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), (["second", "minute", "hour", "day", "week", "month", "year"] as const)[i + 1] ?? unit);
  }
  return "just now";
}

function Tile({ e, fresh }: { e: WallEntry; fresh?: boolean }) {
  return (
    <div tabIndex={0} aria-label={`${e.color}${e.label ? `, ${e.label}` : ""}`} className="group relative aspect-square outline-none">
      <div className={`size-full rounded-md border border-black/5 transition duration-300 group-hover:scale-110 group-hover:shadow-lg group-focus:scale-110 ${fresh ? "animate-pulse ring-2 ring-royal ring-offset-2 ring-offset-bg" : ""}`}
        style={{ background: e.color }} />
      <div role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-navy px-2.5 py-1.5 text-[11px] text-white shadow-lg group-hover:block group-focus:block">
        <span className="font-semibold">{e.color}</span>{e.label ? ` · ${e.label}` : ""} · {when(e.created_at)}
      </div>
    </div>
  );
}

export function IdeaWall({ initial, total, variant = "full" }: { initial: WallEntry[]; total: number; variant?: "full" | "strip" }) {
  const [entries, setEntries] = useState<WallEntry[]>(initial);
  const [count, setCount] = useState(total);
  const [color, setColor] = useState("#1177FF");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [freshId, setFreshId] = useState<string | null>(null);
  const [addedToday, setAddedToday] = useState(false);

  useEffect(() => { try { setAddedToday(localStorage.getItem("aso-wall-day") === todayKey()); } catch {} }, []);

  // Live: new colours appear for everyone watching
  useEffect(() => {
    const sb = browserClient();
    const channel = sb.channel("idea-wall")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "idea_wall" }, (payload) => {
        const e = payload.new as WallEntry & { published?: boolean };
        if (e.published === false) return;
        setEntries((list) => (list.some((x) => x.id === e.id) ? list : [e, ...list]));
        setCount((c) => c + 1);
      })
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, []);

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    setBusy(true); setMsg(null);
    try {
      const res = await fetch("/api/wall", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ color, label }) });
      const json = await res.json();
      if (!res.ok) { setMsg({ ok: false, text: json.error ?? "Something went wrong." }); return; }
      const e = json.entry as WallEntry;
      setEntries((list) => (list.some((x) => x.id === e.id) ? list : [e, ...list]));
      setCount((c) => c + 1);
      setFreshId(e.id); setTimeout(() => setFreshId(null), 4000);
      setLabel("");
      try { localStorage.setItem("aso-wall-day", todayKey()); } catch {}
      setAddedToday(true);
      setMsg({ ok: true, text: "Your colour is on the wall. Thank you! ✨" });
    } catch { setMsg({ ok: false, text: "Couldn’t connect. Please try again." }); }
    finally { setBusy(false); }
  }

  if (variant === "strip") {
    return (
      <section className="mx-auto max-w-6xl px-6 py-16" aria-labelledby="wall-strip-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">THE IDEA WALL</p>
            <h2 id="wall-strip-title" className="mt-2 font-display text-2xl font-bold md:text-3xl">
              A living palette, <span className="aso-text-gradient">made by visitors.</span>
            </h2>
            <p className="mt-1 text-sm text-muted">{count.toLocaleString()} {count === 1 ? "colour" : "colours"} added so far.</p>
          </div>
          <Link href="/wall" className="inline-flex items-center gap-2 rounded-full bg-royal px-5 py-2.5 text-sm font-medium text-white hover:bg-bright">
            Add your colour <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="mt-6 overflow-hidden [mask-image:linear-gradient(90deg,#000_80%,transparent)]">
          {entries.length ? (
            <div className="flex gap-2">
              {entries.slice(0, 48).map((e) => <div key={e.id} className="w-10 shrink-0 md:w-12"><Tile e={e} /></div>)}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-muted">The wall is waiting for its first colour. <Link href="/wall" className="text-royal hover:underline dark:text-light-azure">Be the first →</Link></p>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <form onSubmit={submit} className="space-y-5 rounded-lg border border-line bg-bg p-6 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
        <p className="font-display text-lg font-bold">Add your colour</p>
        <div className="flex items-center gap-4">
          <label className="relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-line" style={{ background: color }}>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value.toUpperCase())} className="absolute inset-0 size-full cursor-pointer opacity-0" aria-label="Pick a colour" />
          </label>
          <div className="text-sm">
            <p className="font-display text-xl font-bold">{color}</p>
            <button type="button" onClick={() => setColor(randomHex())} className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-royal hover:underline dark:text-light-azure">
              <Shuffle size={12} /> Surprise me
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED.map((c) => (
            <button key={c} type="button" onClick={() => setColor(c)} aria-label={c} title={c}
              className={`size-7 rounded-full border-2 transition ${color === c ? "scale-110 border-royal" : "border-line"}`} style={{ background: c }} />
          ))}
        </div>
        <div>
          <label htmlFor="wall-label" className="mb-1 block text-sm font-medium">Your first name or one word <span className="text-muted">(optional)</span></label>
          <input id="wall-label" value={label} maxLength={20} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Tolu or “calm”"
            className="w-full rounded-sm border border-line bg-bg p-3 text-sm focus:border-royal focus:outline-none" />
        </div>
        <button type="submit" disabled={busy || addedToday}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-bright disabled:opacity-60">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {addedToday ? "Added today, come back tomorrow" : "Add to the wall"}
        </button>
        {msg && <p role={msg.ok ? "status" : "alert"} className={`text-sm ${msg.ok ? "text-royal dark:text-light-azure" : "text-red-600 dark:text-red-400"}`}>{msg.text}</p>}
        <p className="text-xs text-muted">One colour per visitor per day. Your colour and word are public, so please keep them friendly. <a href="/privacy" className="underline hover:text-royal">Privacy</a></p>
      </form>

      <div className="lg:col-span-8">
        <p className="mb-4 text-sm text-muted"><strong className="text-fg">{count.toLocaleString()}</strong> {count === 1 ? "colour" : "colours"} and counting · newest first</p>
        {entries.length ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-2">
            {entries.map((e) => <Tile key={e.id} e={e} fresh={e.id === freshId} />)}
          </div>
        ) : (
          <div className="grid aspect-[2/1] place-items-center rounded-lg border border-dashed border-line text-center text-sm text-muted">
            Be the first colour on the wall.
          </div>
        )}
      </div>
    </div>
  );
}