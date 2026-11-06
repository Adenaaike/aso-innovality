import { publicClient } from "@/lib/supabase/public";

export type WallEntry = { id: string; color: string; label: string | null; created_at: string };

export async function getWall(limit = 600): Promise<WallEntry[]> {
  const sb = publicClient();
  if (!sb) return [];
  const { data } = await sb.from("idea_wall").select("id, color, label, created_at")
    .eq("published", true).order("created_at", { ascending: false }).limit(limit);
  return (data ?? []) as WallEntry[];
}

export async function getWallCount(): Promise<number> {
  const sb = publicClient();
  if (!sb) return 0;
  const { count } = await sb.from("idea_wall").select("id", { count: "exact", head: true }).eq("published", true);
  return count ?? 0;
}