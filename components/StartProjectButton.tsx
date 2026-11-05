"use client";
import type { ReactNode } from "react";

// Opens the "Start your project" panel from anywhere on the site
export function StartProjectButton({ className, children = "Start your project" }: { className?: string; children?: ReactNode }) {
  return (
    <button type="button" aria-haspopup="dialog" className={className}
      onClick={() => window.dispatchEvent(new Event("aso:start-project"))}>
      {children}
    </button>
  );
}