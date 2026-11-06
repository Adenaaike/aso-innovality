import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { enquirySchema } from "@/lib/validation";
import { serviceClient } from "@/lib/supabase/admin";
import { site } from "@/lib/site";

const PER_HOUR = 3;
const PER_DAY = 6;
const MIN_SECONDS = 3;
const MAX_LINKS = 3;

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the form and try again." }, { status: 422 });
  const { website, ...e } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // bot trap: silently discarded

  // Speed check: real people take longer than a few seconds to fill the form
  const startedAt = Number((body as { startedAt?: unknown })?.startedAt);
  if (!startedAt || Date.now() - startedAt < MIN_SECONDS * 1000) return NextResponse.json({ ok: true }); // silently discarded

  // Link check: spam is usually packed with links
  const links = (e.description.match(/https?:\/\/|www\./gi) ?? []).length;
  if (links > MAX_LINKS) {
    return NextResponse.json({ error: `Please include no more than ${MAX_LINKS} links in your message.` }, { status: 422 });
  }

  const sb = serviceClient();
  if (!sb) return NextResponse.json({ error: `The form isn't connected yet. Please email ${site.email} or message on WhatsApp.` }, { status: 503 });

  // Rate limit (live site only): a few enquiries per visitor per hour and per day
  if (process.env.NODE_ENV === "production") {
    const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const hash = createHash("sha256").update(`${ip}|${req.headers.get("user-agent") ?? ""}|${process.env.WALL_SALT ?? "aso-contact"}`).digest("hex");
    const now = Date.now();
    const hourAgo = new Date(now - 3600_000).toISOString();
    const dayAgo = new Date(now - 86400_000).toISOString();

    const { count: lastHour } = await sb.from("contact_limits").select("id", { count: "exact", head: true })
      .eq("visitor_hash", hash).gte("created_at", hourAgo);
    const { count: lastDay } = await sb.from("contact_limits").select("id", { count: "exact", head: true })
      .eq("visitor_hash", hash).gte("created_at", dayAgo);
    if ((lastHour ?? 0) >= PER_HOUR || (lastDay ?? 0) >= PER_DAY) {
      return NextResponse.json({ error: `You’ve sent several messages already. Please wait a little, or email ${site.email} directly.` }, { status: 429 });
    }

    await sb.from("contact_limits").insert({ visitor_hash: hash });
    // Privacy: remove codes older than two days
    await sb.from("contact_limits").delete().lt("created_at", new Date(now - 2 * 86400_000).toISOString());
  }

  const { error } = await sb.from("enquiries").insert({
    full_name: e.fullName, email: e.email, company: e.company || null,
    project_type: e.projectType, budget: e.budget || null, description: e.description,
  });
  if (error) return NextResponse.json({ error: "Your message couldn't be saved. Please try again or email directly." }, { status: 500 });

  if (process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL, to: [site.email], reply_to: e.email,
        subject: `New enquiry: ${e.projectType} — ${e.fullName}`,
        text: `Name: ${e.fullName}\nEmail: ${e.email}\nCompany: ${e.company || "—"}\nType: ${e.projectType}\nBudget: ${e.budget || "—"}\n\n${e.description}`,
      }),
    }).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}