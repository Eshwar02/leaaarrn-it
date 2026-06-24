"use client";

import { useCallback, useState } from "react";
import type { AppId, Shortcut } from "@/lib/types";
import { comboLabel } from "@/lib/keys";
import { APP_BY_ID } from "@/lib/apps";
import KeyCaptureBox from "@/components/KeyCaptureBox";
import VisualKeyboard from "@/components/VisualKeyboard";
import AppSidebar from "@/components/AppSidebar";
import { ShortcutCard } from "@/components/ShortcutCard";

const MODIFIERS = new Set(["ctrl", "alt", "shift", "meta"]);

function hasMainKey(combo: string[]): boolean {
  return combo.some((k) => !MODIFIERS.has(k));
}

export default function ExplorePage() {
  // `selectedApp === null` means "Search by combo" mode.
  const [selectedApp, setSelectedApp] = useState<AppId | null>(null);
  const [combo, setCombo] = useState<string[]>([]);
  const [results, setResults] = useState<Shortcut[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const isMac =
    typeof navigator !== "undefined" && /mac/i.test(navigator.platform);

  // Shared fetch for either ?keys= or ?app= queries.
  const fetchShortcuts = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const res = await fetch(`/api/shortcuts?${query}`);
      const data: { shortcuts?: Shortcut[]; error?: string } =
        await res.json();
      if (data.error) {
        setError(data.error);
        setResults([]);
      } else {
        setResults(data.shortcuts ?? []);
      }
    } catch {
      setError("Network error — could not reach the shortcut service.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const runQuery = useCallback(
    (next: string[]) => {
      if (!hasMainKey(next)) {
        return;
      }
      setCombo(next);
      void fetchShortcuts(`keys=${encodeURIComponent(next.join(","))}`);
    },
    [fetchShortcuts]
  );

  const handleCombo = useCallback(
    (keys: string[]) => {
      runQuery(keys);
    },
    [runQuery]
  );

  // Selecting an app from the sidebar (or null to return to combo search).
  const handleSelectApp = useCallback(
    (app: AppId | null) => {
      setSelectedApp(app);
      setCombo([]);
      if (app === null) {
        setResults([]);
        setSearched(false);
        setError(null);
        return;
      }
      void fetchShortcuts(`app=${encodeURIComponent(app)}`);
    },
    [fetchShortcuts]
  );

  const isSupabaseError =
    error !== null && /supabase|config|env/i.test(error);

  const appMeta = selectedApp ? APP_BY_ID[selectedApp] : null;

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink">
            Shortcut Explorer
          </h1>
          <p className="mt-2 text-gray-500">
            Browse an app on the left, or search by pressing a shortcut.
          </p>
        </header>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* ---- Left sidebar ---- */}
          <aside className="lg:sticky lg:top-8 lg:w-64 lg:flex-shrink-0">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <AppSidebar selected={selectedApp} onSelect={handleSelectApp} />
            </div>
          </aside>

          {/* ---- Right content ---- */}
          <div className="min-w-0 flex-1">
            {selectedApp === null ? (
              <>
                <section>
                  <KeyCaptureBox onCombo={handleCombo} activeKeys={combo} />
                </section>
                <section className="mt-6">
                  <p className="mb-2 text-center text-xs text-gray-400">
                    …or click the keys below
                  </p>
                  <VisualKeyboard onCombo={handleCombo} activeKeys={combo} />
                </section>
              </>
            ) : (
              <header className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden>
                  {appMeta?.icon}
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-ink">
                    {appMeta?.label} shortcuts
                  </h2>
                  {!loading && !error && (
                    <p className="text-sm text-gray-500">
                      {results.length} shortcut
                      {results.length === 1 ? "" : "s"}
                    </p>
                  )}
                </div>
              </header>
            )}

            <section className="mt-8">
              {loading && (
                <p className="text-center text-sm text-gray-500">Loading…</p>
              )}

              {!loading && error && (
                <div className="rounded-lg border border-err/30 bg-err/10 px-4 py-3">
                  <p className="text-sm text-err">{error}</p>
                  {isSupabaseError && (
                    <p className="mt-1 text-xs text-err/80">
                      Hint: set your Supabase env variables (see{" "}
                      <span className="font-mono">.env.local</span>) and seed
                      the database before querying.
                    </p>
                  )}
                </div>
              )}

              {!loading && !error && searched && results.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  {selectedApp ? (
                    <>No shortcuts found for this app yet.</>
                  ) : (
                    <>
                      No shortcut found for{" "}
                      <span className="font-medium text-ink">
                        {comboLabel(combo, { mac: isMac })}
                      </span>
                      .
                    </>
                  )}
                </p>
              )}

              {!loading && !error && results.length > 0 && (
                <div className="flex flex-col gap-4">
                  {selectedApp === null && results.length > 1 && (
                    <p className="text-sm text-gray-500">
                      {results.length} shortcuts use this combo across apps
                    </p>
                  )}
                  {results.map((s) => (
                    <ShortcutCard key={s.id} shortcut={s} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
