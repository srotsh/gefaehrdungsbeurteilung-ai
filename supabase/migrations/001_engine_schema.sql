-- Engine schema (shared across all Flow-portfolio products).
-- Provides accounts/users (multi-tenant), product_subscriptions (Stripe sync),
-- wegs (referenced by ProtokollFlow + JahresabrechnungAI), and audit_log.
-- Apply this BEFORE any product-specific migration.

create extension if not exists "pgcrypto";

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

create index if not exists idx_users_account on users(account_id);

create table if not exists product_subscriptions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  product text not null,
  stripe_subscription_id text,
  stripe_customer_id text,
  status text not null default 'inactive',
  plan text default 'free',
  current_period_end timestamptz,
  usage_this_period jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(account_id, product)
);

create table if not exists usage_events (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  product text not null,
  event_type text not null,
  quantity int not null default 1,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_usage_events_account on usage_events(account_id, product, created_at desc);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete set null,
  user_id uuid references users(id) on delete set null,
  product text,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_audit_account on audit_log(account_id, created_at desc);

-- Shared WEG table (used by ProtokollFlow + JahresabrechnungAI).
-- Other products simply ignore it.
create table if not exists wegs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  name text not null,
  address text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_wegs_account on wegs(account_id);

-- Idempotency log for Stripe webhooks.
create table if not exists stripe_webhook_events (
  event_id text primary key,
  type text not null,
  received_at timestamptz default now(),
  processed_at timestamptz,
  payload jsonb
);

-- ----------------------------------------------------------------------------
-- Trigger: when a new auth.user signs up, auto-create account + users row.
-- ----------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_account_id uuid;
  display_name text;
  company_name text;
begin
  display_name := coalesce(new.raw_user_meta_data->>'full_name', new.email);
  company_name := coalesce(new.raw_user_meta_data->>'company_name', display_name);

  insert into accounts (name) values (company_name)
  returning id into new_account_id;

  insert into users (id, account_id, full_name)
  values (new.id, new_account_id, display_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table accounts              enable row level security;
alter table users                 enable row level security;
alter table product_subscriptions enable row level security;
alter table audit_log             enable row level security;
alter table wegs                  enable row level security;

create policy accounts_self on accounts
  using (id in (select account_id from users where id = auth.uid()));

create policy users_self on users
  using (id = auth.uid() or account_id in (select account_id from users where id = auth.uid()));

create policy product_subscriptions_self on product_subscriptions
  using (account_id in (select account_id from users where id = auth.uid()));

create policy audit_log_self on audit_log
  using (account_id in (select account_id from users where id = auth.uid()));

create policy wegs_account on wegs
  using (account_id in (select account_id from users where id = auth.uid()));
