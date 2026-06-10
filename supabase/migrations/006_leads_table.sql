-- Lead-Magnet email captures
-- Generated via shared-core/scripts/gen-leads-migration.py
--
-- Used by /api/lead-magnet to persist email signups in exchange for
-- gated assets (PDF checklists, templates, ...).
-- Privacy: lower-cased email, optional IP-hash for dedup, double-opt-in
-- via confirmed_at, hard unsubscribe via unsubscribed_at.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  asset text not null,
  source text not null default 'lead-magnet',
  utm_source text,
  utm_campaign text,
  referrer text,
  ip_hash text,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  account_id uuid references accounts(id) on delete set null
);

-- Lookups
create index if not exists idx_leads_email   on leads(email);
create index if not exists idx_leads_asset   on leads(asset, created_at desc);
create index if not exists idx_leads_account on leads(account_id) where account_id is not null;

-- Soft-uniqueness: same email + same asset within a day shouldn't double-fire.
-- Hard-unique would block legitimate re-requests after expiry; the API can
-- handle the soft case in code.
create index if not exists idx_leads_dedup
  on leads(email, asset, (date_trunc('day', created_at)));

-- RLS: leads are administrative — only service_role writes, no public read.
alter table leads enable row level security;

-- No policies = default-deny for anon + authenticated.
-- Service role bypasses RLS, so the API route works.

comment on table leads is
  'Lead-Magnet email captures. Written by /api/lead-magnet via service role.';
