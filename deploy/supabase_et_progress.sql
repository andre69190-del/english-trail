-- English Trail – Geräte-Abgleich (selbst gehostetes Supabase: https://supabase.arndt-software.de)
-- Einmal im Supabase Studio → SQL Editor ausführen. Mehrfach ausführen schadet nicht.
-- Pro Konto genau eine Zeile mit dem ganzen Spielstand (JSON). Jeder sieht und ändert nur seine eigene Zeile.

create table if not exists public.et_progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb       not null,
  updated_at timestamptz not null default now(),
  constraint et_progress_size check (pg_column_size(data) < 1000000)
);

create or replace function public.et_touch() returns trigger
language plpgsql set search_path = public as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists et_progress_touch on public.et_progress;
create trigger et_progress_touch before insert or update on public.et_progress
  for each row execute function public.et_touch();

alter table public.et_progress enable row level security;

drop policy if exists "et_select_own" on public.et_progress;
create policy "et_select_own" on public.et_progress for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "et_insert_own" on public.et_progress;
create policy "et_insert_own" on public.et_progress for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "et_update_own" on public.et_progress;
create policy "et_update_own" on public.et_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "et_delete_own" on public.et_progress;
create policy "et_delete_own" on public.et_progress for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on public.et_progress from anon;
grant select, insert, update, delete on public.et_progress to authenticated;

notify pgrst, 'reload schema';
