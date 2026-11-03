"use client";
import { useEffect, useState } from "react";
import {
  PenTool, Palette, Type, Brush, Camera, Shapes, Layers,
  Image as ImageIcon, Ruler, Pipette, Frame, Sparkles, RotateCcw, Trophy, type LucideIcon,
} from "lucide-react";

const ICONS: { name: string; Icon: LucideIcon }[] = [
  { name: "Pen tool", Icon: PenTool }, { name: "Palette", Icon: Palette }, { name: "Type", Icon: Type },
  { name: "Brush", Icon: Brush }, { name: "Camera", Icon: Camera }, { name: "Shapes", Icon: Shapes },
  { name: "Layers", Icon: Layers }, { name: "Image", Icon: ImageIcon }, { name: "Ruler", Icon: Ruler },
  { name: "Colour picker", Icon: Pipette }, { name: "Frame", Icon: Frame }, { name: "Sparkles", Icon: Sparkles },
];

const SIZES = {
  small: { label: "3 × 4", pairs: 6, cols: "grid-cols-4" },
  medium: { label: "4 × 4", pairs: 8, cols: "grid-cols-4" },
  large: { label: "4 × 6", pairs: 12, cols: "grid-cols-4 sm:grid-cols-6" },
} as const;

type Size = keyof typeof SIZES;
type Card = { id: number; icon: number };
const BEST_KEY = "aso-memory-best";

function shuffle<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function DesignMemory() {
  const [size, setSize] = useState<Size>("small");
  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<Record<Size, number>>({ small: 0, medium: 0, large: 0 });
  const [newBest, setNewBest] = useState(false);

  const pairs = SIZES[size].pairs;
  const score = Math.max(0, pairs * 100 - Math.max(0, moves - pairs) * 10 - seconds * 2);

  function deal(s: Size = size) {
    const icons = shuffle(ICONS.map((_, i) => i)).slice(0, SIZES[s].pairs);
    setDeck(shuffle([...icons, ...icons]).map((icon, id) => ({ id, icon })));
    setFlipped([]); setMatched([]); setMoves(0); setSeconds(0);
    setRunning(false); setBusy(false); setDone(false); setNewBest(false);
  }

  useEffect(() => { deal(size); }, [size]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try { const raw = localStorage.getItem(BEST_KEY); if (raw) setBest(JSON.parse(raw)); } catch {}
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (!done) return;
    if (score > best[size]) {
      const next = { ...best, [size]: score };
      setBest(next);
      setNewBest(true);
      try { localStorage.setItem(BEST_KEY, JSON.stringify(next)); } catch {}
    } else setNewBest(false);
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  function flip(i: number) {
    if (busy || done || flipped.includes(i) || matched.includes(deck[i].icon)) return;
    if (!running) setRunning(true);
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = next;
    if (deck[a].icon === deck[b].icon) {
      const m = [...matched, deck[a].icon];
      setMatched(m);
      setFlipped([]);
      if (m.length === pairs) { setDone(true); setRunning(false); }
    } else {
      setBusy(true);
      setTimeout(() => { setFlipped([]); setBusy(false); }, 800);
    }
  }

  return (
    <section aria-labelledby="memory-title" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="memory-title" className="font-display text-2xl font-bold">Design Memory</h2>
          <p className="mt-1 text-sm text-muted">Flip two cards at a time and match every pair of design tools.</p>
        </div>
        <div role="group" aria-label="Grid size" className="flex gap-2">
          {(Object.keys(SIZES) as Size[]).map((s) => (
            <button key={s} onClick={() => setSize(s)} aria-pressed={size === s}
              className="rounded-full border border-line px-4 py-1.5 text-xs font-medium aria-pressed:border-royal aria-pressed:bg-royal aria-pressed:text-white">
              {SIZES[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
        <span>Moves: {moves}</span>
        <span>Time: {seconds}s</span>
        <span>Pairs: {matched.length}/{pairs}</span>
        <span className="text-royal dark:text-light-azure">Best: {best[size] || "—"}</span>
        <button onClick={() => deal()} className="ml-auto inline-flex items-center gap-1.5 text-royal hover:underline dark:text-light-azure">
          <RotateCcw size={14} /> Restart
        </button>
      </div>

      <div className={`mx-auto grid max-w-3xl gap-3 ${SIZES[size].cols}`}>
        {deck.map((card, i) => {
          const isMatched = matched.includes(card.icon);
          const shown = isMatched || flipped.includes(i);
          const { Icon, name } = ICONS[card.icon];
          return (
            <button key={card.id} onClick={() => flip(i)} aria-label={shown ? name : `Card ${i + 1}, face down`}
              className="relative aspect-square rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
              style={{ perspective: 600 }}>
              <span className="absolute inset-0 transition-transform duration-500"
                style={{ transformStyle: "preserve-3d", transform: shown ? "rotateY(180deg)" : "none" }}>
                <span className="absolute inset-0 rounded-sm aso-gradient" style={{ backfaceVisibility: "hidden" }} />
                <span className={`absolute inset-0 grid place-items-center rounded-sm border bg-bg ${isMatched ? "border-royal" : "border-line"}`}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <Icon size={28} className={isMatched ? "text-royal" : "text-fg"} />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">{done ? `Completed in ${moves} moves and ${seconds} seconds` : ""}</p>

      {done && (
        <div className="grid place-items-center gap-2 rounded-sm border border-line bg-surface py-8 text-center">
          <Trophy size={28} className="text-royal" />
          <p className="font-display text-3xl font-bold">{score}</p>
          <p className="text-sm text-muted">Completed in {moves} moves and {seconds}s</p>
          <p className="text-sm font-medium">{newBest ? "New best score!" : `Best (${SIZES[size].label}): ${best[size]}`}</p>
          <button onClick={() => deal()} className="mt-2 inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-bright">
            <RotateCcw size={16} /> Play again
          </button>
        </div>
      )}
    </section>
  );
}