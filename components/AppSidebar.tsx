"use client";

import { APP_GROUPS } from "@/lib/apps";
import type { AppId } from "@/lib/types";

interface AppSidebarProps {
  selected: AppId | null;
  onSelect: (app: AppId | null) => void;
}

export default function AppSidebar({ selected, onSelect }: AppSidebarProps) {
  return (
    <nav
      aria-label="Browse shortcuts by app"
      className="flex flex-col gap-5"
    >
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={[
          "w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
          selected === null
            ? "bg-accent text-white"
            : "text-gray-600 hover:bg-accent/10 hover:text-accent",
        ].join(" ")}
      >
        ⌨️ Search by combo
      </button>

      {APP_GROUPS.map((group) => (
        <div key={group.title}>
          <h3 className="px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {group.title}
          </h3>
          <ul className="mt-2 flex flex-col gap-0.5">
            {group.apps.map((app) => {
              const active = selected === app.id;
              return (
                <li key={app.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(app.id)}
                    aria-current={active ? "true" : undefined}
                    className={[
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all",
                      active
                        ? "bg-accent/10 font-semibold text-accent ring-1 ring-accent/30"
                        : "text-gray-700 hover:bg-gray-100",
                    ].join(" ")}
                  >
                    <span className="text-base leading-none" aria-hidden>
                      {app.icon}
                    </span>
                    <span>{app.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
