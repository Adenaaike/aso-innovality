"use client";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";

export type Field = {
  key: string; label: string; type: "text" | "textarea" | "lines" | "checkbox" | "select" | "number";
  placeholder?: string; required?: boolean; hint?: string; options?: { value: string; label: string }[];
};
export type Row = { id: string; sort_order: number; published: boolean; [k: string]: unknown };
type FormState = Record<string, string | boolean>;

export function CollectionEditor({ table, title, hint, fields, summary, filter, onRows }: {
  table: string; title: string; hint?: string; fields: Field[]; summary: (r: Row) => string;
  filter?: { column: string; value: string }; // only show/insert rows matching this column
  onRows?: (rows: Row[]) => void;            // tells the parent page the current rows
}) {
  const sb = browserClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<FormState | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function load() {
    let q = sb.from(table).select("*");
    if (filter) q = q.eq(filter.column, filter.value);
    const { data, error } = await q.order("sort_order").order("created_at");
    if (error) { setMsg({ ok: false, text: `Couldn’t load ${title.toLowerCase()}. Did you run the SQL?` }); return; }
    const list = (data ?? []) as Row[];
    setRows(list);
    onRows?.(list);
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toForm(r?: Row): FormState {
    const f: FormState = {};
    for (const fl of fields) {
      const v = r?.[fl.key];
      if (fl.type === "checkbox") f[fl.key] = Boolean(v);
      else if (fl.type === "lines") f[fl.key] = Array.isArray(v) ? (v as string[]).join("\n") : "";
      else if (fl.type === "number") f[fl.key] = v === null || v === undefined ? "" : String(v);
      else if (fl.type === "select") f[fl.key] = typeof v === "string" ? v : fl.options?.[0]?.value ?? "";
      else f[fl.key] = typeof v === "string" ? v : "";
    }
    return f;
  }

  async function save() {
    if (!form) return;
    for (const fl of fields) {
      const raw = String(form[fl.key] ?? "").trim();
      if (fl.required && !raw) return setMsg({ ok: false, text: `Please fill in “${fl.label}”.` });
      if (fl.type === "number" && raw && Number.isNaN(Number(raw))) return setMsg({ ok: false, text: `“${fl.label}” must be a number.` });
    }
    const payload: Record<string, unknown> = {};
    for (const fl of fields) {
      const v = form[fl.key];
      if (fl.type === "checkbox") payload[fl.key] = Boolean(v);
      else if (fl.type === "lines") payload[fl.key] = String(v).split("\n").map((s) => s.trim()).filter(Boolean);
      else if (fl.type === "number") payload[fl.key] = String(v).trim() === "" ? null : Number(v);
      else if (fl.type === "select") payload[fl.key] = String(v);
      else payload[fl.key] = String(v).trim() || null;
    }
    setBusy(true);
    const res = editId
      ? await sb.from(table).update(payload).eq("id", editId)
      : await sb.from(table).insert({ ...payload, ...(filter ? { [filter.column]: filter.value } : {}), sort_order: rows.length, published: true });
    setBusy(false);
    if (res.error) return setMsg({ ok: false, text: res.error.message });
    setForm(null); setEditId(null); setMsg({ ok: true, text: "Saved." });
    load();
  }

  async function remove(r: Row) {
    if (!confirm(`Delete “${summary(r)}”?`)) return;
    const { error } = await sb.from(table).delete().eq("id", r.id);
    if (error) return setMsg({ ok: false, text: "Couldn’t delete. Please try again." });
    load();
  }

  async function togglePublished(r: Row) {
    const { error } = await sb.from(table).update({ published: !r.published }).eq("id", r.id);
    if (error) return setMsg({ ok: false, text: "Couldn’t update. Please try again." });
    load();
  }

  async function move(i: number, d: -1 | 1) {
    const j = i + d;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    await Promise.all(next.map((r, pos) => (r.sort_order !== pos ? sb.from(table).update({ sort_order: pos }).eq("id", r.id) : null)));
    load();
  }

  const input = "w-full rounded-sm border border-line bg-bg p-3 text-sm focus:border-royal focus:outline-none";
  const icon = "grid size-8 place-items-center rounded-full text-muted hover:text-royal disabled:opacity-30";

  return (
    <section className="space-y-4 rounded-sm border border-line p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold">{title}</h2>
          {hint && <p className="mt-1 max-w-xl text-sm text-muted">{hint}</p>}
        </div>
        {!form && (
          <button onClick={() => { setEditId(null); setForm(toForm()); setMsg(null); }}
            className="inline-flex items-center gap-2 rounded-full bg-royal px-4 py-2 text-sm font-medium text-white hover:bg-bright">
            <Plus size={16} /> Add
          </button>
        )}
      </div>

      {msg && <p role={msg.ok ? "status" : "alert"} className={`text-sm ${msg.ok ? "text-royal dark:text-light-azure" : "text-red-600 dark:text-red-400"}`}>{msg.text}</p>}

      {form && (
        <div className="space-y-4 rounded-sm bg-surface p-5">
          {fields.map((fl) => {
            const id = `${table}-${fl.key}`;
            return (
              <div key={fl.key}>
                {fl.type === "checkbox" ? (
                  <label className="flex items-center gap-3 text-sm font-medium">
                    <input type="checkbox" checked={Boolean(form[fl.key])} onChange={(e) => setForm({ ...form, [fl.key]: e.target.checked })} className="size-4 accent-royal" />
                    {fl.label}
                  </label>
                ) : (
                  <>
                    <label htmlFor={id} className="mb-1 block text-sm font-medium">{fl.label}{fl.required && " *"}</label>
                    {fl.type === "select" ? (
                      <select id={id} value={String(form[fl.key])} className={input} onChange={(e) => setForm({ ...form, [fl.key]: e.target.value })}>
                        {fl.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : fl.type === "number" ? (
                      <input id={id} type="number" min={0} step="any" value={String(form[fl.key])} placeholder={fl.placeholder} className={input}
                        onChange={(e) => setForm({ ...form, [fl.key]: e.target.value })} />
                    ) : fl.type === "text" ? (
                      <input id={id} value={String(form[fl.key])} placeholder={fl.placeholder} className={input}
                        onChange={(e) => setForm({ ...form, [fl.key]: e.target.value })} />
                    ) : (
                      <textarea id={id} rows={fl.type === "lines" ? 5 : 4} value={String(form[fl.key])} placeholder={fl.placeholder} className={input}
                        onChange={(e) => setForm({ ...form, [fl.key]: e.target.value })} />
                    )}
                  </>
                )}
                {fl.hint && <p className="mt-1 text-xs text-muted">{fl.hint}</p>}
              </div>
            );
          })}
          <div className="flex gap-2">
            <button onClick={save} disabled={busy} className="rounded-full bg-royal px-6 py-2.5 text-sm font-medium text-white hover:bg-bright disabled:opacity-60">
              {busy ? "Saving…" : editId ? "Save changes" : "Add"}
            </button>
            <button onClick={() => { setForm(null); setEditId(null); }} className="rounded-full border border-line px-6 py-2.5 text-sm font-medium hover:border-royal">Cancel</button>
          </div>
        </div>
      )}

      {rows.length === 0 && !form && <p className="rounded-sm border border-dashed border-line p-6 text-center text-sm text-muted">Nothing here yet. This section stays hidden on the site until you add something.</p>}

      <ul className="divide-y divide-line">
        {rows.map((r, i) => (
          <li key={r.id} className="flex items-center gap-3 py-3">
            <p className={`min-w-0 flex-1 truncate text-sm ${r.published ? "" : "text-muted line-through"}`}>{summary(r)}</p>
            <button onClick={() => togglePublished(r)} aria-label={r.published ? "Hide" : "Publish"} title={r.published ? "Visible on site (click to hide)" : "Hidden (click to publish)"} className={icon}>
              {r.published ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
            <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className={icon}><ArrowUp size={15} /></button>
            <button onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Move down" className={icon}><ArrowDown size={15} /></button>
            <button onClick={() => { setEditId(r.id); setForm(toForm(r)); setMsg(null); }} aria-label="Edit" className={icon}><Pencil size={15} /></button>
            <button onClick={() => remove(r)} aria-label="Delete" className={`${icon} hover:text-red-600`}><Trash2 size={15} /></button>
          </li>
        ))}
      </ul>
    </section>
  );
}