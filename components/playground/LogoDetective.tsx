"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Lightbulb, ArrowRight, RotateCcw, Play, Check, X, Trophy } from "lucide-react";

type LogoType = "Wordmark" | "Lettermark" | "Pictorial mark" | "Abstract mark" | "Emblem" | "Combination mark";

const TYPES: Record<LogoType, string> = {
  "Wordmark": "The full brand name, styled purely as typography.",
  "Lettermark": "Just initials or a few letters, with no other imagery.",
  "Pictorial mark": "A recognisable picture of a real object.",
  "Abstract mark": "A geometric form that expresses an idea rather than a real object.",
  "Emblem": "Text placed inside a badge, seal or crest.",
  "Combination mark": "A symbol paired with the brand name.",
};

const font = { fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" };

// 12 original practice marks for fictional brands
const MARKS: { answer: LogoType; clue: string; svg: ReactNode }[] = [
  { answer: "Wordmark", clue: "There’s no symbol, only a styled brand name.",
    svg: <text x="100" y="74" textAnchor="middle" fontSize="44" fontWeight="700" fill="#101B2B" style={font} letterSpacing="-1">nuvola</text> },
  { answer: "Wordmark", clue: "A complete word, carefully spaced.",
    svg: <text x="100" y="72" textAnchor="middle" fontSize="34" fontWeight="500" fill="#1177FF" style={font} letterSpacing="10">KORA</text> },
  { answer: "Lettermark", clue: "Count the letters. Is this a full name?",
    svg: <text x="100" y="84" textAnchor="middle" fontSize="70" fontWeight="700" fill="#1177FF" style={font} letterSpacing="-4">QV</text> },
  { answer: "Lettermark", clue: "Three initials, nothing else.",
    svg: <text x="100" y="80" textAnchor="middle" fontSize="58" fontWeight="800" fill="#101B2B" style={font} letterSpacing="-2">ndb</text> },
  { answer: "Pictorial mark", clue: "You can name the real object you see.",
    svg: <g><path d="M100 18 C148 28 158 88 100 102 C42 88 52 28 100 18 Z" fill="#21A9FF" /><path d="M100 30 V104" stroke="#101B2B" strokeWidth="3" strokeLinecap="round" /></g> },
  { answer: "Pictorial mark", clue: "A real-world scene, simplified.",
    svg: <g><polygon points="40,100 90,40 115,72 140,52 170,100" fill="#1177FF" /><circle cx="146" cy="32" r="10" fill="#9BD9FE" /></g> },
  { answer: "Abstract mark", clue: "Shapes that suggest an idea, not an object.",
    svg: <g><circle cx="84" cy="66" r="30" fill="#1177FF" opacity="0.85" /><circle cx="116" cy="66" r="30" fill="#48B7FF" opacity="0.85" /><circle cx="100" cy="40" r="30" fill="#9BD9FE" opacity="0.85" /></g> },
  { answer: "Abstract mark", clue: "Pure geometry, no words and no real object.",
    svg: <g><rect x="62" y="32" width="44" height="44" fill="#1177FF" transform="rotate(45 84 54)" /><rect x="94" y="44" width="44" height="44" fill="#6DC6FE" opacity="0.9" transform="rotate(45 116 66)" /></g> },
  { answer: "Emblem", clue: "Notice how the words sit inside a seal.",
    svg: <g><circle cx="100" cy="60" r="50" fill="none" stroke="#101B2B" strokeWidth="4" /><circle cx="100" cy="60" r="42" fill="none" stroke="#1177FF" strokeWidth="1.5" /><text x="100" y="62" textAnchor="middle" fontSize="15" fontWeight="700" fill="#101B2B" style={font}>OKO FARMS</text><text x="100" y="80" textAnchor="middle" fontSize="9" fontWeight="500" fill="#1177FF" style={font} letterSpacing="2">EST. 2024</text></g> },
  { answer: "Emblem", clue: "A crest with the name built inside it.",
    svg: <g><path d="M100 10 L150 26 V60 C150 86 128 102 100 112 C72 102 50 86 50 60 V26 Z" fill="#1177FF" /><text x="100" y="60" textAnchor="middle" fontSize="17" fontWeight="700" fill="#FFFFFF" style={font}>ISALE</text><text x="100" y="82" textAnchor="middle" fontSize="13" fontWeight="600" fill="#C4E8FC" style={font} letterSpacing="3">FC</text></g> },
  { answer: "Combination mark", clue: "There’s a symbol and a name side by side.",
    svg: <g><polygon points="22,86 50,36 78,86" fill="#1177FF" /><polygon points="44,86 62,56 80,86" fill="#9BD9FE" /><text x="92" y="76" fontSize="34" fontWeight="700" fill="#101B2B" style={font}>Peak</text></g> },
  { answer: "Combination mark", clue: "An icon working together with a word.",
    svg: <g><path d="M24 64 C36 48 48 48 60 64 S84 80 96 64" fill="none" stroke="#1D9BFF" strokeWidth="7" strokeLinecap="round" /><text x="104" y="76" fontSize="32" fontWeight="600" fill="#101B2B" style={font}>tidal</text></g> },
];

const LEVELS = {
  easy: { label: "Easy", options: 3, questions: 6, hints: true },
  medium: { label: "Medium", options: 4, questions: 8, hints: true },
  hard: { label: "Hard", options: 6, questions: 12, hints: false },
} as const;
type Level = keyof typeof LEVELS;
type Question = { mark: (typeof MARKS)[number]; options: LogoType[] };

function shuffle<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function LogoDetective() {
  const [level, setLevel] = useState<Level>("easy");
  const [status, setStatus] = useState<"idle" | "playing" | "done">("idle");
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<LogoType | null>(null);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState(false);
  const [best, setBest] = useState<Record<Level, number>>({ easy: 0, medium: 0, hard: 0 });
  const [newBest, setNewBest] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem("aso-logo-best"); if (raw) setBest(JSON.parse(raw)); } catch {}
  }, []);

  useEffect(() => {
    if (status !== "done") return;
    if (score > best[level]) {
      const next = { ...best, [level]: score };
      setBest(next);
      setNewBest(true);
      try { localStorage.setItem("aso-logo-best", JSON.stringify(next)); } catch {}
    } else setNewBest(false);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  function start() {
    const { questions, options } = LEVELS[level];
    const all = Object.keys(TYPES) as LogoType[];
    setQuiz(shuffle(MARKS).slice(0, questions).map((mark) => ({
      mark,
      options: shuffle([mark.answer, ...shuffle(all.filter((t) => t !== mark.answer)).slice(0, options - 1)]),
    })));
    setIndex(0); setPicked(null); setScore(0); setHint(false);
    setStatus("playing");
  }

  function answer(t: LogoType) {
    if (picked) return;
    setPicked(t);
    if (t === quiz[index].mark.answer) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= quiz.length) { setStatus("done"); return; }
    setIndex((i) => i + 1); setPicked(null); setHint(false);
  }

  const q = quiz[index];
  const primary = "inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-bright";
  const pct = quiz.length ? Math.round((score / quiz.length) * 100) : 0;

  return (
    <section aria-labelledby="ld-title" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="ld-title" className="font-display text-2xl font-bold">Logo Detective</h2>
          <p className="mt-1 text-sm text-muted">Study each original practice logo and name its type.</p>
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
          <div className="grid place-items-center gap-4 py-10 text-center">
            <p className="max-w-md text-sm text-muted">
              {LEVELS[level].questions} questions, {LEVELS[level].options} choices each{LEVELS[level].hints ? ", hints available" : ", no hints"}.
            </p>
            <p className="text-sm text-muted">Best ({LEVELS[level].label}): <strong className="text-fg">{best[level]}/{LEVELS[level].questions}</strong></p>
            <button onClick={start} className={primary}><Play size={16} /> Start quiz</button>
          </div>
        )}

        {status === "playing" && q && (
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-6">
              <div className="mb-3 flex justify-between text-sm font-medium">
                <span>Question {index + 1} of {quiz.length}</span><span>Score {score}</span>
              </div>
              <div className="grid aspect-[5/3] place-items-center rounded-sm bg-white p-6 ring-1 ring-line">
                <svg viewBox="0 0 200 120" className="h-full w-full" role="img" aria-label="Logo to identify">{q.mark.svg}</svg>
              </div>
              {LEVELS[level].hints && !picked && (
                <button onClick={() => setHint(true)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-royal hover:underline dark:text-light-azure">
                  <Lightbulb size={14} /> {hint ? q.mark.clue : "Show a hint"}
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2 md:col-span-6">
              {q.options.map((t) => {
                const isAnswer = t === q.mark.answer;
                const state = !picked ? "" : isAnswer ? "border-royal bg-royal text-white" : t === picked ? "border-line opacity-60 line-through" : "opacity-50";
                return (
                  <button key={t} onClick={() => answer(t)} disabled={!!picked}
                    className={`flex items-center justify-between rounded-sm border border-line bg-bg px-4 py-3 text-left text-sm font-medium transition enabled:hover:border-royal ${state}`}>
                    {t}
                    {picked && isAnswer && <Check size={16} />}
                    {picked && t === picked && !isAnswer && <X size={16} />}
                  </button>
                );
              })}

              {picked && (
                <div aria-live="polite" className="mt-2 rounded-sm border border-line bg-bg p-4 text-sm">
                  <p className="font-semibold">{picked === q.mark.answer ? "Correct!" : `It’s a ${q.mark.answer}.`}</p>
                  <p className="mt-1 text-muted">{TYPES[q.mark.answer]}</p>
                  <button onClick={next} className={`${primary} mt-4`}>
                    {index + 1 >= quiz.length ? "See results" : "Next"} <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {status === "done" && (
          <div className="grid place-items-center gap-3 py-10 text-center">
            <Trophy size={28} className="text-royal" />
            <p className="font-display text-4xl font-bold">{score}/{quiz.length}</p>
            <p className="text-sm text-muted">{pct}% correct</p>
            <p className="text-sm font-medium text-royal dark:text-light-azure">
              {newBest ? "New best score!" : `Best (${LEVELS[level].label}): ${best[level]}/${quiz.length}`}
            </p>
            <p className="text-sm font-medium">
              {pct === 100 ? "Perfect! You’re a true logo detective." : pct >= 70 ? "Great eye for branding." : "Good start. Play again to sharpen your eye."}
            </p>
            <button onClick={start} className={`${primary} mt-2`}><RotateCcw size={16} /> Play again</button>
          </div>
        )}
      </div>
    </section>
  );
}