import { readFileSync } from "node:fs";
import { join } from "node:path";

import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { sortCombo } from "../lib/keys";
import type {
  AppId,
  Category,
  Difficulty,
  OS,
  PlatformEntry,
  ShortcutSeed,
} from "../lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
  );
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});

const CSV_PATH = join(
  process.cwd(),
  "dataas",
  "ai_shortcut_knowledgebase_6000plus.csv",
);
const BATCH_SIZE = 500;

const KEY_ALIASES: Record<string, string> = {
  control: "ctrl",
  ctrl: "ctrl",
  command: "meta",
  cmd: "meta",
  meta: "meta",
  win: "meta",
  windows: "meta",
  option: "alt",
  alt: "alt",
  shift: "shift",
  escape: "esc",
  esc: "esc",
  return: "enter",
  enter: "enter",
  spacebar: "space",
  space: "space",
  del: "delete",
};

const APP_MAP: Record<string, AppId> = {
  bash: "bash",
  blender: "blender",
  chrome: "chrome",
  edge: "edge",
  excel: "excel",
  figma: "figma",
  firefox: "firefox",
  git: "git",
  gnome: "gnome",
  "google docs": "googledocs",
  "google sheets": "googlesheets",
  "kde plasma": "kde",
  macos: "macos",
  photoshop: "photoshop",
  powershell: "powershell",
  powerpoint: "powerpoint",
  "vs code": "vscode",
  windows: "windows",
  word: "word",
};

const LEGACY_APP_IDS = new Set<AppId>([
  "windows",
  "macos",
  "linux",
  "chrome",
  "firefox",
  "vscode",
  "excel",
  "word",
  "figma",
  "powerpoint",
  "slack",
  "photoshop",
  "notion",
  "gmail",
  "edge",
  "blender",
  "googledocs",
  "general",
]);

const CATEGORY_MAP: Record<string, Category> = {
  "3d": "productivity",
  browser: "browser",
  design: "productivity",
  desktop: "system",
  developer: "productivity",
  "file explorer": "productivity",
  finder: "productivity",
  "generated index": "productivity",
  ide: "productivity",
  office: "productivity",
  system: "system",
  terminal: "productivity",
};

const OS_MAP: Record<string, OS> = {
  windows: "windows",
  macos: "macos",
  linux: "linux",
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
      continue;
    }

    if (ch === '"') {
      quoted = !quoted;
      continue;
    }

    if (ch === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") {
        i += 1;
      }
      row.push(cell);
      if (row.some((value) => value.length > 0)) {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += ch;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function normalizeKey(token: string): string {
  const key = token.trim().toLowerCase();
  return KEY_ALIASES[key] ?? key.replace(/\s+/g, "");
}

function parseKeys(shortcut: string): string[] {
  const keys = shortcut
    .split("+")
    .map(normalizeKey)
    .filter(Boolean);

  return sortCombo(Array.from(new Set(keys)));
}

function mapApp(application: string, expandedApps: boolean): AppId {
  const app = APP_MAP[application.trim().toLowerCase()] ?? "general";
  return expandedApps || LEGACY_APP_IDS.has(app) ? app : "general";
}

function mapCategory(category: string): Category {
  return CATEGORY_MAP[category.trim().toLowerCase()] ?? "productivity";
}

function mapDifficulty(frequency: string): Difficulty {
  switch (frequency.trim().toLowerCase()) {
    case "high":
      return "beginner";
    case "medium":
      return "intermediate";
    default:
      return "advanced";
  }
}

function parsePlatforms(osField: string, action: string, app: string): PlatformEntry[] {
  const parts = osField
    .split("/")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  const platforms = parts.map((part) => ({
    name: action,
    context: `${app} (${osField})`,
    os: OS_MAP[part] ?? "cross",
  }));

  return platforms.length > 0
    ? platforms
    : [{ name: action, context: app, os: "cross" }];
}

function buildRows(expandedApps: boolean): ShortcutSeed[] {
  const rows = parseCsv(readFileSync(CSV_PATH, "utf8"));
  const [, ...records] = rows;
  const seenNames = new Map<string, number>();

  return records.map(
    ([
      shortcut = "",
      action = "",
      application = "",
      os = "",
      category = "",
      description = "",
      frequency = "",
    ]) => {
      const app = mapApp(application, expandedApps);
      const keys = parseKeys(shortcut);
      const combo = shortcut.trim();
      const baseName =
        action.trim().toLowerCase() === "application shortcut"
          ? `${action.trim()} (${combo})`
          : action.trim();
      const nameKey = `${app}:${baseName.toLowerCase()}`;
      const duplicateCount = seenNames.get(nameKey) ?? 0;
      seenNames.set(nameKey, duplicateCount + 1);

      return {
        keys,
        name:
          duplicateCount === 0
            ? baseName
            : `${baseName} - ${category.trim() || "General"} ${duplicateCount + 1}`,
        description: description.trim() || `${action.trim()} shortcut in ${application.trim()}.`,
        platforms: parsePlatforms(os, action.trim(), application.trim()),
        category: mapCategory(category),
        difficulty: mapDifficulty(frequency),
        app,
      };
    },
  );
}

async function seedRows(rows: ShortcutSeed[]): Promise<void> {
  let seeded = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from("shortcuts")
      .upsert(batch, { onConflict: "name,app" });

    if (error) {
      throw new Error(error.message);
    }

    seeded += batch.length;
    console.log(`Seeded ${seeded}/${rows.length} shortcuts...`);
  }

  console.log(`Seed complete: ${seeded} shortcuts from ${CSV_PATH}.`);
}

async function main(): Promise<void> {
  const expandedRows = buildRows(true);

  try {
    await seedRows(expandedRows);
    return;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!/shortcuts_app_check|check constraint/i.test(message)) {
      throw err;
    }

    console.warn(
      "Expanded app seed rejected by shortcuts_app_check. Retrying with CSV-only apps grouped under general.",
    );
    await seedRows(buildRows(false));
  }
}

main().catch((err: unknown) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
