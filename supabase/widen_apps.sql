-- leaaarrn-it - widen the app CHECK constraint for xlsx-imported apps.
-- Run this ONCE before supabase/seed_from_xlsx.sql.
-- Idempotent: drops and recreates the constraint.

alter table public.shortcuts drop constraint if exists shortcuts_app_check;
alter table public.shortcuts add constraint shortcuts_app_check
  check (app in (
    'windows','macos','linux','chrome','firefox','vscode',
    'excel','word','figma',
    'powerpoint','slack','photoshop','notion','gmail',
    'edge','blender','googledocs','general'
  ));
