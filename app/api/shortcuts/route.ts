import { getServerClient } from "@/lib/supabase/server";
import { sortCombo } from "@/lib/keys";
import type { Shortcut } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const app = searchParams.get("app");
    const category = searchParams.get("category");
    const keysParam = searchParams.get("keys");

    const supabase = getServerClient();
    let q = supabase.from("shortcuts").select("*");

    if (app) {
      q = q.eq("app", app);
    }
    if (category) {
      q = q.eq("category", category);
    }

    let sorted: string[] | null = null;
    if (keysParam) {
      sorted = sortCombo(
        keysParam
          .split(",")
          .map((k) => k.trim().toLowerCase())
          .filter((k) => k.length > 0),
      );
      // Postgres array `contains` checks the db array contains all provided
      // elements (subset), not exact equality — refine with a JS set match.
      q = q.contains("keys", sorted);
    }

    const { data, error } = await q;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    let shortcuts = (data ?? []) as Shortcut[];

    if (sorted) {
      const requested = sorted;
      const requestedSet = new Set(requested);
      shortcuts = shortcuts.filter(
        (row) =>
          row.keys.length === requested.length &&
          row.keys.every((k) => requestedSet.has(k)),
      );
    }

    return Response.json({ shortcuts });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown server error";
    return Response.json(
      {
        error: `${message}. Hint: ensure Supabase is configured (set SUPABASE_URL and the service role key).`,
      },
      { status: 500 },
    );
  }
}
