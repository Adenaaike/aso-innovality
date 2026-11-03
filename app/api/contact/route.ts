import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation";
import { serviceClient } from "@/lib/supabase/admin";
import { site } from "@/lib/site";

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the form and try again." }, { status: 422 });
  const { website, ...e } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // bot trap: silently discarded

  const sb = serviceClient();
  if (!sb) return NextResponse.json({ error: `The form isn't connected yet. Please email ${site.email} or message on WhatsApp.` }, { status: 503 });

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