import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser client for the admin area. It keeps you logged in;
// the database's security rules decide what you can see and change.
let client: SupabaseClient | null = null;

export function browserClient() {
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: "aso-admin-auth" },
    });
  }
  return client;
}