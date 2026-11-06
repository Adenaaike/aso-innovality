import { IdeaWall } from "@/components/wall/IdeaWall";
import { getWall, getWallCount } from "@/lib/wall";

export async function WallStrip() {
  const [entries, total] = await Promise.all([getWall(48), getWallCount()]);
  return <IdeaWall initial={entries} total={total} variant="strip" />;
}