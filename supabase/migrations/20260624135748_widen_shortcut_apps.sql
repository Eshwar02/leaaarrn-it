alter table public.shortcuts drop constraint if exists shortcuts_app_check;

alter table public.shortcuts add constraint shortcuts_app_check
  check (app in (
    'windows','macos','linux','chrome','firefox','vscode',
    'excel','word','figma',
    'powerpoint','slack','photoshop','notion','gmail',
    'edge','blender','googledocs','googlesheets',
    'bash','powershell','git','gnome','kde','general'
  ));
