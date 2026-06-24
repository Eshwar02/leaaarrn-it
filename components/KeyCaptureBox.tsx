"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { comboFromEvent, comboLabel, sortCombo } from "@/lib/keys";

const MODIFIERS = new Set(["ctrl", "alt", "shift", "meta"]);

function hasMainKey(combo: string[]): boolean {
  return combo.some((k) => !MODIFIERS.has(k));
}

// Combos the browser reserves and will NOT let a normal page suppress.
// Only Keyboard Lock (fullscreen, Chromium) can truly trap these.
const RESERVED = new Set([
  "ctrl+t",
  "ctrl+n",
  "ctrl+w",
  "ctrl+shift+n",
  "ctrl+shift+t",
  "ctrl+shift+w",
  "ctrl+shift+q",
  "ctrl+l",
  "meta+t",
  "meta+n",
  "meta+w",
]);

interface KeyCaptureBoxProps {
  /** Fires with a normalized, sorted combo once a real (non-modifier) key lands. */
  onCombo: (keys: string[]) => void;
  /** Combo to render when the user is not actively pressing keys. */
  activeKeys?: string[];
}

type LockState = "unsupported" | "idle" | "locked";

export default function KeyCaptureBox({
  onCombo,
  activeKeys = [],
}: KeyCaptureBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [held, setHeld] = useState<string[]>([]);
  const [flash, setFlash] = useState(0);
  const [lock, setLock] = useState<LockState>("idle");
  const headingId = useId();

  const isMac =
    typeof navigator !== "undefined" && /mac/i.test(navigator.platform);

  // Detect Keyboard Lock support once on mount.
  useEffect(() => {
    const supported =
      typeof navigator !== "undefined" &&
      "keyboard" in navigator &&
      // @ts-expect-error - keyboard.lock is not in the standard lib types yet.
      typeof navigator.keyboard?.lock === "function";
    setLock(supported ? "idle" : "unsupported");
  }, []);

  const onComboRef = useRef(onCombo);
  onComboRef.current = onCombo;

  const fire = useCallback((combo: string[]) => {
    onComboRef.current(combo);
    setFlash((n) => n + 1);
  }, []);

  // ---- Key handling while the box is focused --------------------------
  useEffect(() => {
    if (!focused) return;

    function onKeyDown(e: KeyboardEvent) {
      // Trap the event so it never reaches the browser/global handlers.
      // In locked fullscreen this even covers Ctrl+T, Ctrl+Shift+N, etc.
      e.preventDefault();
      e.stopPropagation();

      const combo = comboFromEvent(e);
      setHeld(combo);

      if (hasMainKey(combo)) {
        fire(combo);
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      e.preventDefault();
      // Clear the live preview once all keys are released.
      const combo = comboFromEvent(e);
      if (!hasMainKey(combo) && combo.every((k) => MODIFIERS.has(k))) {
        setHeld(combo.filter((k) => MODIFIERS.has(k)));
      }
      if (combo.length === 0) setHeld([]);
    }

    // Capture phase + non-passive so preventDefault is honored.
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("keyup", onKeyUp, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("keyup", onKeyUp, { capture: true });
    };
  }, [focused, fire]);

  // ---- Fullscreen + Keyboard Lock -------------------------------------
  const enterLock = useCallback(async () => {
    const el = boxRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      }
      // @ts-expect-error - keyboard.lock not in standard lib types yet.
      await navigator.keyboard.lock();
      setLock("locked");
      el.focus();
    } catch {
      // User dismissed fullscreen, or lock was refused — stay in normal mode.
      setLock("idle");
    }
  }, []);

  const exitLock = useCallback(async () => {
    try {
      // @ts-expect-error - keyboard.unlock not in standard lib types yet.
      navigator.keyboard?.unlock?.();
      if (document.fullscreenElement) await document.exitFullscreen();
    } finally {
      setLock((s) => (s === "locked" ? "idle" : s));
    }
  }, []);

  // Keep lock state in sync if the user presses Esc / leaves fullscreen.
  useEffect(() => {
    function onFsChange() {
      if (!document.fullscreenElement) {
        // @ts-expect-error - unlock not typed.
        navigator.keyboard?.unlock?.();
        setLock((s) => (s === "locked" ? "idle" : s));
      }
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // What to show: live keys while held, else the last fired combo.
  const display = held.length > 0 ? sortCombo(held) : activeKeys;
  const locked = lock === "locked";

  return (
    <div
      ref={boxRef}
      role="group"
      aria-labelledby={headingId}
      tabIndex={0}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={() => boxRef.current?.focus()}
      className={[
        "relative w-full select-none outline-none transition-all duration-300",
        "rounded-3xl border-2 px-6 py-12 sm:py-16",
        "flex flex-col items-center justify-center gap-6 text-center",
        "min-h-[16rem] sm:min-h-[20rem] cursor-text",
        locked ? "bg-ink" : "bg-white",
        focused
          ? "border-accent shadow-[0_8px_40px_-12px_rgba(108,99,255,0.45)]"
          : "border-dashed border-gray-300 hover:border-accent/60",
        focused && !locked ? "animate-capture-glow" : "",
      ].join(" ")}
    >
      {/* Status line */}
      <div className="flex items-center gap-2">
        <span
          className={[
            "inline-block h-2.5 w-2.5 rounded-full transition-colors",
            focused ? "bg-ok" : "bg-gray-300",
          ].join(" ")}
          aria-hidden
        />
        <span
          id={headingId}
          className={[
            "text-sm font-medium tracking-wide",
            locked ? "text-white/80" : "text-gray-500",
          ].join(" ")}
        >
          {locked
            ? "🔒 Locked — every shortcut is captured. Hold Esc to exit."
            : focused
              ? "Listening… press any shortcut"
              : "Click here, then press a shortcut"}
        </span>
      </div>

      {/* The big live display */}
      <div
        key={flash}
        className={[
          "flex min-h-[5rem] flex-wrap items-center justify-center gap-3 rounded-2xl px-4",
          focused ? "animate-capture-flash" : "",
        ].join(" ")}
      >
        {display.length > 0 ? (
          display.map((token, i) => (
            <span
              key={`${token}-${i}-${flash}`}
              className="flex items-center gap-3"
            >
              {i > 0 && (
                <span
                  className={[
                    "font-mono text-2xl",
                    locked ? "text-white/40" : "text-gray-300",
                  ].join(" ")}
                >
                  +
                </span>
              )}
              <kbd
                className={[
                  "animate-key-pop inline-flex min-w-[3.5rem] items-center justify-center",
                  "rounded-xl border-b-4 px-4 py-3 font-mono text-2xl font-bold sm:text-3xl",
                  "shadow-lg",
                  locked
                    ? "border-accent bg-white/10 text-white"
                    : "border-accent bg-accent/10 text-accent",
                ].join(" ")}
              >
                {comboLabel([token], { mac: isMac })}
              </kbd>
            </span>
          ))
        ) : (
          <span
            className={[
              "font-mono text-2xl sm:text-3xl",
              locked ? "text-white/30" : "text-gray-300",
            ].join(" ")}
          >
            {focused ? "…" : "⌨"}
          </span>
        )}
      </div>

      {/* Lock toggle */}
      <div className="flex flex-col items-center gap-1">
        {lock === "unsupported" ? (
          <p
            className={[
              "max-w-md text-xs",
              locked ? "text-white/50" : "text-gray-400",
            ].join(" ")}
          >
            Tip: this browser can't fully trap reserved combos (Ctrl+Shift+N,
            Ctrl+T…). Use Chrome, Edge, or Brave for total capture.
          </p>
        ) : locked ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void exitLock();
            }}
            className="rounded-full border border-white/30 px-4 py-1.5 text-xs font-medium text-white/90 transition-colors hover:bg-white/10"
          >
            Exit full capture
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void enterLock();
            }}
            className="rounded-full border border-accent/40 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/15"
          >
            🔒 Enable full capture (Ctrl+Shift+N, Ctrl+T…)
          </button>
        )}
        {!locked && lock !== "unsupported" && (
          <p className="max-w-md text-[11px] text-gray-400">
            Normal mode traps most shortcuts. Reserved browser combos need full
            capture (opens fullscreen).
          </p>
        )}
      </div>
    </div>
  );
}
