-- English Trail – Fehler melden (selbst gehostetes Supabase: https://supabase.arndt-software.de)
-- Einmal im Supabase Studio → SQL Editor ausführen. Mehrfach ausführen schadet nicht.
-- Jeder darf eine Meldung EINFÜGEN (auch ohne Konto), aber niemand kann Meldungen über die API lesen.
-- Gespeichert werden nur: Text der Meldung, Übungs-Kontext, Basissprache, App-Version, Zeitpunkt. Keine Konto-ID, keine IP.
-- Lesen: im Studio (Table Editor → et_feedback) oder per SQL: select * from public.et_feedback order by created_at desc;

create table if not exists public.et_feedback (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  msg        text not null check (char_length(msg) between 1 and 1000),
  ctx        text check (ctx is null or char_length(ctx) <= 500),
  lang       text check (lang is null or lang in ('de', 'en')),
  ver        text check (ver is null or char_length(ver) <= 20)
);

alter table public.et_feedback enable row level security;

drop policy if exists "et_feedback_insert" on public.et_feedback;
create policy "et_feedback_insert" on public.et_feedback for insert to anon, authenticated with check (true);

revoke all on public.et_feedback from anon, authenticated;
grant insert on public.et_feedback to anon, authenticated;

notify pgrst, 'reload schema';
