-- leaaarrn-it — Supabase schema
-- Run this in the Supabase Dashboard → SQL Editor → New query, then "Run".
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / drop-before-create).

-- ---------------------------------------------------------------------------
-- shortcuts
-- Mirrors the Shortcut type in lib/types.ts. Queried by app/api/shortcuts/route.ts
-- via .eq("app"), .eq("category"), and .contains("keys", [...]).
-- ---------------------------------------------------------------------------
create table if not exists public.shortcuts (
  id          uuid primary key default gen_random_uuid(),
  keys        text[]      not null,                        -- e.g. {ctrl,shift,n}
  name        text        not null,
  description text        not null,
  platforms   jsonb       not null default '[]'::jsonb,     -- [{name,context,os}]
  category    text        not null
                check (category in
                  ('navigation','editing','system','browser','productivity')),
  difficulty  text        not null
                check (difficulty in ('beginner','intermediate','advanced')),
  app         text        not null
                check (app in
                  ('windows','macos','linux','chrome','firefox',
                   'vscode','excel','word','figma',
                   'powerpoint','slack','photoshop','notion','gmail',
                   'edge','blender','googledocs','googlesheets',
                   'bash','powershell','git','gnome','kde','general')),
  created_at  timestamptz not null default now(),
  -- Required by the upsert in scripts/seed.ts (onConflict: "name,app")
  -- and by the ON CONFLICT clause in seed.sql.
  unique (name, app)
);

-- GIN index makes the `.contains("keys", [...])` array query fast.
create index if not exists shortcuts_keys_gin on public.shortcuts using gin (keys);

-- B-tree indexes for the .eq("app") / .eq("category") filters.
create index if not exists shortcuts_app_idx      on public.shortcuts (app);
create index if not exists shortcuts_category_idx on public.shortcuts (category);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- All current reads use the service role key (lib/supabase/server.ts), which
-- bypasses RLS. RLS is enabled here so Supabase does not flag the table.
-- The policy below also permits public (anon) read in case you wire up the
-- browser client (lib/supabase/client.ts) later. Drop the policy if you want
-- server-only access.
-- ---------------------------------------------------------------------------
alter table public.shortcuts enable row level security;

drop policy if exists "public read shortcuts" on public.shortcuts;
create policy "public read shortcuts"
  on public.shortcuts for select
  to anon, authenticated
  using (true);
