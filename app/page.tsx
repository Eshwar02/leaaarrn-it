import Link from "next/link";

interface Feature {
  title: string;
  description: string;
  live: boolean;
}

const FEATURES: Feature[] = [
  {
    title: "Explorer",
    description:
      "Press any shortcut and instantly see what it does across every OS, browser, and app.",
    live: true,
  },
  {
    title: "Drill",
    description:
      "Practice shortcuts with spaced-repetition drills until they're muscle memory.",
    live: false,
  },
  {
    title: "Streaks",
    description:
      "Build a daily habit and keep your learning streak alive.",
    live: false,
  },
  {
    title: "ShortcutBot",
    description:
      "Ask in plain English and get the exact key combo you need.",
    live: false,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <section className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-ink">
            leaaarrn-it
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-medium text-gray-700">
            Master every keyboard shortcut — across every OS, browser, and app.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            Stop reaching for your mouse. Discover, practice, and remember the
            shortcuts that make you faster — all in one clean, focused place.
          </p>

          <div className="mt-8">
            <Link
              href="/explore"
              className="inline-flex items-center rounded-lg bg-accent px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-accent/90"
            >
              Try the Explorer →
            </Link>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-ink">{f.title}</h2>
                {f.live ? (
                  <span className="inline-flex items-center rounded-full bg-ok/10 text-ok px-2.5 py-0.5 text-xs font-medium">
                    Live
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-500 px-2.5 py-0.5 text-xs font-medium">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">{f.description}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
