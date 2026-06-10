-- Lifecycle-/Trial-E-Mails: Versand-Log pro User und Step.
-- Cron /api/cron/user-drip waehlt faellige User und schreibt hier den Versand.

create table if not exists user_drip_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  account_id uuid not null references accounts(id) on delete cascade,
  step int not null,
  sent_at timestamptz default now(),
  unique(user_id, step)
);

alter table user_drip_log enable row level security;
-- Deny-all: nur Service-Role (Cron) schreibt/liest.
