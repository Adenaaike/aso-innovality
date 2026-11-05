"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Plus, Trash2 } from "lucide-react";

type Task = { id: number; name: string; minutes: number; perWeek: number };

const EXAMPLES: Omit<Task, "id">[] = [
  { name: "Replying to enquiries and FAQs", minutes: 5, perWeek: 40 },
  { name: "Copying form entries into a spreadsheet", minutes: 4, perWeek: 25 },
  { name: "Sending follow-up and reminder messages", minutes: 3, perWeek: 30 },
  { name: "Preparing weekly reports", minutes: 90, perWeek: 1 },
];

export function TimeSavedCalculator() {
  const [tasks, setTasks] = useState<Task[]>(EXAMPLES.map((t, i) => ({ ...t, id: i })));
  const [rate, setRate] = useState(5);
  const [cur, setCur] = useState<"$" | "₦">("$");
  const [eff, setEff] = useState(70);

  const update = (id: number, patch: Partial<Task>) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const add = () => setTasks((ts) => [...ts, { id: Date.now(), name: "", minutes: 10, perWeek: 5 }]);
  const remove = (id: number) => setTasks((ts) => ts.filter((t) => t.id !== id));

  const weeklyMinutes = tasks.reduce((a, t) => a + (t.minutes || 0) * (t.perWeek || 0), 0);
  const weeklySaved = (weeklyMinutes / 60) * (eff / 100);
  const yearlySaved = weeklySaved * 52;
  const money = yearlySaved * (rate || 0);
  const workDays = yearlySaved / 8;

  const num = (n: number, d = 0) => n.toLocaleString("en-NG", { maximumFractionDigits: d, minimumFractionDigits: d });
  const field = "w-full rounded-sm border border-line bg-bg p-2.5 text-sm focus:border-[var(--accent)] focus:outline-none";

  return (
    <section aria-labelledby="time-title">
      <p className="accent-text text-xs font-semibold tracking-[0.3em]">TIME-SAVED CALCULATOR</p>
      <h2 id="time-title" className="mt-3 font-display text-2xl font-bold md:text-3xl">How much time could automation give you back?</h2>
      <p className="mt-2 max-w-xl text-muted">List the repetitive tasks your team does every week. The examples below are a starting point, so edit them to match your business.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-7">
          <div className="hidden grid-cols-12 gap-3 px-1 text-xs font-medium text-muted sm:grid">
            <span className="col-span-6">Task</span><span className="col-span-2">Minutes each</span><span className="col-span-3">Times per week</span>
          </div>
          {tasks.map((t) => (
            <div key={t.id} className="grid grid-cols-12 items-center gap-3 rounded-lg border border-line p-3">
              <input aria-label="Task" value={t.name} placeholder="e.g. Sending invoices" onChange={(e) => update(t.id, { name: e.target.value })} className={`${field} col-span-12 sm:col-span-6`} />
              <input aria-label="Minutes each time" type="number" min={0} value={t.minutes} onChange={(e) => update(t.id, { minutes: Number(e.target.value) })} className={`${field} col-span-5 sm:col-span-2`} />
              <input aria-label="Times per week" type="number" min={0} value={t.perWeek} onChange={(e) => update(t.id, { perWeek: Number(e.target.value) })} className={`${field} col-span-5 sm:col-span-3`} />
              <button type="button" onClick={() => remove(t.id)} aria-label="Remove task" className="col-span-2 grid size-9 place-items-center justify-self-end rounded-full text-muted hover:text-red-600 sm:col-span-1">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-[var(--accent)]">
            <Plus size={15} /> Add a task
          </button>

          <div className="grid gap-4 pt-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rate" className="mb-1 block text-sm font-medium">What is one hour of your team’s time worth?</label>
              <div className="flex gap-2">
                <select aria-label="Currency" value={cur} onChange={(e) => setCur(e.target.value as "$" | "₦")} className={`${field} w-20`}>
                  <option>$</option><option>₦</option>
                </select>
                <input id="rate" type="number" min={0} value={rate} onChange={(e) => setRate(Number(e.target.value))} className={field} />
              </div>
            </div>
            <div>
              <label htmlFor="eff" className="mb-1 block text-sm font-medium">Share of the work automation handles: {eff}%</label>
              <input id="eff" type="range" min={30} max={95} step={5} value={eff} onChange={(e) => setEff(Number(e.target.value))} className="mt-3 w-full accent-[var(--accent)]" />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="space-y-6 rounded-lg bg-navy p-7 text-white lg:sticky lg:top-24">
            <p className="text-xs font-semibold tracking-[0.25em] text-[var(--accent)]">YOUR POTENTIAL SAVINGS</p>
            <div>
              <p className="accent-text-gradient font-display text-5xl font-bold">{num(yearlySaved)} hrs</p>
              <p className="mt-1 text-sm text-ice/70">saved per year · about {num(weeklySaved, 1)} hours a week</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-5">
              <div><p className="font-display text-2xl font-bold">{cur}{num(money)}</p><p className="text-xs text-ice/70">worth of time per year</p></div>
              <div><p className="font-display text-2xl font-bold">{num(workDays)}</p><p className="text-xs text-ice/70">working days freed up</p></div>
            </div>
            <p className="text-xs leading-relaxed text-ice/60">An estimate based on your inputs. Real savings depend on your tools and processes.</p>
            <Link href="/ai#estimate" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--accent-on)] transition hover:brightness-110">
              Price an automation <ArrowUpRight size={16} />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}