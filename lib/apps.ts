// Catalog of all apps users can browse, grouped for the sidebar.
// `id` must match the AppId union in lib/types.ts and the DB `app` column.

import type { AppId } from "./types";

export interface AppMeta {
  id: AppId;
  label: string;
  icon: string; // emoji glyph, no extra deps
}

export interface AppGroup {
  title: string;
  apps: AppMeta[];
}

export const APP_GROUPS: AppGroup[] = [
  {
    title: "Operating Systems",
    apps: [
      { id: "windows", label: "Windows", icon: "🪟" },
      { id: "macos", label: "macOS", icon: "🍎" },
      { id: "linux", label: "Linux", icon: "🐧" },
    ],
  },
  {
    title: "Browsers",
    apps: [
      { id: "chrome", label: "Chrome", icon: "🌐" },
      { id: "firefox", label: "Firefox", icon: "🦊" },
    ],
  },
  {
    title: "Software & Tools",
    apps: [
      { id: "vscode", label: "VS Code", icon: "💻" },
      { id: "excel", label: "Excel", icon: "📊" },
      { id: "word", label: "Word", icon: "📝" },
      { id: "powerpoint", label: "PowerPoint", icon: "📽️" },
      { id: "figma", label: "Figma", icon: "🎨" },
      { id: "photoshop", label: "Photoshop", icon: "🖼️" },
      { id: "notion", label: "Notion", icon: "🗒️" },
      { id: "slack", label: "Slack", icon: "💬" },
      { id: "gmail", label: "Gmail", icon: "✉️" },
    ],
  },
];

// Flat lookup for labels/icons by id.
export const APP_BY_ID: Record<string, AppMeta> = Object.fromEntries(
  APP_GROUPS.flatMap((g) => g.apps).map((a) => [a.id, a]),
);
