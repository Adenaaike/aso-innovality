import type { Metadata } from "next";
import { IdeaWall } from "@/components/wall/IdeaWall";
import { getWall, getWallCount } from "@/lib/wall";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Idea Wall — A Living Palette Made by Visitors",
  description: "Add one colour a day to ASO INNOVALITY’s Idea Wall, a living mosaic built by everyone who visits.",
  alternates: { canonical: "/wall" },
};

export default async function WallPage() {
  const [entries, total] = await Promise.all([getWall(600), getWallCount()]);
  return (
    <div className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <p className="text-xs font-semibold tracking-[0.3em] text-royal dark:text-light-azure">THE IDEA WALL</p>
      <h1 className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.05]">
        A living palette, <span className="aso-text-gradient">made by everyone who visits.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Add one colour a day, with your name or a word if you like, and watch the wall grow in real time.
      </p>
      <div className="mt-12"><IdeaWall initial={entries} total={total} variant="full" /></div>
    </div>
  );
}