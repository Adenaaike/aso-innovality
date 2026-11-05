"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { Loader2, LogOut, Lock } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";

type State = "loading" | "signed-out" | "not-admin" | "admin";

export const adminLinks = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/enquiries", label: "Enquiries" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/content", label: "Content" },
    { href: "/admin/calculators", label: "Calculators" },
    { href: "/admin/journal", label: "Journal" },
  ];

export function AdminGate({ children }: { children: ReactNode }) {
  const sb = browserClient();
  const pathname = usePathname();
  const [state, setState] = useState<State>("loading");
  const [userEmail, setUserEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function check(session: Session | null) {
    if (!session) { setState("signed-out"); return; }
    setUserEmail(session.user.email ?? "");
    const { data } = await sb.from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
    setState(data ? "admin" : "not-admin");
  }

  useEffect(() => {
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => check(session), 0); // run outside the auth callback
    });
    return () => sub.subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message === "Invalid login credentials" ? "Incorrect email or password." : error.message);
  }

  const input = "w-full rounded-sm border border-line bg-bg p-3 text-sm focus:border-royal focus:outline-none";

  if (state === "loading") {
    return <div className="grid min-h-[70vh] place-items-center pt-24"><Loader2 className="animate-spin text-royal" aria-label="Loading" /></div>;
  }

  if (state === "signed-out") {
    return (
      <div className="grid min-h-[80vh] place-items-center px-6 pt-24">
        <form onSubmit={signIn} className="w-full max-w-sm space-y-4 rounded-sm border border-line bg-surface p-8">
          <div className="flex items-center gap-2"><Lock size={18} className="text-royal" /><h1 className="font-display text-xl font-bold">Admin sign in</h1></div>
          <div><label htmlFor="adm-email" className="mb-1 block text-sm font-medium">Email</label>
            <input id="adm-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} /></div>
          <div><label htmlFor="adm-pass" className="mb-1 block text-sm font-medium">Password</label>
            <input id="adm-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} /></div>
          {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button disabled={busy} className="w-full rounded-full bg-royal px-6 py-3 text-sm font-medium text-white hover:bg-bright disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  if (state === "not-admin") {
    return (
      <div className="grid min-h-[70vh] place-items-center px-6 pt-24 text-center">
        <div className="space-y-4">
          <p className="font-display text-xl font-bold">This account doesn’t have admin access.</p>
          <button onClick={() => sb.auth.signOut()} className="rounded-full border border-line px-6 py-3 text-sm font-medium hover:border-royal">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pt-24 pb-20">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <nav aria-label="Admin" className="flex flex-wrap gap-1">
          {adminLinks.map((l) => (
            <Link key={l.href} href={l.href} aria-current={(l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href)) ? "page" : undefined}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted hover:text-fg aria-[current=page]:bg-royal aria-[current=page]:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="hidden sm:inline">{userEmail}</span>
          <button onClick={() => sb.auth.signOut()} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-medium hover:border-royal hover:text-royal">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}