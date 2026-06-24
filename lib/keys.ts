// Framework-free key normalization utilities.
// Functions take DOM KeyboardEvent but require no React/Next imports.

export const MODIFIER_ORDER: string[] = ["ctrl", "alt", "shift", "meta"];

const MODIFIER_KEYS = new Set<string>([
  "Control",
  "Shift",
  "Alt",
  "Meta",
  "OS",
]);

const MODIFIER_TOKENS = new Set<string>(MODIFIER_ORDER);

/** Maps a KeyboardEvent.key value to a normalized token. */
export function normalizeKey(key: string): string {
  switch (key) {
    case "Control":
      return "ctrl";
    case "Shift":
      return "shift";
    case "Alt":
      return "alt";
    case "Meta":
    case "OS":
      return "meta";
    case " ":
      return "space";
    case "Escape":
      return "esc";
    case "Enter":
      return "enter";
    case "Tab":
      return "tab";
    default:
      break;
  }

  // Arrow* names -> lowercase (e.g. "ArrowLeft" -> "arrowleft").
  if (/^Arrow(Left|Right|Up|Down)$/.test(key)) {
    return key.toLowerCase();
  }

  // Function keys "F2".."F12" -> lowercase (e.g. "F2" -> "f2").
  if (/^F([2-9]|1[0-2])$/.test(key)) {
    return key.toLowerCase();
  }

  // Single printable chars and any default -> lowercased.
  return key.toLowerCase();
}

/** Builds a normalized combo array from a keyboard event. */
export function comboFromEvent(e: KeyboardEvent): string[] {
  const combo: string[] = [];

  if (e.ctrlKey) combo.push("ctrl");
  if (e.altKey) combo.push("alt");
  if (e.shiftKey) combo.push("shift");
  if (e.metaKey) combo.push("meta");

  // Append the main key only if it is not itself a modifier.
  if (!MODIFIER_KEYS.has(e.key)) {
    combo.push(normalizeKey(e.key));
  }

  // Dedupe while preserving order.
  return Array.from(new Set(combo));
}

/** Returns modifiers (in MODIFIER_ORDER) first, then remaining keys in order. */
export function sortCombo(keys: string[]): string[] {
  const mods = MODIFIER_ORDER.filter((m) => keys.includes(m));
  const rest = keys.filter((k) => !MODIFIER_TOKENS.has(k));
  return [...mods, ...rest];
}

const NAMED_LABELS: Record<string, string> = {
  tab: "Tab",
  enter: "Enter",
  esc: "Esc",
  space: "Space",
  arrowleft: "←",
  arrowright: "→",
  arrowup: "↑",
  arrowdown: "↓",
};

function labelForToken(token: string, mac: boolean): string {
  switch (token) {
    case "ctrl":
      return "Ctrl";
    case "shift":
      return "Shift";
    case "alt":
      return mac ? "Option" : "Alt";
    case "meta":
      return mac ? "Cmd" : "Win";
    default:
      break;
  }

  if (token in NAMED_LABELS) {
    return NAMED_LABELS[token];
  }

  // Function keys f2 -> F2.
  if (/^f([2-9]|1[0-2])$/.test(token)) {
    return token.toUpperCase();
  }

  // Single chars (and anything else) -> uppercased.
  return token.toUpperCase();
}

/** Human-readable label joined by "+", order-stable via sortCombo. */
export function comboLabel(keys: string[], opts?: { mac?: boolean }): string {
  const mac = opts?.mac ?? false;
  return sortCombo(keys)
    .map((token) => labelForToken(token, mac))
    .join("+");
}

/** Canonical lowercase string key for comparing/deduping combos. */
export function comboKey(keys: string[]): string {
  return sortCombo(keys).join("+").toLowerCase();
}
