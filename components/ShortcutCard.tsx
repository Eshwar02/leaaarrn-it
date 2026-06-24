import type { Shortcut } from "@/lib/types";
import { KeyCombo } from "./KeyBadge";

interface ShortcutCardProps {
  shortcut: Shortcut;
}

function osLabel(os: string): string {
  switch (os) {
    case "macos":
      return "macOS";
    case "windows":
      return "Windows";
    case "linux":
      return "Linux";
    case "cross":
      return "Cross-platform";
    default:
      return os;
  }
}

function platformDifferenceNote(shortcut: Shortcut): string | null {
  const entries = shortcut.platforms;
  if (entries.length <= 1) {
    return null;
  }

  const distinctNames = Array.from(new Set(entries.map((p) => p.name)));
  if (distinctNames.length <= 1) {
    return null;
  }

  const summary = entries
    .map((p) => `on ${osLabel(p.os)} it ${p.name}`)
    .join(", ");

  return `This shortcut behaves differently across platforms — ${summary}.`;
}

export function ShortcutCard({ shortcut }: ShortcutCardProps) {
  const note = platformDifferenceNote(shortcut);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-ink">{shortcut.name}</h3>
        <KeyCombo keys={shortcut.keys} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-accent/10 text-accent px-2.5 py-0.5 text-xs font-medium">
          {shortcut.app}
        </span>
        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2.5 py-0.5 text-xs font-medium">
          {shortcut.category}
        </span>
        <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2.5 py-0.5 text-xs font-medium">
          {shortcut.difficulty}
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
        {shortcut.description}
      </p>

      <div className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Works in
        </h4>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {shortcut.platforms.map((p, i) => (
            <li
              key={`${p.os}-${i}`}
              className="rounded-lg border border-gray-100 bg-paper px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-ink">{p.name}</span>
                <span className="inline-flex items-center rounded bg-ink/5 text-ink/70 px-1.5 py-0.5 text-[0.65rem] font-mono">
                  {osLabel(p.os)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">{p.context}</p>
            </li>
          ))}
        </ul>
      </div>

      {note && (
        <div className="mt-4 rounded-lg border border-streak/30 bg-streak/10 px-3 py-2">
          <p className="text-xs text-ink/80">
            <span className="font-semibold text-streak">Did you know? </span>
            {note}
          </p>
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          disabled
          title="Sign in (coming soon)"
          className="inline-flex items-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed"
        >
          Add to learned
        </button>
      </div>
    </div>
  );
}

export default ShortcutCard;
