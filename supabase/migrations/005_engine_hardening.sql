-- Engine hardening (Audit Phase 2, shared-core 1.13.0).
-- 1. stripe_events: Idempotenz-Log, das @flow/billing tatsaechlich beschreibt
--    (bisher existierte nur stripe_webhook_events mit anderem Spaltennamen,
--    der Insert schlug bei jedem Event fehl -> keine Duplikat-Erkennung).
-- 2. accounts.stripe_customer_id: wird vom Webhook-Handler beschrieben.
-- 3. RLS auf usage_events / stripe_webhook_events / stripe_events.

create table if not exists stripe_events (
  id text primary key,
  type text not null,
  created_at timestamptz default now()
);

alter table accounts add column if not exists stripe_customer_id text;

-- Service-Role umgeht RLS; ohne Policies sind die Tabellen fuer
-- anon/authenticated dicht (deny-all).
alter table stripe_events enable row level security;
alter table stripe_webhook_events enable row level security;
alter table usage_events enable row level security;

-- User duerfen die Usage-Events des eigenen Accounts lesen (Verbrauchsanzeige).
drop policy if exists usage_events_select_own on usage_events;
create policy usage_events_select_own on usage_events
  for select using (account_id in (select account_id from users where id = auth.uid()));
