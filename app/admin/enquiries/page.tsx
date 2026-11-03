"use client";
import { useEffect, useState } from "react";
import { Mail, RefreshCw } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";

type Enquiry = {
  id: string; full_name: string; email: string; company: string | null; project_type: string;
  budget: string | null; description: string; status: string; created_at: string;
};
const STATUSES = ["new", "read", "replied", "archived"] as const;
const FILTERS = ["active", "all", ...STATUSES] as const;
type Filter = (typeof FILTERS)[number];

export default function AdminEnquiries() {
  const sb = browserClient();
  const [items, setItems] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState<Filter>("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    const { data, error } = await sb.from("enquiries").select("*").order("created_at", { ascending: false });
    if (error) setError("Couldn’t load enquiries. Try refreshing.");
    else setItems(data as Enquiry[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function setStatus(id: string, status: string) {
    const before = items;
    setItems((list) => list.map((e) => (e.id === id ? { ...e, status } : e)));
    const { error } = await sb.from("enquiries").update({ status }).eq("id", id);
    if (error) { setItems(before); setError("Couldn’t update the status. Please try again."); }
  }

  const shown = items.filter((e) => filter === "all" ? true : filter === "active" ? e.status !== "archived" : e.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Enquiries</h1>
        <button onClick={load} className="inline-flex items-center gap-1.5 text-sm font-medium text-royal hover:underline dark:text-light-azure">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div role="group" aria-label="Filter" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
            className="rounded-full border border-line px-4 py-1.5 text-xs font-medium capitalize aria-pressed:border-royal aria-pressed:bg-royal aria-pressed:text-white">
            {f} ({f === "all" ? items.length : f === "active" ? items.filter((e) => e.status !== "archived").length : items.filter((e) => e.status === f).length})
          </button>
        ))}
      </div>

      {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {loading && <p className="text-sm text-muted">Loading…</p>}
      {!loading && shown.length === 0 && <p className="rounded-sm border border-dashed border-line p-8 text-center text-sm text-muted">No enquiries here yet.</p>}

      <ul className="space-y-4">
        {shown.map((e) => (
          <li key={e.id} className={`rounded-sm border bg-surface p-6 ${e.status === "new" ? "border-royal" : "border-line"}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg font-semibold">{e.full_name}{e.company ? <span className="font-normal text-muted"> · {e.company}</span> : null}</p>
                <p className="mt-1 text-sm text-muted">
                  {e.project_type}{e.budget ? ` · ${e.budget}` : ""} · {new Date(e.created_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor={`st-${e.id}`} className="sr-only">Status</label>
                <select id={`st-${e.id}`} value={e.status} onChange={(ev) => setStatus(e.id, ev.target.value)}
                  className="rounded-full border border-line bg-bg px-3 py-1.5 text-xs font-medium capitalize">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <a href={`mailto:${e.email}?subject=${encodeURIComponent(`Re: your ${e.project_type} enquiry`)}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-royal px-4 py-1.5 text-xs font-medium text-white hover:bg-bright">
                  <Mail size={14} /> Reply
                </a>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{e.description}</p>
            <p className="mt-3 text-xs text-muted">{e.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}