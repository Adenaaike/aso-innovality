"use client";
import type { ReactNode } from "react";

// Opens the Remix panel from anywhere on the site
export function RemixButton({ className, children = "Remix this site" }: { className?: string; children?: ReactNode }) {
  return (
    <button type="button" aria-haspopup="dialog" className={className}
      onClick={() => window.dispatchEvent(new Event("aso:remix-open"))}>
      {children}
    </button>
  );
}