-- Migration: shortcuts table for the leaaarrn-it keyboard-shortcut platform.

create table if not exists shortcuts (
  id uuid primary key default gen_random_uuid(),
  keys text[] not null,
  name text not null,
  description text not null,
  platforms jsonb not null default '[]'::jsonb,
  category text not null,
  difficulty text not null,
  app text not null,
  created_at timestamptz not null default now()
);

-- Natural key used by the seed upsert (onConflict: "name,app").
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'shortcuts_name_app_key'
  ) then
    alter table shortcuts
      add constraint shortcuts_name_app_key unique (name, app);
  end if;
end $$;

-- Indexes for the explorer/search surface.
create index if not exists shortcuts_keys_gin on shortcuts using gin (keys);
create index if not exists shortcuts_app_idx on shortcuts (app);
create index if not exists shortcuts_category_idx on shortcuts (category);

-- Row Level Security: public read-only; writes go through the service role
-- (which bypasses RLS), so no insert/update/delete policy is defined.
alter table shortcuts enable row level security;

drop policy if exists "public read shortcuts" on shortcuts;
create policy "public read shortcuts" on shortcuts for select using (true);
