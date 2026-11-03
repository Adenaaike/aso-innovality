"use client";
import { useEffect, useState } from "react";
import { Play, RotateCcw, Timer, Trophy } from "lucide-react";

type Level = "easy" | "medium" | "hard";
type Round = { target: string; choices: string[] };

const LEVELS: Record<Level, { label: string; options: number; delta: number }> = {
  easy: { label: "Easy", options: 4, delta: 40 },
  medium: { label: "Medium", options: 6, delta: 18 },
  hard: { label: "Hard", options: 8, delta: 8 },
};
const DURATION = 30;
const BEST_KEY = "aso-colour-match-best";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const hsl = (h: number, s: number, l: number) =>
  `hsl(${Math.round(((h % 360) + 360) % 360)} ${Math.round(s)}% ${Math.round(l)}%)`;

function makeRound(level: Level): Round {
  const { options, delta } = LEVELS[level];
  const h = Math.random() * 360, s = 55 + Math.random() * 35, l = 40 + Math.random() * 25;
  const target = hsl(h, s, l);
  const set = new Set([target]);
  const sign = () => (Math.random() < 0.5 ? -1 : 1);
  for (let i = 0; set.size < options && i < 200; i++) {
    set.add(hsl(
      h + sign() * delta * (0.5 + Math.random()),
      clamp(s + sign() * (delta / 3) * Math.random(), 20, 100),
      clamp(l + sign() * (delta / 3) * (0.5 + Math.random()), 15, 85),
    ));
  }
  return { target, choices: [...set].sort(() => Math.random() - 0.5) };
}

export function ColourMatch() {
  const [level, setLevel] = useState<Level>("easy");
  const [status, setStatus] = useState<"idle" | "playing" | "done">("idle");
  const [round, setRound] = useState<Round | null>(null);
  const [time, setTime] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<"right" | "wrong" | null>(null);
  const [best, setBest] = useState<Record<Level, number>>({ easy: 0, medium: 0, hard: 0 });

  useEffect(() => {
    try { const raw = localStorage.getItem(BEST_KEY); if (raw) setBest(JSON.parse(raw)); } catch {}
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    const t = setInterval(() => setTime((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  useEffect(() => {
    if (status === "playing" && time <= 0) setStatus("done");
  }, [time, status]);

  useEffect(() => {
    if (status !== "done") return;
    setBest((prev) => {
      if (score <= prev[level]) return prev;
      const next = { ...prev, [level]: score };
      try { localStorage.setItem(BEST_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [status, score, level]);

  function start() {
    setScore(0); setAnswered(0); setCorrect(0); setFeedback(null);
    setTime(DURATION);
    setRound(makeRound(level));
    setStatus("playing");
  }

  function choose(colour: string) {
    if (status !== "playing" || !round) return;
    const ok = colour === round.target;
    setAnswered((n) => n + 1);
    if (ok) { setCorrect((n) => n + 1); setScore((s) => s + 10); }
    else setScore((s) => Math.max(0, s - 3));
    setFeedback(ok ? "right" : "wrong");
    setTimeout(() => setFeedback(null), 500);
    setRound(makeRound(level));
  }

  const primary = "inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-bright";

  return (
    <section aria-labelledby="cm-title" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="cm-title" className="font-display text-2xl font-bold">Colour Match</h2>
          <p className="mt-1 text-sm text-muted">Find the swatch that exactly matches the target. You have {DURATION} seconds.</p>
        </div>
        <div role="group" aria-label="Difficulty" className="flex gap-2">
          {(Object.keys(LEVELS) as Level[]).map((l) => (
            <button key={l} onClick={() => setLevel(l)} disabled={status === "playing"} aria-pressed={level === l}
              className="rounded-full border border-line px-4 py-1.5 text-xs font-medium aria-pressed:border-royal aria-pressed:bg-royal aria-pressed:text-white disabled:opacity-50">
              {LEVELS[l].label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-sm border border-line bg-surface p-6 md:p-8">
        {status === "idle" && (
          <div className="grid place-items-center gap-4 py-12 text-center">
            <p className="text-sm text-muted">Best score ({LEVELS[level].label}): <strong className="text-fg">{best[level]}</strong></p>
            <button onClick={start} className={primary}><Play size={16} /> Start game</button>
          </div>
        )}

        {status === "playing" && round && (
          <div className="grid gap-6 md:grid-cols-12 md:items-start">
            <div className="md:col-span-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="inline-flex items-center gap-1"><Timer size={16} /> {time}s</span>
                <span>Score {score}</span>
              </div>
              <div role="img" aria-label="Target colour" className="mt-3 aspect-square rounded-sm" style={{ background: round.target }} />
              <p aria-live="polite" className="mt-3 h-5 text-sm font-medium">
                {feedback === "right" ? "Correct! +10" : feedback === "wrong" ? "Not quite, −3" : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:col-span-8">
              {round.choices.map((c, i) => (
                <button key={c} onClick={() => choose(c)} aria-label={`Option ${i + 1}`}
                  className="aspect-square rounded-sm ring-royal ring-offset-2 ring-offset-surface transition hover:scale-[1.03] focus-visible:ring-2"
                  style={{ background: c }} />
              ))}
            </div>
          </div>
        )}

        {status === "done" && (
          <div className="grid place-items-center gap-3 py-10 text-center">
            <Trophy size={28} className="text-royal" />
            <p className="font-display text-4xl font-bold">{score}</p>
            <p className="text-sm text-muted">
              {correct} correct out of {answered} · {answered ? Math.round((correct / answered) * 100) : 0}% accuracy
            </p>
            <p className="text-sm font-medium">
              {score > 0 && score >= best[level] ? "New best score!" : `Best (${LEVELS[level].label}): ${best[level]}`}
            </p>
            <button onClick={start} className={`${primary} mt-2`}><RotateCcw size={16} /> Play again</button>
          </div>
        )}
      </div>
    </section>
  );
}