import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Returns a server-only Supabase client backed by the service role key.
 * The service role bypasses RLS, so this must never be exposed to the
 * browser. Sessions are not persisted (no cookie/storage on the server).
 */
export function getServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase server env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
