"use client";
import dynamic from "next/dynamic";

// Interactive extras, loaded just after the page is ready so they don't slow the first view
const StartProjectPanel = dynamic(() => import("@/components/StartProjectPanel").then((m) => m.StartProjectPanel), { ssr: false });
const RemixController = dynamic(() => import("@/components/remix/RemixController").then((m) => m.RemixController), { ssr: false });
const DesignerCursor = dynamic(() => import("@/components/DesignerCursor").then((m) => m.DesignerCursor), { ssr: false });

export function LazyExtras() {
  return (
    <>
      <StartProjectPanel />
      <RemixController />
      <DesignerCursor />
    </>
  );
}