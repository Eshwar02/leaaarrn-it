"use client";

import { useState } from "react";
import { sortCombo } from "@/lib/keys";
import { KeyBadge } from "./KeyBadge";

interface VisualKeyboardProps {
  onCombo: (keys: string[]) => void;
  activeKeys?: string[];
}

interface KeyDef {
  label: string;
  token: string;
  modifier?: boolean;
  wide?: boolean;
}

const MODIFIER_TOKENS = new Set(["ctrl", "alt", "shift", "meta"]);

const NUMBER_ROW: KeyDef[] = "1234567890"
  .split("")
  .map((c) => ({ label: c, token: c }));

const QWERTY_ROWS: KeyDef[][] = [
  "qwertyuiop".split("").map((c) => ({ label: c.toUpperCase(), token: c })),
  "asdfghjkl".split("").map((c) => ({ label: c.toUpperCase(), token: c })),
  "zxcvbnm".split("").map((c) => ({ label: c.toUpperCase(), token: c })),
];

const TOP_ROW: KeyDef[] = [
  { label: "Esc", token: "esc" },
  ...["F1", "F2", "F3", "F4", "F5", "F6"].map((f) => ({
    label: f,
    token: f.toLowerCase(),
  })),
];

const BOTTOM_ROW: KeyDef[] = [
  { label: "Ctrl", token: "ctrl", modifier: true, wide: true },
  { label: "Alt", token: "alt", modifier: true },
  { label: "Shift", token: "shift", modifier: true, wide: true },
  { label: "⌘", token: "meta", modifier: true },
  { label: "Tab", token: "tab" },
  { label: "Space", token: "space", wide: true },
  { label: "Enter", token: "enter", wide: true },
];

const ARROW_ROW: KeyDef[] = [
  { label: "←", token: "arrowleft" },
  { label: "↑", token: "arrowup" },
  { label: "↓", token: "arrowdown" },
  { label: "→", token: "arrowright" },
];

export default function VisualKeyboard({
  onCombo,
  activeKeys = [],
}: VisualKeyboardProps) {
  const [held, setHeld] = useState<string[]>([]);

  const isActive = (token: string): boolean =>
    held.includes(token) || activeKeys.includes(token);

  function handleClick(def: KeyDef) {
    if (def.modifier) {
      setHeld((prev) =>
        prev.includes(def.token)
          ? prev.filter((t) => t !== def.token)
          : [...prev, def.token]
      );
      return;
    }

    const combo = sortCombo([...held, def.token]);
    onCombo(combo);
    setHeld([]);
  }

  function renderKey(def: KeyDef) {
    return (
      <button
        key={def.token}
        type="button"
        onClick={() => handleClick(def)}
        className={`${def.wide ? "flex-[1.6]" : "flex-1"} flex justify-center`}
        aria-pressed={def.modifier ? held.includes(def.token) : undefined}
      >
        <KeyBadge label={def.label} active={isActive(def.token)} />
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1.5">{TOP_ROW.map(renderKey)}</div>
        <div className="flex gap-1.5">{NUMBER_ROW.map(renderKey)}</div>
        {QWERTY_ROWS.map((row, i) => (
          <div key={`row-${i}`} className="flex gap-1.5">
            {row.map(renderKey)}
          </div>
        ))}
        <div className="flex gap-1.5">{BOTTOM_ROW.map(renderKey)}</div>
        <div className="flex gap-1.5 justify-center">
          {ARROW_ROW.map(renderKey)}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-gray-400">
        Click a modifier to hold it, then click another key to fire the combo.
      </p>
    </div>
  );
}

export { MODIFIER_TOKENS };
