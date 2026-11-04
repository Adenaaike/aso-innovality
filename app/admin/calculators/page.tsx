"use client";
import { useState } from "react";
import { CollectionEditor, type Field, type Row } from "@/components/admin/CollectionEditor";
import { CALCULATORS, type CalcKey } from "@/lib/calculators";

const KINDS = [
  { value: "single", label: "Pick one (e.g. a package)" },
  { value: "multi", label: "Pick any (e.g. extras)" },
  { value: "quantity", label: "Choose quantities (e.g. posters)" },
];
const BILLING = [
  { value: "one_off", label: "One-off project" },
  { value: "monthly", label: "Monthly" },
];

const stepFields: Field[] = [
  { key: "title", label: "Step title", type: "text", required: true, placeholder: "e.g. Choose your website" },
  { key: "kind", label: "How visitors choose", type: "select", options: KINDS, required: true },
  { key: "none_label", label: "“None” choice (pick-one steps only, optional)", type: "text", placeholder: "e.g. No SEO for now",
    hint: "Adds a free first choice so the step can be skipped." },
  { key: "none_note", label: "Note under the “None” choice (optional)", type: "text", placeholder: "e.g. Basic on-page SEO is included in every build" },
];

const optionFields: Field[] = [
  { key: "name", label: "Option name", type: "text", required: true, placeholder: "e.g. Business Website" },
  { key: "description", label: "Short description", type: "text", placeholder: "e.g. Up to 10 pages with basic SEO" },
  { key: "price_usd", label: "Price in USD", type: "number", placeholder: "Leave empty for “On request”",
    hint: "Leave empty to show “On request” (excluded from the total)." },
  { key: "billing", label: "Billing", type: "select", options: BILLING, required: true,
    hint: "Monthly options only show when visitors switch the calculator to Monthly." },
  { key: "unit", label: "Unit (quantity steps only)", type: "text", placeholder: "e.g. per poster" },
  { key: "features", label: "What’s included (optional)", type: "lines", placeholder: "One item per line",
    hint: "Shown when this option is selected." },
];

const kindLabel = (v: unknown) => KINDS.find((k) => k.value === v)?.label.split(" (")[0] ?? String(v);

export default function AdminCalculators() {
  const [calc, setCalc] = useState<CalcKey>("design");
  const [steps, setSteps] = useState<Row[]>([]);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Calculators</h1>
        <p className="mt-2 text-sm text-muted">
          Build each calculator: add <strong>steps</strong> first, then the <strong>options</strong> inside each step. Prices are in USD; the ₦ rate is in Settings.
        </p>
      </div>

      <div role="tablist" aria-label="Calculator" className="flex flex-wrap gap-2">
        {CALCULATORS.map((c) => (
          <button key={c.key} role="tab" aria-selected={calc === c.key} onClick={() => { setCalc(c.key); setSteps([]); }}
            className="rounded-full border border-line px-5 py-2 text-sm font-medium transition hover:border-royal aria-selected:border-royal aria-selected:bg-royal aria-selected:text-white">
            {c.label}
          </button>
        ))}
      </div>

      <CollectionEditor key={`steps-${calc}`} table="calc_steps" title="Steps"
        hint="Steps appear on the calculator in this order. A step only shows once it has published options."
        fields={stepFields} filter={{ column: "calculator", value: calc }} onRows={setSteps}
        summary={(r) => `${r.title} · ${kindLabel(r.kind)}${r.none_label ? ` · “${r.none_label}”` : ""}`} />

      {steps.map((s) => (
        <CollectionEditor key={s.id} table="calc_options" title={`Options: ${String(s.title)}`}
          fields={optionFields} filter={{ column: "step_id", value: s.id }}
          summary={(r) => `${r.name} · ${r.price_usd === null || r.price_usd === undefined ? "On request" : `$${r.price_usd}`}${r.billing === "monthly" ? " / month" : ""}`} />
      ))}
    </div>
  );
}