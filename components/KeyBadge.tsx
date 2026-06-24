import { comboLabel } from "@/lib/keys";

interface KeyBadgeProps {
  label: string;
  active?: boolean;
  size?: "sm" | "md";
}

export function KeyBadge({ label, active = false, size = "md" }: KeyBadgeProps) {
  const sizeClasses =
    size === "sm"
      ? "min-w-[1.75rem] px-1.5 py-0.5 text-xs"
      : "min-w-[2.25rem] px-2.5 py-1 text-sm";

  const base =
    "inline-flex items-center justify-center rounded-md border font-mono font-medium shadow-[0_2px_0_rgba(0,0,0,0.15)] select-none transition-colors";

  const palette = active
    ? "bg-accent/15 border-accent text-accent ring-2 ring-accent/40"
    : "bg-white border-gray-300 text-ink";

  return (
    <span className={`${base} ${sizeClasses} ${palette}`}>{label}</span>
  );
}

interface KeyComboProps {
  keys: string[];
  active?: boolean;
  size?: "sm" | "md";
}

export function KeyCombo({ keys, active = false, size = "md" }: KeyComboProps) {
  if (keys.length === 0) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((token, i) => (
        <span key={`${token}-${i}`} className="inline-flex items-center gap-1">
          {i > 0 && (
            <span className="text-gray-400 font-mono text-xs">+</span>
          )}
          <KeyBadge label={comboLabel([token])} active={active} size={size} />
        </span>
      ))}
    </span>
  );
}

export default KeyBadge;
