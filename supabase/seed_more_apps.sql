-- leaaarrn-it — add more apps (PowerPoint, Slack, Photoshop, Notion, Gmail)
-- Run this AFTER schema.sql + seed.sql, once, in the Supabase SQL Editor.
-- Idempotent: re-running widens the constraint harmlessly and upserts rows.

-- ---------------------------------------------------------------------------
-- 1) Widen the app CHECK constraint to include the new apps.
--    Supabase auto-names the constraint "shortcuts_app_check".
-- ---------------------------------------------------------------------------
alter table public.shortcuts drop constraint if exists shortcuts_app_check;
alter table public.shortcuts add constraint shortcuts_app_check
  check (app in (
    'windows','macos','linux','chrome','firefox','vscode',
    'excel','word','figma',
    'powerpoint','slack','photoshop','notion','gmail'
  ));

-- ---------------------------------------------------------------------------
-- 2) Insert shortcut rows for the new apps.
-- ---------------------------------------------------------------------------
insert into public.shortcuts (keys, name, description, platforms, category, difficulty, app)
values

-- ===========================================================================
-- POWERPOINT
-- ===========================================================================
(array['f5'], 'Start Slideshow', 'Start the presentation from the first slide.',
  '[{"name":"Start Slideshow","context":"PowerPoint","os":"windows"}]', 'productivity', 'beginner', 'powerpoint'),
(array['shift','f5'], 'Present From Current', 'Start the slideshow from the current slide.',
  '[{"name":"Present From Current","context":"PowerPoint","os":"windows"}]', 'productivity', 'intermediate', 'powerpoint'),
(array['ctrl','m'], 'New Slide', 'Insert a new slide.',
  '[{"name":"New Slide","context":"PowerPoint","os":"windows"}]', 'editing', 'beginner', 'powerpoint'),
(array['ctrl','d'], 'Duplicate Slide', 'Duplicate the selected slide or object.',
  '[{"name":"Duplicate","context":"PowerPoint","os":"windows"}]', 'editing', 'beginner', 'powerpoint'),
(array['esc'], 'End Slideshow', 'Exit the running presentation.',
  '[{"name":"End Slideshow","context":"PowerPoint","os":"windows"}]', 'navigation', 'beginner', 'powerpoint'),
(array['b'], 'Black Screen', 'Toggle a black screen during a presentation.',
  '[{"name":"Black Screen","context":"PowerPoint (during show)","os":"windows"}]', 'navigation', 'intermediate', 'powerpoint'),
(array['ctrl','shift','greater'], 'Grow Font', 'Increase the font size of the selection.',
  '[{"name":"Grow Font","context":"PowerPoint","os":"windows"}]', 'editing', 'beginner', 'powerpoint'),
(array['ctrl','g'], 'Group Objects', 'Group the selected objects.',
  '[{"name":"Group","context":"PowerPoint","os":"windows"}]', 'editing', 'intermediate', 'powerpoint'),
(array['ctrl','shift','g'], 'Ungroup Objects', 'Ungroup the selected group.',
  '[{"name":"Ungroup","context":"PowerPoint","os":"windows"}]', 'editing', 'intermediate', 'powerpoint'),
(array['alt','f5'], 'Presenter View', 'Start the presentation in Presenter View.',
  '[{"name":"Presenter View","context":"PowerPoint","os":"windows"}]', 'productivity', 'advanced', 'powerpoint'),

-- ===========================================================================
-- SLACK
-- ===========================================================================
(array['ctrl','k'], 'Quick Switcher', 'Jump to a channel or direct message.',
  '[{"name":"Quick Switcher","context":"Slack (Win/Linux)","os":"windows"},{"name":"Quick Switcher","context":"Slack macOS uses Cmd+K","os":"macos"}]', 'navigation', 'beginner', 'slack'),
(array['ctrl','shift','k'], 'Browse DMs', 'Open the direct messages list.',
  '[{"name":"Browse DMs","context":"Slack","os":"windows"}]', 'navigation', 'intermediate', 'slack'),
(array['ctrl','shift','t'], 'Open Threads', 'Open the threads view.',
  '[{"name":"Threads","context":"Slack","os":"windows"}]', 'navigation', 'intermediate', 'slack'),
(array['ctrl','shift','a'], 'All Unreads', 'Open all unread messages.',
  '[{"name":"All Unreads","context":"Slack","os":"windows"}]', 'navigation', 'intermediate', 'slack'),
(array['ctrl','shift','m'], 'Mentions & Reactions', 'Open mentions and reactions.',
  '[{"name":"Mentions","context":"Slack","os":"windows"}]', 'navigation', 'intermediate', 'slack'),
