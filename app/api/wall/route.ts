import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

// Words that aren't allowed on the wall (add more any time, in lowercase)
const BLOCKED = [
  "fuck", "fuk", "shit", "bitch", "bastard", "asshole", "arsehole", "dick", "cock", "pussy", "cunt",
  "whore", "slut", "nigger", "nigga", "fag", "retard", "rape", "porn", "sex", "nude", "kill",
  "ashawo", "mumu", "werey", "olodo", "oloshi",
];

const normalise = (s: string) =>
  s.toLowerCase().replace(/[0]/g, "o").replace(/[1!|]/g, "i").replace(/3/g, "e").replace(/[4@]/g, "a")
    .replace(/[5$]/g, "s").replace(/7/g, "t").replace(/[^a-z]/g, "");
const isBlocked = (s: string) => { const n = normalise(s); return BLOCKED.some((w) => n.includes(w)); };
const fail = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

export async function POST(req: Request) {
  let body: { color?: string; label?: string };
  try { body = await req.json(); } catch { return fail("Invalid request."); }

  const color = String(body.color ?? "").toUpperCase();
  if (!/^#[0-9A-F]{6}$/.test(color)) return fail("Please pick a valid colour.");

  const label = String(body.label ?? "").trim().replace(/\s+/g, " ");
  if (label) {
    if (label.length > 20 || !/^[\p{L}\p{N}' -]+$/u.test(label)) return fail("Use up to 20 letters or numbers for your name or word.");
    if (isBlocked(label)) return fail("Let’s keep the wall friendly. Please choose another word.");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return fail("The wall is unavailable right now.", 500);
  const sb = createClient(url, key, { auth: { persistSession: false } });

  // One colour per visitor per day (skipped while testing on localhost)
  if (process.env.NODE_ENV === "production") {
    const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const hash = createHash("sha256").update(`${ip}|${req.headers.get("user-agent") ?? ""}|${process.env.WALL_SALT ?? "aso-idea-wall"}`).digest("hex");
    const day = new Date().toISOString().slice(0, 10);
    const { error: limited } = await sb.from("wall_limits").insert({ visitor_hash: hash, day });
    if (limited) return fail("You’ve already added a colour today. Come back tomorrow!", 429);
  }

  const { data, error } = await sb.from("idea_wall").insert({ color, label: label || null })
    .select("id, color, label, created_at").single();
  if (error) return fail("Couldn’t add your colour. Please try again.", 500);
  return NextResponse.json({ entry: data });
}