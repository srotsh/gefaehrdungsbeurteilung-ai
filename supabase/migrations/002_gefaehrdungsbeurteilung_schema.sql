-- GefaehrdungsbeurteilungAI — Produkt-Schema.
-- Setzt 001_engine_schema.sql voraus (accounts, users, RLS-Muster).

-- Arbeitsbereiche: raeumlich/organisatorisch abgegrenzte Einheiten, fuer die
-- jeweils eine Gefaehrdungsbeurteilung erstellt wird.
create table if not exists arbeitsbereiche (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  name text not null,
  branche text not null check (branche in (
    'buero','handwerk_werkstatt','bau','gastro','einzelhandel',
    'logistik_lager','pflege','kfz','friseur_kosmetik','produktion'
  )),
  standort text,
  beschreibung text,
  created_at timestamptz default now()
);
create index if not exists idx_arbeitsbereiche_account on arbeitsbereiche(account_id);

-- Gefaehrdungsbeurteilungen: ein Dokument pro Arbeitsbereich und Revision.
-- Taetigkeiten/Gefaehrdungen leben strukturiert in gbu_data (Zod-validiert);
-- die Risikostufe wird deterministisch in lib/risiko/nohl.ts berechnet.
create table if not exists gbus (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  arbeitsbereich_id uuid not null references arbeitsbereiche(id) on delete cascade,
  revision int not null default 1,
  status text not null default 'draft' check (status in (
    'draft','review','finalized'
  )),
  input_mode text not null default 'voice' check (input_mode in ('voice','checkliste')),
  recording_path text,
  foto_paths jsonb default '[]'::jsonb,
  transcript_raw text,
  gbu_data jsonb,
  pruefen_markers jsonb default '[]'::jsonb,
  -- Wiedervorlage: regelmaessige Ueberpruefung (Standard: +12 Monate ab
  -- Finalisierung; Trigger-Ereignisse wie Unfall/neue Maschine setzen frueher).
  next_review_at date,
  finalized_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_gbus_account on gbus(account_id, created_at desc);
create index if not exists idx_gbus_bereich on gbus(arbeitsbereich_id, revision desc);
create index if not exists idx_gbus_review on gbus(account_id, next_review_at) where status = 'finalized';

-- Massnahmen werden bei Finalisierung aus gbu_data extrahiert -> trackbar
-- (Dashboard, Fristen-Reminder, Wirksamkeitspruefung).
create table if not exists massnahmen (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  gbu_id uuid not null references gbus(id) on delete cascade,
  arbeitsbereich_id uuid not null references arbeitsbereiche(id) on delete cascade,
  taetigkeit text not null,
  gefaehrdung text not null,
  faktor text not null,
  risikostufe int not null check (risikostufe between 1 and 3),
  beschreibung text not null,
  stop_kategorie text not null check (stop_kategorie in (
    'substitution','technisch','organisatorisch','persoenlich'
  )),
  verantwortlich text,
  frist date,
  status text not null default 'offen' check (status in (
    'offen','in_umsetzung','erledigt','wirksamkeit_geprueft'
  )),
  wirksamkeit_geprueft_am date,
  erinnert_am timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_massnahmen_account on massnahmen(account_id, status, frist);
create index if not exists idx_massnahmen_gbu on massnahmen(gbu_id);

-- RLS (Standard-Muster der Engine)
alter table arbeitsbereiche enable row level security;
alter table gbus enable row level security;
alter table massnahmen enable row level security;

create policy arbeitsbereiche_account on arbeitsbereiche
  using (account_id in (select account_id from users where id = auth.uid()))
  with check (account_id in (select account_id from users where id = auth.uid()));

create policy gbus_account on gbus
  using (account_id in (select account_id from users where id = auth.uid()))
  with check (account_id in (select account_id from users where id = auth.uid()));

create policy massnahmen_account on massnahmen
  using (account_id in (select account_id from users where id = auth.uid()))
  with check (account_id in (select account_id from users where id = auth.uid()));