(array['ctrl','enter'], 'Send Message', 'Send the current message (when Enter inserts a newline).',
  '[{"name":"Send","context":"Slack","os":"windows"}]', 'productivity', 'beginner', 'slack'),
(array['ctrl','shift','backslash'], 'Add Reaction', 'React to the highlighted message.',
  '[{"name":"React","context":"Slack","os":"windows"}]', 'productivity', 'intermediate', 'slack'),
(array['ctrl','shift','enter'], 'Open Reply', 'Reply in thread to the highlighted message.',
  '[{"name":"Reply in Thread","context":"Slack","os":"windows"}]', 'productivity', 'intermediate', 'slack'),
(array['ctrl','period'], 'Open Shortcuts Menu', 'Open the shortcuts/actions menu.',
  '[{"name":"Shortcuts Menu","context":"Slack","os":"windows"}]', 'productivity', 'advanced', 'slack'),
(array['ctrl','f'], 'Search', 'Search messages and files.',
  '[{"name":"Search","context":"Slack","os":"windows"}]', 'navigation', 'beginner', 'slack'),
(array['ctrl','shift','y'], 'Set Status', 'Open the set-status dialog.',
  '[{"name":"Set Status","context":"Slack","os":"windows"}]', 'productivity', 'intermediate', 'slack'),

-- ===========================================================================
-- PHOTOSHOP
-- ===========================================================================
(array['v'], 'Move Tool', 'Activate the move tool.',
  '[{"name":"Move Tool","context":"Photoshop","os":"windows"}]', 'editing', 'beginner', 'photoshop'),
(array['m'], 'Marquee Tool', 'Activate the rectangular marquee selection tool.',
  '[{"name":"Marquee","context":"Photoshop","os":"windows"}]', 'editing', 'beginner', 'photoshop'),
(array['b'], 'Brush Tool', 'Activate the brush tool.',
  '[{"name":"Brush","context":"Photoshop","os":"windows"}]', 'editing', 'beginner', 'photoshop'),
(array['e'], 'Eraser Tool', 'Activate the eraser tool.',
  '[{"name":"Eraser","context":"Photoshop","os":"windows"}]', 'editing', 'beginner', 'photoshop'),
(array['l'], 'Lasso Tool', 'Activate the lasso selection tool.',
  '[{"name":"Lasso","context":"Photoshop","os":"windows"}]', 'editing', 'beginner', 'photoshop'),
(array['ctrl','j'], 'Duplicate Layer', 'Duplicate the active layer.',
  '[{"name":"Duplicate Layer","context":"Photoshop (Win)","os":"windows"},{"name":"Duplicate Layer","context":"Photoshop macOS uses Cmd+J","os":"macos"}]', 'editing', 'intermediate', 'photoshop'),
(array['ctrl','shift','n'], 'New Layer', 'Create a new layer.',
  '[{"name":"New Layer","context":"Photoshop","os":"windows"}]', 'editing', 'intermediate', 'photoshop'),
(array['ctrl','t'], 'Free Transform', 'Freely transform the selection or layer.',
  '[{"name":"Free Transform","context":"Photoshop","os":"windows"}]', 'editing', 'intermediate', 'photoshop'),
(array['ctrl','shift','i'], 'Invert Selection', 'Invert the current selection.',
  '[{"name":"Invert Selection","context":"Photoshop","os":"windows"}]', 'editing', 'intermediate', 'photoshop'),
(array['ctrl','d'], 'Deselect', 'Deselect the current selection.',
  '[{"name":"Deselect","context":"Photoshop","os":"windows"}]', 'editing', 'beginner', 'photoshop'),
(array['ctrl','alt','z'], 'Step Backward', 'Undo through the history one step at a time.',
  '[{"name":"Step Backward","context":"Photoshop","os":"windows"}]', 'editing', 'intermediate', 'photoshop'),
(array['ctrl','shift','alt','e'], 'Stamp Visible', 'Merge all visible layers into a new layer.',
  '[{"name":"Stamp Visible","context":"Photoshop","os":"windows"}]', 'editing', 'advanced', 'photoshop'),
(array['x'], 'Swap Colors', 'Swap the foreground and background colors.',
  '[{"name":"Swap Colors","context":"Photoshop","os":"windows"}]', 'editing', 'beginner', 'photoshop'),

-- ===========================================================================
-- NOTION
-- ===========================================================================
(array['ctrl','n'], 'New Page', 'Create a new page.',
  '[{"name":"New Page","context":"Notion (Win/Linux)","os":"windows"},{"name":"New Page","context":"Notion macOS uses Cmd+N","os":"macos"}]', 'productivity', 'beginner', 'notion'),
(array['ctrl','p'], 'Quick Find', 'Open quick find / search.',
  '[{"name":"Quick Find","context":"Notion","os":"windows"}]', 'navigation', 'beginner', 'notion'),
