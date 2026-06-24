// Shared domain types — single source of truth for all modules.

export type AppId =
  | "windows"
  | "macos"
  | "linux"
  | "chrome"
  | "firefox"
  | "vscode"
  | "excel"
  | "word"
  | "figma"
  | "powerpoint"
  | "slack"
  | "photoshop"
  | "notion"
  | "gmail"
  | "edge"
  | "blender"
  | "googledocs"
  | "general";

export type Category =
  | "navigation"
  | "editing"
  | "system"
  | "browser"
  | "productivity";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type OS = "windows" | "macos" | "linux" | "cross";

export interface PlatformEntry {
  name: string; // what the combo does here, e.g. "New Incognito Window"
  context: string; // where/which app, e.g. "Chrome / Edge / Brave"
  os: OS;
}

export interface Shortcut {
  id: string;
  keys: string[]; // normalized, e.g. ["ctrl","shift","n"]
  name: string;
  description: string;
  platforms: PlatformEntry[];
  category: Category;
  difficulty: Difficulty;
  app: AppId;
  created_at?: string;
}

// Seed rows omit db-generated fields.
export type ShortcutSeed = Omit<Shortcut, "id" | "created_at">;
