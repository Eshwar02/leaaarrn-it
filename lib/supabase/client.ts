import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Returns a browser Supabase client, throwing a clear error if the public
 * env vars are missing. Prefer this in app code where you want a hard,
 * descriptive failure instead of silent misconfiguration.
 */
export function getBrowserClient(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase browser env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    );
  }
  return createClient(url, anonKey);
}

/**
 * Singleton browser client. Tolerant of build-time env collection (Next
 * gathers pages without runtime env), falling back to empty strings so the
 * module can be imported without throwing. This is client-only and safe.
 */
export const supabase: SupabaseClient = createClient(url ?? "", anonKey ?? "");

export default supabase;
