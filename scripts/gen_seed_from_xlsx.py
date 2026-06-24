#!/usr/bin/env python3
"""Generate supabase/seed_from_xlsx.sql from dataas/shortcut_reference_with_context.xlsx.

Maps the spreadsheet schema onto the project's `shortcuts` table:
  Shortcut, Action, Operating_System, Application, Category, Explanation
  -> keys[], name, description, platforms(jsonb), category, difficulty, app

Key normalization mirrors lib/keys.ts so combo search matches.
"""
import json
import openpyxl

SRC = "dataas/shortcut_reference_with_context.xlsx"
OUT = "supabase/seed_from_xlsx.sql"

# ---- key token normalization (mirror lib/keys.ts) -------------------------
KEY_MAP = {
    "ctrl": "ctrl", "control": "ctrl",
    "alt": "alt", "option": "alt",
    "shift": "shift",
    "cmd": "meta", "command": "meta", "win": "meta", "meta": "meta", "super": "meta",
    "esc": "esc", "escape": "esc",
    "space": "space",
    "tab": "tab",
    "enter": "enter", "return": "enter",
}
MOD_ORDER = ["ctrl", "alt", "shift", "meta"]
MODS = set(MOD_ORDER)


def norm_token(t: str) -> str:
    low = t.strip().lower()
    if low in KEY_MAP:
        return KEY_MAP[low]
    return low  # single chars, f2, `, etc. -> lowercase (matches lib/keys)


def parse_keys(shortcut: str):
    raw = shortcut.replace(" ", "+").split("+")
    toks = [norm_token(t) for t in raw if t.strip()]
    mods = [m for m in MOD_ORDER if m in toks]
    rest = [t for t in toks if t not in MODS]
    # dedupe rest preserving order
    seen, rest2 = set(), []
    for t in rest:
        if t not in seen:
            seen.add(t)
            rest2.append(t)
    return mods + rest2


# ---- category mapping: 11 xlsx cats -> 5 db cats --------------------------
CATEGORY_MAP = {
    "editing": "editing",
    "formatting": "editing",
    "file": "productivity",
    "file management": "productivity",
    "development": "productivity",
    "search": "navigation",
    "navigation": "navigation",
    "browser": "browser",
    "system": "system",
    "security": "system",
    "general": "productivity",
}

# ---- application mapping: xlsx Application -> AppId ------------------------
# Concrete single apps map directly; generic / multi-app buckets -> general.
APP_MAP = {
    "vs code": "vscode",
    "chrome": "chrome",
    "firefox": "firefox",
    "edge": "edge",
    "word": "word",
    "excel": "excel",
    "powerpoint": "powerpoint",
    "photoshop": "photoshop",
    "blender": "blender",
    "figma": "figma",
}
GENERIC_APPS = {
    "most apps", "system", "browsers", "file explorer", "docs, ides",
    "word, excel, vs code, browsers", "chrome, firefox, edge",
    "word, google docs",  # spans our Word + a non-primary -> treat as general
}


def map_app(application: str) -> str:
    key = application.strip().lower()
    if key in APP_MAP:
        return APP_MAP[key]
    return "general"


# ---- OS column -> platforms entries ---------------------------------------
OS_TOKENS = {
    "windows": "windows",
    "linux": "linux",
    "macos": "macos",
}


def parse_platforms(os_field: str, action: str):
    parts = [p.strip().lower() for p in os_field.split("/")]
    entries = []
    for p in parts:
        os_id = OS_TOKENS.get(p, "cross")
        entries.append({"name": action, "context": os_field, "os": os_id})
    if not entries:
        entries = [{"name": action, "context": os_field, "os": "cross"}]
    return entries


# ---- generic-action rename: derive a real name from the combo -------------
# The sheet uses the placeholder "Common application shortcut" for many rows;
# the true meaning lives in the key combo. Map combo -> concrete action so
# each (name, app) pair stays distinct and meaningful.
GENERIC_ACTIONS = {"common application shortcut"}
COMBO_NAME = {
    "ctrl+n": "New",
    "ctrl+o": "Open",
    "ctrl+p": "Print",
    "ctrl+f": "Find",
    "ctrl+a": "Select All",
    "ctrl+s": "Save",
    "ctrl+w": "Close",
}
COMBO_DESC = {
    "New": "Create a new document or item.",
    "Open": "Open an existing file.",
    "Print": "Open the print dialog.",
    "Find": "Search within the current document.",
    "Select All": "Select all content in the current view.",
    "Save": "Save the current document.",
    "Close": "Close the current document or tab.",
}


def refine(name, keys, desc):
    if name.strip().lower() not in GENERIC_ACTIONS:
        return name, desc
    combo = "+".join(keys)
    better = COMBO_NAME.get(combo)
    if better:
        return better, COMBO_DESC.get(better, desc)
    return name, desc


# ---- difficulty heuristic --------------------------------------------------
def difficulty(keys):
    n_mod = sum(1 for k in keys if k in MODS)
    if n_mod >= 2:
        return "advanced"
    if n_mod == 1:
        return "intermediate"
    return "beginner"


def sql_str(s: str) -> str:
    return "'" + str(s).replace("'", "''") + "'"


def sql_arr(keys):
    return "array[" + ",".join(sql_str(k) for k in keys) + "]"


def main():
    wb = openpyxl.load_workbook(SRC, read_only=True)
    ws = wb["Shortcuts"]
    rows = list(ws.iter_rows(values_only=True))[1:]

    seen = set()  # (name, app) dedupe within this file
    values = []
    skipped = []
    for shortcut, action, os_field, application, category, explanation in rows:
        if not shortcut or not action:
            continue
        keys = parse_keys(shortcut)
        if not any(k not in MODS for k in keys):
            skipped.append((shortcut, "no main key"))
            continue
        app = map_app(application)
        cat = CATEGORY_MAP.get((category or "general").strip().lower(), "productivity")
        diff = difficulty(keys)
        plats = parse_platforms(os_field or "", action)
        name = action.strip()
        desc = (explanation or action).strip()
        name, desc = refine(name, keys, desc)

        dedupe_key = (name.lower(), app)
        if dedupe_key in seen:
            continue
        seen.add(dedupe_key)

        values.append(
            f"({sql_arr(keys)}, {sql_str(name)}, {sql_str(desc)}, "
            f"{sql_str(json.dumps(plats))}, {sql_str(cat)}, {sql_str(diff)}, {sql_str(app)})"
        )

    header = """-- leaaarrn-it - seed imported from dataas/shortcut_reference_with_context.xlsx
-- Generated by scripts/gen_seed_from_xlsx.py. Run AFTER schema.sql.
-- Idempotent: ON CONFLICT (name, app) refreshes existing rows.
--
-- Requires the app CHECK constraint to allow: edge, blender, googledocs, general.
-- Run supabase/widen_apps.sql first if you have not already.

insert into public.shortcuts (keys, name, description, platforms, category, difficulty, app)
values
"""
    body = ",\n".join(values)
    tail = """

on conflict (name, app) do update set
  keys        = excluded.keys,
  description = excluded.description,
  platforms   = excluded.platforms,
  category    = excluded.category,
  difficulty  = excluded.difficulty;
"""
    with open(OUT, "w") as f:
        f.write(header + body + tail)

    print(f"Wrote {len(values)} rows -> {OUT}")
    if skipped:
        print("Skipped:", skipped)
    # quick app distribution
    from collections import Counter
    dist = Counter(v.rsplit(", ", 1)[-1].strip(") '") for v in values)
    print("App distribution:", dict(dist))


if __name__ == "__main__":
    main()
