import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import type { ShortcutSeed } from "../lib/types";

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

// Modifier order is kept consistent as ctrl, alt, shift, meta, then the key.
// The API matches order-independently, so consistency is all that matters.
const rows: ShortcutSeed[] = [
  // ---- Cross-platform editing (primary owner: windows) ----
  {
    keys: ["ctrl", "c"],
    name: "Copy",
    description: "Copy the selected text or item to the clipboard.",
    category: "editing",
    difficulty: "beginner",
    app: "windows",
    platforms: [
      { name: "Copy", context: "Windows (Ctrl+C)", os: "windows" },
      { name: "Copy", context: "Linux (Ctrl+C)", os: "linux" },
      { name: "Copy", context: "macOS uses Cmd+C", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "x"],
    name: "Cut",
    description: "Cut the selection to the clipboard, removing it from the source.",
    category: "editing",
    difficulty: "beginner",
    app: "windows",
    platforms: [
      { name: "Cut", context: "Windows (Ctrl+X)", os: "windows" },
      { name: "Cut", context: "Linux (Ctrl+X)", os: "linux" },
      { name: "Cut", context: "macOS uses Cmd+X", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "v"],
    name: "Paste",
    description: "Paste the clipboard contents at the cursor.",
    category: "editing",
    difficulty: "beginner",
    app: "windows",
    platforms: [
      { name: "Paste", context: "Windows (Ctrl+V)", os: "windows" },
      { name: "Paste", context: "Linux (Ctrl+V)", os: "linux" },
      { name: "Paste", context: "macOS uses Cmd+V", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "z"],
    name: "Undo",
    description: "Reverse the most recent action.",
    category: "editing",
    difficulty: "beginner",
    app: "windows",
    platforms: [
      { name: "Undo", context: "Windows (Ctrl+Z)", os: "windows" },
      { name: "Undo", context: "Linux (Ctrl+Z)", os: "linux" },
      { name: "Undo", context: "macOS uses Cmd+Z", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "y"],
    name: "Redo",
    description: "Reapply the most recently undone action.",
    category: "editing",
    difficulty: "beginner",
    app: "windows",
    platforms: [
      { name: "Redo", context: "Windows (Ctrl+Y)", os: "windows" },
      { name: "Redo", context: "Linux (Ctrl+Y)", os: "linux" },
      { name: "Redo", context: "macOS uses Cmd+Shift+Z", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "a"],
    name: "Select All",
    description: "Select all items or text in the current context.",
    category: "editing",
    difficulty: "beginner",
    app: "windows",
    platforms: [
      { name: "Select All", context: "Windows (Ctrl+A)", os: "windows" },
      { name: "Select All", context: "Linux (Ctrl+A)", os: "linux" },
      { name: "Select All", context: "macOS uses Cmd+A", os: "macos" },
    ],
  },

  // ---- Word ----
  {
    keys: ["ctrl", "s"],
    name: "Save Document",
    description: "Save the current document to disk.",
    category: "productivity",
    difficulty: "beginner",
    app: "word",
    platforms: [
      { name: "Save", context: "Word on Windows (Ctrl+S)", os: "windows" },
      { name: "Save", context: "Word on macOS uses Cmd+S", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "f"],
    name: "Find Text",
    description: "Open Find to search for text in the document.",
    category: "editing",
    difficulty: "beginner",
    app: "word",
    platforms: [
      { name: "Find", context: "Word on Windows (Ctrl+F)", os: "windows" },
      { name: "Find", context: "Word on macOS uses Cmd+F", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "b"],
    name: "Bold",
    description: "Toggle bold formatting on the selected text.",
    category: "editing",
    difficulty: "beginner",
    app: "word",
    platforms: [
      { name: "Bold", context: "Word on Windows (Ctrl+B)", os: "windows" },
      { name: "Bold", context: "Word on macOS uses Cmd+B", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "i"],
    name: "Italic",
    description: "Toggle italic formatting on the selected text.",
    category: "editing",
    difficulty: "beginner",
    app: "word",
    platforms: [
      { name: "Italic", context: "Word on Windows (Ctrl+I)", os: "windows" },
      { name: "Italic", context: "Word on macOS uses Cmd+I", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "u"],
    name: "Underline",
    description: "Toggle underline formatting on the selected text.",
    category: "editing",
    difficulty: "beginner",
    app: "word",
    platforms: [
      { name: "Underline", context: "Word on Windows (Ctrl+U)", os: "windows" },
      { name: "Underline", context: "Word on macOS uses Cmd+U", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "enter"],
    name: "Insert Page Break",
    description: "Insert a page break at the cursor position.",
    category: "editing",
    difficulty: "intermediate",
    app: "word",
    platforms: [
      { name: "Page Break", context: "Word on Windows (Ctrl+Enter)", os: "windows" },
      { name: "Page Break", context: "Word on macOS uses Cmd+Enter", os: "macos" },
    ],
  },

  // ---- Chrome ----
  {
    keys: ["ctrl", "t"],
    name: "New Tab",
    description: "Open a new browser tab.",
    category: "browser",
    difficulty: "beginner",
    app: "chrome",
    platforms: [
      { name: "New Tab", context: "Chrome on Windows/Linux (Ctrl+T)", os: "cross" },
      { name: "New Tab", context: "Chrome on macOS uses Cmd+T", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "w"],
    name: "Close Tab",
    description: "Close the current browser tab.",
    category: "browser",
    difficulty: "beginner",
    app: "chrome",
    platforms: [
      { name: "Close Tab", context: "Chrome on Windows/Linux (Ctrl+W)", os: "cross" },
      { name: "Close Tab", context: "Chrome on macOS uses Cmd+W", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "shift", "t"],
    name: "Reopen Closed Tab",
    description: "Reopen the most recently closed tab.",
    category: "browser",
    difficulty: "intermediate",
    app: "chrome",
    platforms: [
      { name: "Reopen Tab", context: "Chrome on Windows/Linux (Ctrl+Shift+T)", os: "cross" },
      { name: "Reopen Tab", context: "Chrome on macOS uses Cmd+Shift+T", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "n"],
    name: "New Browser Window",
    description: "Open a new browser window.",
    category: "browser",
    difficulty: "beginner",
    app: "chrome",
    platforms: [
      { name: "New Window", context: "Chrome on Windows/Linux (Ctrl+N)", os: "cross" },
      { name: "New Window", context: "Chrome on macOS uses Cmd+N", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "shift", "n"],
    name: "New Incognito Window",
    description: "Open a new private browsing (Incognito) window.",
    category: "browser",
    difficulty: "intermediate",
    app: "chrome",
    platforms: [
      { name: "New Incognito Window", context: "Chrome on Windows/Linux (Ctrl+Shift+N)", os: "cross" },
      { name: "New Incognito Window", context: "Chrome on macOS uses Cmd+Shift+N", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "l"],
    name: "Focus Address Bar",
    description: "Move focus to the address bar (omnibox) and select its contents.",
    category: "navigation",
    difficulty: "beginner",
    app: "chrome",
    platforms: [
      { name: "Focus Address Bar", context: "Chrome on Windows/Linux (Ctrl+L)", os: "cross" },
      { name: "Focus Address Bar", context: "Chrome on macOS uses Cmd+L", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "r"],
    name: "Reload Page",
    description: "Reload the current page.",
    category: "browser",
    difficulty: "beginner",
    app: "chrome",
    platforms: [
      { name: "Reload", context: "Chrome on Windows/Linux (Ctrl+R)", os: "cross" },
      { name: "Reload", context: "Chrome on macOS uses Cmd+R", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "shift", "r"],
    name: "Hard Reload",
    description: "Reload the page bypassing the cache.",
    category: "browser",
    difficulty: "intermediate",
    app: "chrome",
    platforms: [
      { name: "Hard Reload", context: "Chrome on Windows/Linux (Ctrl+Shift+R)", os: "cross" },
      { name: "Hard Reload", context: "Chrome on macOS uses Cmd+Shift+R", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "tab"],
    name: "Next Tab",
    description: "Switch to the next tab to the right.",
    category: "navigation",
    difficulty: "beginner",
    app: "chrome",
    platforms: [
      { name: "Next Tab", context: "Chrome on all platforms (Ctrl+Tab)", os: "cross" },
    ],
  },
  {
    keys: ["ctrl", "f"],
    name: "Find in Page",
    description: "Open the find bar to search within the current page.",
    category: "browser",
    difficulty: "beginner",
    app: "chrome",
    platforms: [
      { name: "Find in Page", context: "Chrome on Windows/Linux (Ctrl+F)", os: "cross" },
      { name: "Find in Page", context: "Chrome on macOS uses Cmd+F", os: "macos" },
    ],
  },

  // ---- Firefox ----
  {
    keys: ["ctrl", "shift", "p"],
    name: "New Private Window",
    description: "Open a new private browsing window in Firefox.",
    category: "browser",
    difficulty: "intermediate",
    app: "firefox",
    platforms: [
      { name: "New Private Window", context: "Firefox on Windows/Linux (Ctrl+Shift+P)", os: "cross" },
      { name: "New Private Window", context: "Firefox on macOS uses Cmd+Shift+P", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "w"],
    name: "Close Tab",
    description: "Close the current tab in Firefox.",
    category: "browser",
    difficulty: "beginner",
    app: "firefox",
    platforms: [
      { name: "Close Tab", context: "Firefox on Windows/Linux (Ctrl+W)", os: "cross" },
      { name: "Close Tab", context: "Firefox on macOS uses Cmd+W", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "shift", "t"],
    name: "Reopen Closed Tab",
    description: "Reopen the most recently closed tab in Firefox.",
    category: "browser",
    difficulty: "intermediate",
    app: "firefox",
    platforms: [
      { name: "Reopen Tab", context: "Firefox on Windows/Linux (Ctrl+Shift+T)", os: "cross" },
      { name: "Reopen Tab", context: "Firefox on macOS uses Cmd+Shift+T", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "t"],
    name: "New Tab",
    description: "Open a new tab in Firefox.",
    category: "browser",
    difficulty: "beginner",
    app: "firefox",
    platforms: [
      { name: "New Tab", context: "Firefox on Windows/Linux (Ctrl+T)", os: "cross" },
      { name: "New Tab", context: "Firefox on macOS uses Cmd+T", os: "macos" },
    ],
  },

  // ---- VS Code ----
  {
    keys: ["ctrl", "shift", "p"],
    name: "Command Palette",
    description: "Open the command palette to run any editor command.",
    category: "productivity",
    difficulty: "beginner",
    app: "vscode",
    platforms: [
      { name: "Command Palette", context: "VS Code on Windows/Linux (Ctrl+Shift+P)", os: "cross" },
      { name: "Command Palette", context: "VS Code on macOS uses Cmd+Shift+P", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "p"],
    name: "Quick Open File",
    description: "Quickly open a file by typing part of its name.",
    category: "navigation",
    difficulty: "beginner",
    app: "vscode",
    platforms: [
      { name: "Quick Open", context: "VS Code on Windows/Linux (Ctrl+P)", os: "cross" },
      { name: "Quick Open", context: "VS Code on macOS uses Cmd+P", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "`"],
    name: "Toggle Integrated Terminal",
    description: "Show or hide the integrated terminal panel.",
    category: "productivity",
    difficulty: "beginner",
    app: "vscode",
    platforms: [
      { name: "Toggle Terminal", context: "VS Code on all platforms (Ctrl+`)", os: "cross" },
    ],
  },
  {
    keys: ["ctrl", "/"],
    name: "Toggle Line Comment",
    description: "Comment or uncomment the current line or selection.",
    category: "editing",
    difficulty: "beginner",
    app: "vscode",
    platforms: [
      { name: "Toggle Comment", context: "VS Code on Windows/Linux (Ctrl+/)", os: "cross" },
      { name: "Toggle Comment", context: "VS Code on macOS uses Cmd+/", os: "macos" },
    ],
  },
  {
    keys: ["alt", "shift", "f"],
    name: "Format Document",
    description: "Reformat the entire document with the configured formatter.",
    category: "editing",
    difficulty: "intermediate",
    app: "vscode",
    platforms: [
      { name: "Format Document", context: "VS Code on Windows (Shift+Alt+F)", os: "windows" },
      { name: "Format Document", context: "VS Code on Linux (Ctrl+Shift+I)", os: "linux" },
      { name: "Format Document", context: "VS Code on macOS uses Shift+Option+F", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "alt", "arrowdown"],
    name: "Add Cursor Below",
    description: "Add an additional cursor on the line below for multi-cursor editing.",
    category: "editing",
    difficulty: "advanced",
    app: "vscode",
    platforms: [
      { name: "Add Cursor Below", context: "VS Code on Windows (Ctrl+Alt+Down)", os: "windows" },
      { name: "Add Cursor Below", context: "VS Code on macOS uses Cmd+Option+Down", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "g"],
    name: "Go to Line",
    description: "Jump to a specific line number in the active file.",
    category: "navigation",
    difficulty: "beginner",
    app: "vscode",
    platforms: [
      { name: "Go to Line", context: "VS Code on Windows/Linux (Ctrl+G)", os: "cross" },
      { name: "Go to Line", context: "VS Code on macOS uses Cmd+G or Ctrl+G", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "shift", "f"],
    name: "Find in Files",
    description: "Search across all files in the workspace.",
    category: "navigation",
    difficulty: "intermediate",
    app: "vscode",
    platforms: [
      { name: "Find in Files", context: "VS Code on Windows/Linux (Ctrl+Shift+F)", os: "cross" },
      { name: "Find in Files", context: "VS Code on macOS uses Cmd+Shift+F", os: "macos" },
    ],
  },
  {
    keys: ["f2"],
    name: "Rename Symbol",
    description: "Rename the symbol under the cursor across the project.",
    category: "editing",
    difficulty: "intermediate",
    app: "vscode",
    platforms: [
      { name: "Rename Symbol", context: "VS Code on all platforms (F2)", os: "cross" },
    ],
  },
  {
    keys: ["ctrl", "k", "s"],
    name: "Save All Files",
    description: "Save every modified file (chord: Ctrl+K then S).",
    category: "productivity",
    difficulty: "intermediate",
    app: "vscode",
    platforms: [
      { name: "Save All", context: "VS Code on Windows/Linux (Ctrl+K S)", os: "cross" },
      { name: "Save All", context: "VS Code on macOS uses Cmd+K S", os: "macos" },
    ],
  },

  // ---- Windows ----
  {
    keys: ["meta", "l"],
    name: "Lock PC",
    description: "Lock the computer and return to the sign-in screen.",
    category: "system",
    difficulty: "beginner",
    app: "windows",
    platforms: [
      { name: "Lock PC", context: "Windows (Win+L)", os: "windows" },
    ],
  },
  {
    keys: ["meta", "e"],
    name: "Open File Explorer",
    description: "Open a new File Explorer window.",
    category: "system",
    difficulty: "beginner",
    app: "windows",
    platforms: [
      { name: "File Explorer", context: "Windows (Win+E)", os: "windows" },
    ],
  },
  {
    keys: ["meta", "tab"],
    name: "Task View",
    description: "Open Task View to see open windows and virtual desktops.",
    category: "navigation",
    difficulty: "beginner",
    app: "windows",
    platforms: [
      { name: "Task View", context: "Windows (Win+Tab)", os: "windows" },
    ],
  },
  {
    keys: ["meta", "arrowleft"],
    name: "Snap Window Left",
    description: "Snap the active window to the left half of the screen.",
    category: "navigation",
    difficulty: "intermediate",
    app: "windows",
    platforms: [
      { name: "Snap Left", context: "Windows (Win+Left)", os: "windows" },
    ],
  },
  {
    keys: ["meta", "d"],
    name: "Show Desktop",
    description: "Minimize all windows to show the desktop, or restore them.",
    category: "navigation",
    difficulty: "beginner",
    app: "windows",
    platforms: [
      { name: "Show Desktop", context: "Windows (Win+D)", os: "windows" },
    ],
  },
  {
    keys: ["shift", "meta", "s"],
    name: "Screenshot Region",
    description: "Capture a selected region of the screen with Snip & Sketch.",
    category: "system",
    difficulty: "intermediate",
    app: "windows",
    platforms: [
      { name: "Snip Region", context: "Windows (Win+Shift+S)", os: "windows" },
    ],
  },
  {
    keys: ["meta", "i"],
    name: "Open Settings",
    description: "Open the Windows Settings app.",
    category: "system",
    difficulty: "beginner",
    app: "windows",
    platforms: [
      { name: "Settings", context: "Windows (Win+I)", os: "windows" },
    ],
  },
  {
    keys: ["ctrl", "shift", "n"],
    name: "New Folder",
    description: "Create a new folder in File Explorer or on the desktop.",
    category: "system",
    difficulty: "beginner",
    app: "windows",
    platforms: [
      { name: "New Folder", context: "Windows File Explorer (Ctrl+Shift+N)", os: "windows" },
    ],
  },

  // ---- macOS ----
  {
    keys: ["meta", "space"],
    name: "Spotlight Search",
    description: "Open Spotlight to search the Mac and launch apps.",
    category: "navigation",
    difficulty: "beginner",
    app: "macos",
    platforms: [
      { name: "Spotlight", context: "macOS (Cmd+Space)", os: "macos" },
    ],
  },
  {
    keys: ["alt", "meta", "esc"],
    name: "Force Quit",
    description: "Open the Force Quit Applications dialog.",
    category: "system",
    difficulty: "intermediate",
    app: "macos",
    platforms: [
      { name: "Force Quit", context: "macOS (Cmd+Option+Esc)", os: "macos" },
    ],
  },
  {
    keys: ["shift", "meta", "4"],
    name: "Screenshot Region",
    description: "Capture a selected region of the screen to a file.",
    category: "system",
    difficulty: "intermediate",
    app: "macos",
    platforms: [
      { name: "Screenshot Region", context: "macOS (Cmd+Shift+4)", os: "macos" },
    ],
  },
  {
    keys: ["meta", "tab"],
    name: "Switch App",
    description: "Cycle forward through open applications.",
    category: "navigation",
    difficulty: "beginner",
    app: "macos",
    platforms: [
      { name: "App Switcher", context: "macOS (Cmd+Tab)", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "meta", "q"],
    name: "Lock Screen",
    description: "Immediately lock the screen.",
    category: "system",
    difficulty: "beginner",
    app: "macos",
    platforms: [
      { name: "Lock Screen", context: "macOS (Cmd+Ctrl+Q)", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "arrowup"],
    name: "Mission Control",
    description: "Open Mission Control to view all windows and spaces.",
    category: "navigation",
    difficulty: "beginner",
    app: "macos",
    platforms: [
      { name: "Mission Control", context: "macOS (Ctrl+Up)", os: "macos" },
    ],
  },

  // ---- Linux (GNOME) ----
  {
    keys: ["ctrl", "alt", "arrowright"],
    name: "Switch Workspace Right",
    description: "Move to the workspace to the right.",
    category: "navigation",
    difficulty: "intermediate",
    app: "linux",
    platforms: [
      { name: "Workspace Right", context: "GNOME on Linux (Ctrl+Alt+Right)", os: "linux" },
    ],
  },
  {
    keys: ["meta", "l"],
    name: "Lock Screen",
    description: "Lock the screen (Super+L on GNOME).",
    category: "system",
    difficulty: "beginner",
    app: "linux",
    platforms: [
      { name: "Lock Screen", context: "GNOME on Linux (Super+L)", os: "linux" },
    ],
  },
  {
    keys: ["ctrl", "alt", "t"],
    name: "Open Terminal",
    description: "Launch a new terminal window.",
    category: "system",
    difficulty: "beginner",
    app: "linux",
    platforms: [
      { name: "Open Terminal", context: "Most Linux desktops (Ctrl+Alt+T)", os: "linux" },
    ],
  },
  {
    keys: ["alt", "f4"],
    name: "Close Application",
    description: "Close the active application window.",
    category: "system",
    difficulty: "beginner",
    app: "linux",
    platforms: [
      { name: "Close Window", context: "Linux desktops (Alt+F4)", os: "linux" },
      { name: "Close Window", context: "Also Alt+F4 on Windows", os: "windows" },
    ],
  },
  {
    keys: ["meta"],
    name: "Activities Overview",
    description: "Open the GNOME Activities overview (Super key).",
    category: "navigation",
    difficulty: "beginner",
    app: "linux",
    platforms: [
      { name: "Activities", context: "GNOME on Linux (Super)", os: "linux" },
    ],
  },

  // ---- Excel ----
  {
    keys: ["f2"],
    name: "Edit Active Cell",
    description: "Enter edit mode in the active cell with the cursor at the end.",
    category: "editing",
    difficulty: "beginner",
    app: "excel",
    platforms: [
      { name: "Edit Cell", context: "Excel on Windows (F2)", os: "windows" },
      { name: "Edit Cell", context: "Excel on macOS uses Ctrl+U or F2", os: "macos" },
    ],
  },
  {
    keys: ["alt", "="],
    name: "AutoSum",
    description: "Insert a SUM formula for the adjacent range.",
    category: "productivity",
    difficulty: "intermediate",
    app: "excel",
    platforms: [
      { name: "AutoSum", context: "Excel on Windows (Alt+=)", os: "windows" },
      { name: "AutoSum", context: "Excel on macOS uses Cmd+Shift+T", os: "macos" },
    ],
  },
  {
    keys: ["alt", "enter"],
    name: "New Line in Cell",
    description: "Insert a line break within the current cell.",
    category: "editing",
    difficulty: "intermediate",
    app: "excel",
    platforms: [
      { name: "New Line in Cell", context: "Excel on Windows (Alt+Enter)", os: "windows" },
      { name: "New Line in Cell", context: "Excel on macOS uses Ctrl+Option+Enter", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "d"],
    name: "Fill Down",
    description: "Copy the top cell of a selection down into the cells below.",
    category: "editing",
    difficulty: "intermediate",
    app: "excel",
    platforms: [
      { name: "Fill Down", context: "Excel on Windows (Ctrl+D)", os: "windows" },
      { name: "Fill Down", context: "Excel on macOS uses Cmd+D", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "1"],
    name: "Format Cells",
    description: "Open the Format Cells dialog.",
    category: "productivity",
    difficulty: "intermediate",
    app: "excel",
    platforms: [
      { name: "Format Cells", context: "Excel on Windows (Ctrl+1)", os: "windows" },
      { name: "Format Cells", context: "Excel on macOS uses Cmd+1", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "g"],
    name: "Go To",
    description: "Open the Go To dialog to jump to a cell or range.",
    category: "navigation",
    difficulty: "intermediate",
    app: "excel",
    platforms: [
      { name: "Go To", context: "Excel on Windows (Ctrl+G)", os: "windows" },
      { name: "Go To", context: "Excel on macOS uses Cmd+G or Ctrl+G", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "shift", "+"],
    name: "Insert Cells",
    description: "Open the Insert dialog to add cells, rows, or columns.",
    category: "editing",
    difficulty: "intermediate",
    app: "excel",
    platforms: [
      { name: "Insert Cells", context: "Excel on Windows (Ctrl+Shift++)", os: "windows" },
      { name: "Insert Cells", context: "Excel on macOS uses Cmd+Shift++", os: "macos" },
    ],
  },

  // ---- Figma ----
  {
    keys: ["ctrl", "\\"],
    name: "Toggle UI",
    description: "Show or hide the Figma interface for a clean canvas.",
    category: "navigation",
    difficulty: "intermediate",
    app: "figma",
    platforms: [
      { name: "Toggle UI", context: "Figma on Windows (Ctrl+\\)", os: "windows" },
      { name: "Toggle UI", context: "Figma on macOS uses Cmd+\\", os: "macos" },
    ],
  },
  {
    keys: ["f"],
    name: "Frame Tool",
    description: "Select the Frame tool to draw frames.",
    category: "editing",
    difficulty: "beginner",
    app: "figma",
    platforms: [
      { name: "Frame Tool", context: "Figma on all platforms (F)", os: "cross" },
    ],
  },
  {
    keys: ["r"],
    name: "Rectangle Tool",
    description: "Select the Rectangle tool.",
    category: "editing",
    difficulty: "beginner",
    app: "figma",
    platforms: [
      { name: "Rectangle Tool", context: "Figma on all platforms (R)", os: "cross" },
    ],
  },
  {
    keys: ["p"],
    name: "Pen Tool",
    description: "Select the Pen tool to draw vector paths.",
    category: "editing",
    difficulty: "beginner",
    app: "figma",
    platforms: [
      { name: "Pen Tool", context: "Figma on all platforms (P)", os: "cross" },
    ],
  },
  {
    keys: ["ctrl", "alt", "k"],
    name: "Create Component",
    description: "Convert the selection into a reusable component.",
    category: "editing",
    difficulty: "advanced",
    app: "figma",
    platforms: [
      { name: "Create Component", context: "Figma on Windows (Ctrl+Alt+K)", os: "windows" },
      { name: "Create Component", context: "Figma on macOS uses Cmd+Option+K", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "g"],
    name: "Group Selection",
    description: "Group the selected layers together.",
    category: "editing",
    difficulty: "beginner",
    app: "figma",
    platforms: [
      { name: "Group", context: "Figma on Windows (Ctrl+G)", os: "windows" },
      { name: "Group", context: "Figma on macOS uses Cmd+G", os: "macos" },
    ],
  },
  {
    keys: ["ctrl", "shift", "g"],
    name: "Ungroup Selection",
    description: "Ungroup the selected group into its child layers.",
    category: "editing",
    difficulty: "beginner",
    app: "figma",
    platforms: [
      { name: "Ungroup", context: "Figma on Windows (Ctrl+Shift+G)", os: "windows" },
      { name: "Ungroup", context: "Figma on macOS uses Cmd+Shift+G", os: "macos" },
    ],
  },
];

async function main(): Promise<void> {
  const { data, error } = await supabase
    .from("shortcuts")
    .upsert(rows, { onConflict: "name,app" })
    .select("id");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  const count = data?.length ?? rows.length;
  console.log(`Seeded ${count} shortcuts (sent ${rows.length} rows).`);
}

main().catch((err: unknown) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