(array['ctrl','shift','p'], 'Open Recent', 'Open the recently visited pages list.',
  '[{"name":"Open Recent","context":"Notion","os":"windows"}]', 'navigation', 'intermediate', 'notion'),
(array['ctrl','shift','l'], 'Toggle Dark Mode', 'Switch between light and dark mode.',
  '[{"name":"Dark Mode","context":"Notion","os":"windows"}]', 'system', 'beginner', 'notion'),
(array['ctrl','shift','n'], 'New Window', 'Open a new Notion window.',
  '[{"name":"New Window","context":"Notion","os":"windows"}]', 'navigation', 'intermediate', 'notion'),
(array['ctrl','enter'], 'Toggle Checkbox', 'Check or uncheck a to-do item / toggle.',
  '[{"name":"Toggle Checkbox","context":"Notion","os":"windows"}]', 'editing', 'beginner', 'notion'),
(array['ctrl','shift','u'], 'Go to Parent', 'Navigate up to the parent page.',
  '[{"name":"Parent Page","context":"Notion","os":"windows"}]', 'navigation', 'intermediate', 'notion'),
(array['ctrl','alt','t'], 'Toggle Collapse', 'Expand or collapse all toggles on the page.',
  '[{"name":"Toggle Collapse","context":"Notion","os":"windows"}]', 'editing', 'advanced', 'notion'),
(array['ctrl','shift','k'], 'Open Page in Peek', 'Open a linked page in a side peek.',
  '[{"name":"Peek","context":"Notion","os":"windows"}]', 'navigation', 'intermediate', 'notion'),
(array['ctrl','e'], 'Inline Code', 'Format the selected text as inline code.',
  '[{"name":"Inline Code","context":"Notion","os":"windows"}]', 'editing', 'intermediate', 'notion'),

-- ===========================================================================
-- GMAIL (web; keyboard shortcuts must be enabled in settings)
-- ===========================================================================
(array['c'], 'Compose', 'Start composing a new email.',
  '[{"name":"Compose","context":"Gmail (web)","os":"cross"}]', 'productivity', 'beginner', 'gmail'),
(array['e'], 'Archive', 'Archive the open or selected conversation.',
  '[{"name":"Archive","context":"Gmail (web)","os":"cross"}]', 'productivity', 'beginner', 'gmail'),
(array['r'], 'Reply', 'Reply to the open conversation.',
  '[{"name":"Reply","context":"Gmail (web)","os":"cross"}]', 'productivity', 'beginner', 'gmail'),
(array['a'], 'Reply All', 'Reply to everyone on the conversation.',
  '[{"name":"Reply All","context":"Gmail (web)","os":"cross"}]', 'productivity', 'beginner', 'gmail'),
(array['f'], 'Forward', 'Forward the open conversation.',
  '[{"name":"Forward","context":"Gmail (web)","os":"cross"}]', 'productivity', 'beginner', 'gmail'),
(array['ctrl','enter'], 'Send Email', 'Send the message being composed.',
  '[{"name":"Send","context":"Gmail (web)","os":"cross"}]', 'productivity', 'beginner', 'gmail'),
(array['slash'], 'Search Mail', 'Place the cursor in the search box.',
  '[{"name":"Search","context":"Gmail (web)","os":"cross"}]', 'navigation', 'beginner', 'gmail'),
(array['g','i'], 'Go to Inbox', 'Jump to the inbox.',
  '[{"name":"Go to Inbox","context":"Gmail (web, press g then i)","os":"cross"}]', 'navigation', 'intermediate', 'gmail'),
(array['g','s'], 'Go to Starred', 'Jump to the starred messages.',
  '[{"name":"Go to Starred","context":"Gmail (web, press g then s)","os":"cross"}]', 'navigation', 'intermediate', 'gmail'),
(array['shift','3'], 'Delete', 'Move the conversation to Trash.',
  '[{"name":"Delete","context":"Gmail (web, # key)","os":"cross"}]', 'productivity', 'beginner', 'gmail'),
(array['shift','i'], 'Mark as Read', 'Mark the selected conversation as read.',
  '[{"name":"Mark Read","context":"Gmail (web)","os":"cross"}]', 'productivity', 'intermediate', 'gmail'),
(array['shift','u'], 'Mark as Unread', 'Mark the selected conversation as unread.',
  '[{"name":"Mark Unread","context":"Gmail (web)","os":"cross"}]', 'productivity', 'intermediate', 'gmail')

on conflict (name, app) do update set
  keys        = excluded.keys,
  description = excluded.description,
  platforms   = excluded.platforms,
  category    = excluded.category,
  difficulty  = excluded.difficulty;
